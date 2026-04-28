"use client";
import { useState, useEffect } from "react";
import { RoteiroDinamico } from "@/components/c_roteiro/roteiro_dinamico";
import { 
  Sparkles, Image as ImageIcon, MapPin, Send, Calendar, DollarSign, Users,
  Share2, Download, Link as LinkIcon, Plane, Hotel, Star, Waves, Coffee,
  Dumbbell, Utensils, CheckCircle2, ChevronDown,
  Wifi} from "lucide-react";
import { CardVoo } from "@/components/c_roteiro/card_voo";
import { CardHotel } from "@/components/c_roteiro/card_hotel";
import { formatarDataExtenso, formatarDuracao } from "@/lib/utils";

export default function ChatPage() {
  // estados do chat
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<{remetente: "bot" | "user", texto: string}[]>([]);
  const [opcoes, setOpcoes] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);

  // controle da tela
  const [etapaAtual, setEtapaAtual] = useState<string>("destino");
  const [roteiroIa, setRoteiroIa] = useState<any>(null);

  // rascunho dos dados 
  const [dadosColetados, setDadosColetados] = useState<any>({
    destino: "", origem: "", pessoas: "", orcamento: "", datas: "", voo: "", hotel: "", estilo: "", vooObj: null, hotelObj: null
  });
  const [opcoesObjetos, setOpcoesObjetos] = useState<any>({});

  // função de inicialização do chat
  useEffect(() => {
    async function iniciarChat() {
      setCarregando(true);
      try {
        const res = await fetch("http://localhost:8000/api/chat/iniciar", { method: "POST" });
        const data = await res.json();
        setSessaoId(data.sessao_id);
        setEtapaAtual(data.etapa_atual);
        setMensagens([{ remetente: "bot", texto: data.mensagem_bot }]);
        if (data.opcoes) setOpcoes(data.opcoes);
      } catch (err) {
        console.error("Erro ao iniciar chat:", err);
      } finally {
        setCarregando(false);
      }
    }
    iniciarChat();
  }, []);

  // função de enviar mensagem
  const enviarMensagem = async (texto: string) => {
    if (!texto.trim() || !sessaoId || carregando) return;

    setDadosColetados((prev: any) => {
      const novo = { ...prev };
      if (etapaAtual === "destino") novo.destino = texto;
      if (etapaAtual === "origem") novo.origem = texto;
      if (etapaAtual === "pessoas") novo.pessoas = texto;
      if (etapaAtual === "orcamento") novo.orcamento = texto;
      if (etapaAtual === "datas") novo.datas = novo.datas ? `${novo.datas} até ${texto}` : texto;

      if (etapaAtual === "voo_ida") {
        const idx = opcoes.indexOf(texto);
        if (idx >= 0 && opcoesObjetos.voos) novo.voo_ida_escolhido = opcoesObjetos.voos[idx];
      }
      if (etapaAtual === "voo_volta") {
        const idx = opcoes.indexOf(texto);
        if (idx >= 0 && opcoesObjetos.voos) novo.voo_volta_escolhido = opcoesObjetos.voos[idx];
      }
      if (etapaAtual === "hoteis") {
        const idx = opcoes.indexOf(texto);
        if (idx >= 0 && opcoesObjetos.hoteis) novo.hotel_escolhido = opcoesObjetos.hoteis[idx];
      }
      if (etapaAtual === "estilo") novo.estilo = texto.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim();
      return novo;
    });

    setMensagens(prev => [...prev, { remetente: "user", texto }]);
    setInput("");
    setOpcoes([]);
    setCarregando(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat/mensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessao_id: sessaoId, mensagem: texto })
      });
      const data = await res.json();
      
      setEtapaAtual(data.etapa_atual);
      setMensagens(prev => [...prev, { remetente: "bot", texto: data.mensagem_bot }]);
      if (data.opcoes) setOpcoes(data.opcoes);
      
      if (data.dados_extra) setOpcoesObjetos(data.dados_extra);

      if (data.roteiro) setRoteiroIa(data.roteiro);

    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      
      {/* coluna esquerda - chat */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-3xl shadow-sm border overflow-hidden">
      
      {/* cabeçalho do chat */}
      <header className="p-6 border-b flex items-center gap-4">
         <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#0F2942]">
            <Sparkles size={24} strokeWidth={1.5} />
         </div>
         <div className="flex flex-col">
            <h2 className="font-bold text-[#0F2942] text-xl">Novo Chat</h2>
            <p className="text-sm text-gray-400">Itinerário em progresso</p>
         </div>
      </header>

      {/* espaço de mensagens */}
      <div className="flex-1 p-6 bg-white overflow-y-auto flex flex-col gap-4">
        
        {/* renderização das mensagens */}
        {mensagens.map((msg, idx) => (
          <div key={idx} className={`max-w-[85%] ${msg.remetente === "user" ? "self-end" : "self-start"}`}>
            <div className={`p-4 rounded-2xl border text-[15px] leading-relaxed shadow-sm ${
              msg.remetente === "user" 
                ? "bg-[#0F2942] text-white border-[#0F2942] rounded-tr-sm" 
                : "bg-white border-[#EACFC4] text-[#0F2942] rounded-tl-sm"
            }`}>
              <span className="whitespace-pre-wrap">{msg.texto}</span>
            </div>
          </div>
        ))}

        {/* loading */}
        {carregando && (
            <div className="self-start max-w-[85%]">
              <div className="p-4 rounded-2xl border border-[#EACFC4] bg-white text-[#0F2942] flex gap-2 items-center rounded-tl-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
        )}

        {/* renderização dos botões da API */}
        {opcoes.length > 0 && !carregando && (
          <div className={`flex gap-4 mt-2 overflow-x-auto pt-2 px-2 no-scrollbar ${
            (opcoesObjetos.voos || opcoesObjetos.hoteis) 
              ? "flex-nowrap items-start pb-12" // pb-12 dá espaço para a sombra e altura dos cards
              : "flex-wrap items-center pb-6"
          }`}>
            {opcoes.map((opcao, idx) => {
              
              // Se for voo
              if ((etapaAtual === "voo_ida" || etapaAtual === "voo_volta") && opcoesObjetos.voos) {
                const v = opcoesObjetos.voos[idx];
                if (!v) return null;
                return (
                  <div 
                    key={idx} 
                    onClick={() => enviarMensagem(opcao)} 
                    className="cursor-pointer min-w-[340px] max-w-[340px] transition-all hover:translate-y-[-4px] active:scale-95 shrink-0"
                  >
                    <div className="pointer-events-none rounded-3xl shadow-lg border border-black/5 overflow-hidden bg-white">
                      <CardVoo 
                        tipo={etapaAtual === "voo_ida" ? "Ida" : "Volta"}
                        data={etapaAtual === "voo_ida" ? formatarDataExtenso(dadosColetados.datas?.split(" até ")[0] || "") : formatarDataExtenso(dadosColetados.datas?.split(" até ")[1] || dadosColetados.datas?.split(" até ")[0] || "")}
                        preco={`R$ ${v.preco}`}
                        co2={v.escalas === 0 ? "Voo Direto" : `${v.escalas} escala(s)`}
                        partida={{ 
                          hora: v.partida?.split(" ")[1] || v.partida || "08:00", 
                          aeroporto: v.aeroporto_partida || "Origem", 
                          cidade: etapaAtual === "voo_ida" ? dadosColetados.origem : dadosColetados.destino 
                        }}
                        chegada={{ 
                          hora: v.chegada?.split(" ")[1] || v.chegada || "12:00", 
                          aeroporto: v.aeroporto_chegada || "Destino", 
                          cidade: etapaAtual === "voo_ida" ? dadosColetados.destino : dadosColetados.origem 
                        }}
                        duracao={formatarDuracao(v.duracao_minutos)}
                        detalhes={v.companhia}
                      />
                    </div>
                  </div>
                );
              }

              // Se for hotel
              if (etapaAtual === "hoteis" && opcoesObjetos.hoteis) {
                const h = opcoesObjetos.hoteis[idx];
                if (!h) return null;
                return (
                  <div 
                    key={idx} 
                    onClick={() => enviarMensagem(opcao)} 
                    className="cursor-pointer min-w-[320px] max-w-[320px] transition-all hover:translate-y-[-4px] active:scale-95 shrink-0"
                  >
                    <div className="pointer-events-none rounded-3xl shadow-lg border border-black/5 overflow-hidden bg-white">
                      <CardHotel 
                        nome={h.nome}
                        estrelas={Math.floor(h.avaliacao || 4)}
                        categoria="Hospedagem"
                        noites={5}
                        precoTotal={`R$ ${parseInt(h.preco_noite?.replace(/\D/g, '') || '0') * 5}`}
                        localizacao={dadosColetados.destino}
                        precoNoite={h.preco_noite}
                        checkIn="14:00" checkOut="12:00"
                        comodidades={["Wi-Fi", "Café"]}
                      />
                    </div>
                  </div>
                );
              }

              // Botões de sugestão (Texto)
              return (
                <div 
                  key={opcao}
                  onClick={() => enviarMensagem(opcao)}
                  className="cursor-pointer flex items-center justify-center min-h-[44px] px-6 rounded-full border-2 border-[#F2D6D6] bg-[#FCF3F3] text-[#A63C3C] text-sm font-bold hover:bg-[#F8E8E8] shadow-sm transition-all active:scale-90 shrink-0 whitespace-nowrap"
                >
                  {opcao}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Footer / Input */}
      <footer className="p-6 pt-2 bg-white flex flex-col gap-3">
         
         <form onSubmit={(e) => { e.preventDefault(); enviarMensagem(input); }} className="flex items-center gap-3 p-2 rounded-2xl border bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#D68585]/30 transition-all">
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <ImageIcon size={22} strokeWidth={1.5} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors -ml-2">
              <MapPin size={22} strokeWidth={1.5} />
            </button>

            {/* campo de texto */}
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={carregando || roteiroIa !== null}
              placeholder={roteiroIa ? "Chat encerrado." : "Digite sua resposta..."} 
              className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder:text-gray-400 disabled:opacity-50"
            />

            <button type='submit' className="w-12 h-12 bg-[#D68585] rounded-xl flex items-center justify-center text-white hover:bg-[#C57474] transition-colors">
              <Send size={20} strokeWidth={1.5} className="-ml-1" />
            </button>
         </form>

         <p className="text-center text-xs text-gray-400 mt-2 font-medium">
            O ViajaAI pode cometer erros. Considere verificar as informações.
         </p>
      </footer>
      </div>

      {/* coluna direita */}
      <div className="flex-1">
        <RoteiroDinamico dados={dadosColetados} roteiroIa={roteiroIa} />
      </div>
      
    </div>
  );
}