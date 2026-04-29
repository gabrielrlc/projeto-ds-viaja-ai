"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { RoteiroDinamico } from "@/components/c_roteiro/roteiro_dinamico";
import { Sparkles, Image as ImageIcon, MapPin, Send } from "lucide-react";
import { CardVoo } from "@/components/c_roteiro/card_voo";
import { CardHotel } from "@/components/c_roteiro/card_hotel";
import { formatarDataExtenso, formatarDuracao } from "@/lib/utils";

// ── Tipos ──────────────────────────────────────────────────────────────────

type Remetente = "bot" | "user";

interface Mensagem {
  remetente: Remetente;
  texto: string;
}

interface DadosColetados {
  destino: string;
  origem: string;
  pessoas: string;
  orcamento: string;
  datas: string;
  estilo: string;
  voo_ida_escolhido: Record<string, any> | null;
  voo_volta_escolhido: Record<string, any> | null;
  hotel_escolhido: Record<string, any> | null;
}

// ── Constante de URL da API ────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Componente principal ───────────────────────────────────────────────────

export default function ChatPage() {
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [opcoes, setOpcoes] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState<string>("destino");
  const [roteiroIa, setRoteiroIa] = useState<any>(null);
  const [opcoesObjetos, setOpcoesObjetos] = useState<Record<string, any>>({});
  const [dadosColetados, setDadosColetados] = useState<DadosColetados>({
    destino: "",
    origem: "",
    pessoas: "",
    orcamento: "",
    datas: "",
    estilo: "",
    voo_ida_escolhido: null,
    voo_volta_escolhido: null,
    hotel_escolhido: null,
  });

  // ref para auto-scroll
  const bottomRef = useRef<HTMLDivElement>(null);

  // scroll para o final sempre que mensagens ou loading mudam
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando, opcoes]);

  // inicializa o chat ao montar o componente
  useEffect(() => {
    async function iniciarChat() {
      setCarregando(true);
      try {
        const res = await fetch(`${API_URL}/api/chat/iniciar`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Falha ao iniciar chat");
        const data = await res.json();
        setSessaoId(data.sessao_id);
        setEtapaAtual(data.etapa_atual);
        setMensagens([{ remetente: "bot", texto: data.mensagem_bot }]);
        if (data.opcoes?.length) setOpcoes(data.opcoes);
      } catch (err) {
        console.error("Erro ao iniciar chat:", err);
        setMensagens([
          {
            remetente: "bot",
            texto:
              "Ops! Não consegui conectar ao servidor. Tente recarregar a página.",
          },
        ]);
      } finally {
        setCarregando(false);
      }
    }
    iniciarChat();
  }, []);

  // atualiza os dados coletados de acordo com a etapa atual
  const atualizarDadosColetados = useCallback(
    (
      texto: string,
      etapa: string,
      opcoesList: string[],
      objetosOpcoes: Record<string, any>,
    ) => {
      setDadosColetados((prev) => {
        const novo = { ...prev };
        if (etapa === "destino") novo.destino = texto;
        if (etapa === "origem") novo.origem = texto;
        if (etapa === "pessoas") novo.pessoas = texto;
        if (etapa === "orcamento") novo.orcamento = texto;
        if (etapa === "datas") {
          novo.datas = novo.datas ? `${novo.datas} até ${texto}` : texto;
        }
        if (etapa === "estilo") {
          novo.estilo = texto.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim();
        }
        if (etapa === "voo_ida") {
          const idx = opcoesList.indexOf(texto);
          if (idx >= 0 && objetosOpcoes.voos) {
            novo.voo_ida_escolhido = objetosOpcoes.voos[idx] ?? null;
          }
        }
        if (etapa === "voo_volta") {
          const idx = opcoesList.indexOf(texto);
          if (idx >= 0 && objetosOpcoes.voos) {
            novo.voo_volta_escolhido = objetosOpcoes.voos[idx] ?? null;
          }
        }
        if (etapa === "hoteis") {
          const idx = opcoesList.indexOf(texto);
          if (idx >= 0 && objetosOpcoes.hoteis) {
            novo.hotel_escolhido = objetosOpcoes.hoteis[idx] ?? null;
          }
        }
        return novo;
      });
    },
    [],
  );

  // envia mensagem para a API e processa a resposta
  const enviarMensagem = useCallback(
    async (texto: string) => {
      if (!texto.trim() || !sessaoId || carregando || roteiroIa) return;

      atualizarDadosColetados(texto, etapaAtual, opcoes, opcoesObjetos);

      setMensagens((prev) => [...prev, { remetente: "user", texto }]);
      setInput("");
      setOpcoes([]);
      setCarregando(true);

      try {
        const res = await fetch(`${API_URL}/api/chat/mensagem`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessao_id: sessaoId, mensagem: texto }),
        });

        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();

        setEtapaAtual(data.etapa_atual);
        setMensagens((prev) => [
          ...prev,
          { remetente: "bot", texto: data.mensagem_bot },
        ]);

        if (data.opcoes?.length) setOpcoes(data.opcoes);
        if (data.dados_extra) setOpcoesObjetos(data.dados_extra);
        if (data.roteiro) setRoteiroIa(data.roteiro);
      } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
        setMensagens((prev) => [
          ...prev,
          {
            remetente: "bot",
            texto:
              "Ocorreu um erro ao processar sua mensagem. Tente novamente.",
          },
        ]);
      } finally {
        setCarregando(false);
      }
    },
    [
      sessaoId,
      carregando,
      roteiroIa,
      etapaAtual,
      opcoes,
      opcoesObjetos,
      atualizarDadosColetados,
    ],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* coluna esquerda — chat */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-3xl shadow-sm border overflow-hidden">
        {/* cabeçalho */}
        <header className="p-6 border-b flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#0F2942]">
            <Sparkles size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-[#0F2942] text-xl">Novo Chat</h2>
            <p className="text-sm text-gray-400">
              {roteiroIa
                ? "Roteiro gerado com sucesso ✅"
                : "Itinerário em progresso"}
            </p>
          </div>
        </header>

        {/* área de mensagens */}
        <div className="flex-1 p-6 bg-white overflow-y-auto flex flex-col gap-4 custom-scrollbar">
          {mensagens.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] ${msg.remetente === "user" ? "self-end" : "self-start"}`}
            >
              <div
                className={`p-4 rounded-2xl border text-[15px] leading-relaxed shadow-sm ${
                  msg.remetente === "user"
                    ? "bg-[#0F2942] text-white border-[#0F2942] rounded-tr-sm"
                    : "bg-white border-[#EACFC4] text-[#0F2942] rounded-tl-sm"
                }`}
              >
                <span className="whitespace-pre-wrap">{msg.texto}</span>
              </div>
            </div>
          ))}

          {/* indicador de carregamento */}
          {carregando && (
            <div className="self-start max-w-[85%]">
              <div className="p-4 rounded-2xl border border-[#EACFC4] bg-white flex gap-2 items-center rounded-tl-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {/* opções de resposta */}
          {opcoes.length > 0 && !carregando && (
            <div
              className={`flex gap-4 mt-2 overflow-x-auto py-4 px-1 custom-scrollbar shrink-0 ${
                opcoesObjetos.voos || opcoesObjetos.hoteis
                  ? "flex-nowrap items-stretch"
                  : "flex-wrap items-center"
              }`}
            >
              {opcoes.map((opcao, idx) => {
                // card de voo
                if (
                  (etapaAtual === "voo_ida" || etapaAtual === "voo_volta") &&
                  opcoesObjetos.voos
                ) {
                  const v = opcoesObjetos.voos[idx];
                  if (!v) return null;
                  const isIda = etapaAtual === "voo_ida";
                  return (
                    <div
                      key={idx}
                      onClick={() => enviarMensagem(opcao)}
                      className="cursor-pointer min-w-[320px] transition-transform hover:-translate-y-1 active:scale-95 shrink-0"
                    >
                      <CardVoo
                        tipo={isIda ? "Ida" : "Volta"}
                        data={
                          isIda
                            ? formatarDataExtenso(
                                dadosColetados.datas?.split(" até ")[0] || "",
                              )
                            : formatarDataExtenso(
                                dadosColetados.datas?.split(" até ")[1] ||
                                  dadosColetados.datas?.split(" até ")[0] ||
                                  "",
                              )
                        }
                        preco={`R$ ${v.preco}`}
                        co2={
                          v.escalas === 0
                            ? "Voo Direto"
                            : `${v.escalas} escala(s)`
                        }
                        partida={{
                          hora:
                            v.partida?.split(" ")[1] || v.partida || "08:00",
                          aeroporto: v.aeroporto_partida || "Origem",
                          cidade: isIda
                            ? dadosColetados.origem
                            : dadosColetados.destino,
                        }}
                        chegada={{
                          hora:
                            v.chegada?.split(" ")[1] || v.chegada || "12:00",
                          aeroporto: v.aeroporto_chegada || "Destino",
                          cidade: isIda
                            ? dadosColetados.destino
                            : dadosColetados.origem,
                        }}
                        duracao={formatarDuracao(v.duracao_minutos)}
                        detalhes={v.companhia}
                      />
                    </div>
                  );
                }

                // card de hotel
                if (etapaAtual === "hoteis" && opcoesObjetos.hoteis) {
                  const h = opcoesObjetos.hoteis[idx];
                  if (!h) return null;
                  return (
                    <div
                      key={idx}
                      onClick={() => enviarMensagem(opcao)}
                      className="cursor-pointer min-w-[320px] transition-transform hover:-translate-y-1 active:scale-95 shrink-0"
                    >
                      <CardHotel
                        nome={h.nome}
                        estrelas={Math.floor(h.avaliacao || 4)}
                        categoria="Hospedagem"
                        noites={5}
                        precoTotal={`R$ ${parseInt(h.preco_noite?.replace(/\D/g, "") || "0") * 5}`}
                        localizacao={dadosColetados.destino}
                        precoNoite={h.preco_noite}
                        checkIn="14:00"
                        checkOut="12:00"
                        comodidades={["Wi-Fi", "Café"]}
                      />
                    </div>
                  );
                }

                // botão simples
                return (
                  <div
                    key={opcao}
                    onClick={() => enviarMensagem(opcao)}
                    className="cursor-pointer flex items-center justify-center px-5 py-2.5 rounded-full border border-[#F2D6D6] bg-[#FCF3F3] text-[#A63C3C] text-sm font-bold hover:bg-[#F8E8E8] shadow-sm transition-transform active:scale-95 shrink-0 whitespace-nowrap"
                  >
                    {opcao}
                  </div>
                );
              })}
            </div>
          )}

          {/* âncora de auto-scroll */}
          <div ref={bottomRef} />
        </div>

        {/* footer / input */}
        <footer className="p-6 pt-2 bg-white flex flex-col gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviarMensagem(input);
            }}
            className="flex items-center gap-3 p-2 rounded-2xl border bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#D68585]/30 transition-all"
          >
            {/* botões visuais — sem funcionalidade por enquanto */}
            <button
              type="button"
              disabled
              className="p-2 text-gray-300 cursor-not-allowed"
              aria-label="Anexar imagem (em breve)"
            >
              <ImageIcon size={22} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              disabled
              className="p-2 text-gray-300 cursor-not-allowed -ml-2"
              aria-label="Localização (em breve)"
            >
              <MapPin size={22} strokeWidth={1.5} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={carregando || !!roteiroIa}
              placeholder={
                roteiroIa
                  ? "Roteiro finalizado. Inicie um novo chat para planejar outra viagem."
                  : "Digite sua resposta..."
              }
              className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder:text-gray-400 disabled:opacity-50 text-sm"
            />

            <button
              type="submit"
              disabled={carregando || !!roteiroIa || !input.trim()}
              className="w-12 h-12 bg-[#D68585] rounded-xl flex items-center justify-center text-white hover:bg-[#C57474] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send size={20} strokeWidth={1.5} className="-ml-1" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 font-medium">
            O ViajaAI pode cometer erros. Considere verificar as informações.
          </p>
        </footer>
      </div>

      {/* coluna direita — roteiro */}
      <div className="flex-1">
        <RoteiroDinamico dados={dadosColetados} roteiroIa={roteiroIa} />
      </div>
    </div>
  );
}
