from app.schemas.chat import SessaoViagem, RespostaChat
from app.services.serpAPI import buscar_voos, buscar_hoteis
from app.services.tripAdvisor import buscar_atracoes
from app.services.openWeather import buscar_clima
from app.ia.llm_client import gerar_roteiro
import re

# ── Helpers ──────────────────────────────────────────────────────────────────

def _extrair_numero(texto: str) -> float | None:
    nums = re.findall(r"[\d.,]+", texto.replace(".", "").replace(",", "."))
    try:
        return float(nums[0]) if nums else None
    except ValueError:
        return None


def _extrair_data(texto: str) -> str | None:
    """Aceita formatos: DD/MM/AAAA ou AAAA-MM-DD."""
    match = re.search(r"(\d{2})/(\d{2})/(\d{4})", texto)
    if match:
        return f"{match.group(3)}-{match.group(2)}-{match.group(1)}"
    match = re.search(r"(\d{4}-\d{2}-\d{2})", texto)
    if match:
        return match.group(1)
    return None


# ── Processador principal ─────────────────────────────────────────────────────

async def processar_mensagem(sessao: SessaoViagem, mensagem: str) -> RespostaChat:
    
    etapa = sessao.etapa
    msg = mensagem.strip()

    # ── ETAPA 1: Destino ──────────────────────────────────────────────────────
    if etapa == "destino":
        sessao.destino = msg
        sessao.etapa = "origem"
        return RespostaChat(
            sessao_id=sessao.sessao_id,
            etapa_atual="origem",
            mensagem_bot=f"Ótima escolha! *{sessao.destino}* vai ser incrível 🌍\n\nDe qual cidade você vai partir?",
        )

    # ── ETAPA 1.5: Origem ─────────────────────────────────────────────────────
    if etapa == "origem":
        sessao.origem = msg
        sessao.etapa = "pessoas"
        return RespostaChat(
            sessao_id=sessao.sessao_id,
            etapa_atual="pessoas",
            mensagem_bot="Anotado! ✈️\n\nQuantas pessoas vão viajar?",
            opcoes=["1", "2", "3", "4", "5+"],
        )

    # ── ETAPA 2: Número de pessoas ────────────────────────────────────────────
    if etapa == "pessoas":
        num = _extrair_numero(msg)
        sessao.num_pessoas = int(num) if num else 1
        sessao.etapa = "orcamento"
        return RespostaChat(
            sessao_id=sessao.sessao_id,
            etapa_atual="orcamento",
            mensagem_bot=f"Combinado, {sessao.num_pessoas} pessoa(s)! 👥\n\nQual é o orçamento total da viagem? (em R$)\nExemplo: R$ 5.000",
        )

    # ── ETAPA 3: Orçamento ────────────────────────────────────────────────────
    if etapa == "orcamento":
        valor = _extrair_numero(msg)
        sessao.orcamento = valor
        sessao.etapa = "datas"
        return RespostaChat(
            sessao_id=sessao.sessao_id,
            etapa_atual="datas",
            mensagem_bot="Perfeito! 💰\n\nAgora me diga as datas da viagem.\nQual é a data de ida? (formato DD/MM/AAAA)",
        )

    # ── ETAPA 4: Datas  ────────────────────────────────────────────────────────
    if etapa == "datas":
        if not sessao.data_ida:
            data = _extrair_data(msg)
            if not data:
                return RespostaChat(sessao_id=sessao.sessao_id, etapa_atual="datas", mensagem_bot="Pode repetir a data de ida? (Ex: 15/07/2025)")
            sessao.data_ida = data
            return RespostaChat(
                sessao_id=sessao.sessao_id,
                etapa_atual="datas",
                mensagem_bot=f"Ida: {msg} ✅\n\nE a data de volta? (DD/MM/AAAA ou escreva 'só ida')",
            )
        else:
            if "só ida" in msg.lower():
                sessao.data_volta = None
            else:
                sessao.data_volta = _extrair_data(msg)
                if not sessao.data_volta:
                    return RespostaChat(sessao_id=sessao.sessao_id, etapa_atual="datas", mensagem_bot="Pode repetir a data de volta? (DD/MM/AAAA ou escreva 'sÃ³ ida')")

            # Busca voos de IDA
            sessao.etapa = "voo_ida"
            voos = await buscar_voos(sessao.origem, sessao.destino, sessao.data_ida)
            sessao.voos_disponiveis = voos if isinstance(voos, list) else []

            if not sessao.voos_disponiveis:
                sessao.etapa = "hoteis"
                return await _etapa_hoteis(sessao)

            opcoes_voo = [_formatar_opcao_voo(v) for v in sessao.voos_disponiveis]
            return RespostaChat(
                sessao_id=sessao.sessao_id,
                etapa_atual="voo_ida",
                mensagem_bot="Encontrei estas opções de voo de IDA. Qual você prefere?",
                opcoes=opcoes_voo,
                dados_extra={"voos": sessao.voos_disponiveis}
            )

# ── ETAPA 5: Escolha de IDA ───────────────────────────────────────────
    if etapa == "voo_ida":
        # Em vez de salvar só o texto, vamos pegar o objeto do voo baseado na escolha
        try:
            # Tenta encontrar qual voo o usuário escolheu pelo texto ou índice
            # Aqui fazemos uma busca simples: se o texto da mensagem contém o nome da companhia e preço
            escolhido = next(
                (
                    v for v in sessao.voos_disponiveis
                    if _formatar_opcao_voo(v) == msg or v['companhia'] in msg
                ),
                sessao.voos_disponiveis[0],
            )
            sessao.voo_ida_escolhido = escolhido # Agora salva o DICIONÁRIO completo
        except:
            sessao.voo_ida_escolhido = sessao.voos_disponiveis[0] if sessao.voos_disponiveis else {}
        
        if not sessao.data_volta:
            sessao.etapa = "hoteis"
            return await _etapa_hoteis(sessao)
        
        voos_volta = await buscar_voos(sessao.destino, sessao.origem, sessao.data_volta)
        sessao.voos_disponiveis = voos_volta if isinstance(voos_volta, list) else []

        if not sessao.voos_disponiveis:
            sessao.etapa = "hoteis"
            return await _etapa_hoteis(sessao)

        opcoes_voo = [_formatar_opcao_voo(v) for v in sessao.voos_disponiveis]
        sessao.etapa = "voo_volta"
        return RespostaChat(
            sessao_id=sessao.sessao_id,
            etapa_atual="voo_volta",
            mensagem_bot="Ótimo! Agora escolha o voo de VOLTA:",
            opcoes=opcoes_voo, 
            dados_extra={"voos": sessao.voos_disponiveis} 
        )

    # ── ETAPA 5.5: Escolha de VOLTA ─────────────────────────────────────────
    if etapa == "voo_volta":
        try:
            escolhido = next(
                (
                    v for v in sessao.voos_disponiveis
                    if _formatar_opcao_voo(v) == msg or v['companhia'] in msg
                ),
                sessao.voos_disponiveis[0],
            )
            sessao.voo_volta_escolhido = escolhido
        except:
            sessao.voo_volta_escolhido = {}
            
        sessao.etapa = "hoteis"
        return await _etapa_hoteis(sessao)

    # ── ETAPA 6: Escolha de hotel ────────────────────────────────────────────
    if etapa == "hoteis":
        try:
            idx = int(msg) - 1
            if 0 <= idx < len(sessao.hoteis_disponiveis or []):
                sessao.hotel_escolhido = sessao.hoteis_disponiveis[idx]
            else:
                sessao.hotel_escolhido = (sessao.hoteis_disponiveis or [{}])[0]
        except ValueError:
            sessao.hotel_escolhido = (sessao.hoteis_disponiveis or [{}])[0]

        sessao.etapa = "estilo"
        return RespostaChat(
            sessao_id=sessao.sessao_id,
            etapa_atual="estilo",
            mensagem_bot="Ótima escolha! 🏨\n\nQual é o estilo da sua viagem?",
            opcoes=["🏛️ Cultural e histórico", "🏖️ Praia e relaxamento", "🧗 Aventura e natureza", "🍽️ Gastronomia", "🛍️ Compras e urbano", "👨‍👩‍👧 Família"],
        )

    # ── ETAPA 7: Estilo ──────────────────────────────────────────────────────
    if etapa == "estilo":
        sessao.estilo = msg.replace("🏛️ ", "").replace("🏖️ ", "").replace("🧗 ", "").replace("🍽️ ", "").replace("🛍️ ", "").replace("👨‍👩‍👧 ", "")
        sessao.etapa = "interesses"
        return RespostaChat(
            sessao_id=sessao.sessao_id,
            etapa_atual="interesses",
            mensagem_bot=f"Perfeito, viagem com estilo *{sessao.estilo}*! ✨\n\nPor último: tem algum interesse ou pedido especial para o roteiro?\nEx: quero visitar museus à tarde, prefiro restaurantes locais, viajo com criança pequena…",
        )

# ── ETAPA 8: Interesses → Gera roteiro ───────────────────────────────────
    if etapa == "interesses":
        sessao.interesses = msg
        sessao.etapa = "concluido"

        from datetime import date as _date
        import asyncio as _asyncio

        # Cálculo de dias 
        num_dias = 5
        if sessao.data_ida and sessao.data_volta:
            try:
                ida = _date.fromisoformat(sessao.data_ida)
                volta = _date.fromisoformat(sessao.data_volta)
                num_dias = max((volta - ida).days, 1)
            except ValueError:
                pass

        # Busca de atrações e clima
        atracoes, clima = await _asyncio.gather(
            buscar_atracoes(sessao.destino),
            buscar_clima(sessao.destino, sessao.data_ida, sessao.data_volta),
            return_exceptions=True,
        )
        if isinstance(atracoes, Exception): atracoes = []
        if isinstance(clima, Exception): clima = {}

        dados = {
            "destino": sessao.destino,
            "origem": sessao.origem,
            "data_ida": sessao.data_ida,
            "data_volta": sessao.data_volta,
            "num_dias": num_dias,
            "num_pessoas": sessao.num_pessoas,
            "orcamento": sessao.orcamento,
            "estilo": sessao.estilo,
            "interesses": sessao.interesses,
            "voo_ida": sessao.voo_ida_escolhido,    # Variável nova
            "voo_volta": sessao.voo_volta_escolhido, # Variável nova
            "hotel": sessao.hotel_escolhido,         # Ajustado
            "atracoes": atracoes,
            "clima": clima,
        }

        roteiro = await gerar_roteiro(dados)
        
        return RespostaChat(
            sessao_id=sessao.sessao_id,
            etapa_atual="concluido",
            mensagem_bot=f"Seu roteiro para *{sessao.destino}* está pronto! 🎉",
            roteiro=roteiro,
        )

    # ── ETAPA FINAL: Concluído ────────────────────────────────────────────────
    return RespostaChat(
        sessao_id=sessao.sessao_id,
        etapa_atual="concluido",
        mensagem_bot="Seu roteiro já foi gerado! Role a tela para cima para visualizá-lo. Quer planejar uma nova viagem?",
        opcoes=["Nova viagem"],
    )


# ── Helper interno: etapa de hotéis ──────────────────────────────────────────

async def _etapa_hoteis(sessao: SessaoViagem) -> RespostaChat:
    hoteis = await buscar_hoteis(
        sessao.destino,
        sessao.data_ida,
        sessao.data_volta or sessao.data_ida,
        sessao.num_pessoas or 1,
    )
    sessao.hoteis_disponiveis = hoteis if hoteis else []

    if not sessao.hoteis_disponiveis:
        sessao.hotel_escolhido = {}
        sessao.etapa = "estilo"
        return RespostaChat(
            sessao_id=sessao.sessao_id,
            etapa_atual="estilo",
            mensagem_bot="Não encontrei hotéis disponíveis, mas não tem problema! Vamos continuar.\n\nQual é o estilo da sua viagem?",
            opcoes=["🏛️ Cultural e histórico", "🏖️ Praia e relaxamento", "🧗 Aventura e natureza", "🍽️ Gastronomia", "🛍️ Compras e urbano", "👨‍👩‍👧 Família"],
        )

    opcoes_hotel = [
        f"{h['nome']} — {h['preco_noite']}/noite (⭐ {h['avaliacao']})"
        for h in sessao.hoteis_disponiveis
    ]
    return RespostaChat(
        sessao_id=sessao.sessao_id,
        etapa_atual="hoteis",
        mensagem_bot="Agora vamos escolher a hospedagem 🏨\n\nEncontrei estas opções:",
        opcoes=opcoes_hotel,
        dados_extra={"hoteis": sessao.hoteis_disponiveis},
    )


def _formatar_opcao_voo(voo: dict) -> str:
    return f"{voo['companhia']} — R$ {voo['preco']}"
