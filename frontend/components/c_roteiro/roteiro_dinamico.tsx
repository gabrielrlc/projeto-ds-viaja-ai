import React from "react";
import { 
  MapPin, Users, Plane, Hotel, Sparkles, CheckCircle2, ChevronDown, Compass, Clock, CreditCard
} from "lucide-react";
import { CardVoo } from "./card_voo";
import { CardHotel } from "./card_hotel";
import { formatarDataExtenso, formatarDuracao } from "@/lib/utils";

export function RoteiroDinamico({ dados, roteiroIa }: { dados: any, roteiroIa: any }) {
  
  const comecou = dados.destino !== "";

  // TELA INICIAL
  if (!comecou) {
    return (
      <div className="flex flex-col h-full bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-inner">
          <Compass size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-[#0F2942] mb-2">Seu roteiro ganha vida aqui</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Comece a interagir com o ViajaAI. Conforme conversamos, esta página será desenhada sob medida para você.
        </p>
      </div>
    );
  }

  const tituloDinamico = dados.destino;

  const itensCabecalho = [
    dados.datas ? { icone: <Clock size={16} />, texto: dados.datas } : null,
    dados.orcamento ? { icone: <CreditCard size={16} />, texto: `R$ ${dados.orcamento}` } : null,
    dados.pessoas ? { icone: <Users size={16} />, texto: `${dados.pessoas} pessoa(s)` } : null,
    dados.origem ? { icone: <MapPin size={16} />, texto: `${dados.origem} - ${dados.destino}` } : null,
  ].filter(Boolean);

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 overflow-hidden">
      
      {/* Cabeçalho */}
      <header className="p-6 border-b border-white/40 bg-white/40 flex flex-col gap-4">
        <h2 className="font-bold text-[#0F2942] text-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          {tituloDinamico}
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#5B738B] font-medium">
          {itensCabecalho.map((item: any, index: number) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
                {item.icone} {item.texto}
              </div>
              {index < itensCabecalho.length - 1 && (
                <span className="text-gray-300 animate-in fade-in duration-500">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        
        {/* Card de Voo */}
        {dados.voo_ida_escolhido && typeof dados.voo_ida_escolhido === 'object' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardVoo 
              tipo="Ida"
              data={formatarDataExtenso(dados.datas?.split(" até ")[0] || "")}
              preco={`R$ ${dados.voo_ida_escolhido.preco}`}
              co2={dados.voo_ida_escolhido.escalas === 0 ? "Voo Direto" : `${dados.voo_ida_escolhido.escalas} escala(s)`}
              partida={{ 
                hora: dados.voo_ida_escolhido.partida?.split(" ")[1] || "08:00", 
                aeroporto: dados.voo_ida_escolhido.aeroporto_partida || "Origem", 
                cidade: dados.origem 
              }}
              chegada={{ 
                hora: dados.voo_ida_escolhido.chegada?.split(" ")[1] || "12:00", 
                aeroporto: dados.voo_ida_escolhido.aeroporto_chegada || "Destino", 
                cidade: dados.destino 
              }}
              duracao={formatarDuracao(dados.voo_ida_escolhido.duracao_minutos)}
              detalhes={dados.voo_ida_escolhido.companhia}
            />
          </div>
        )}

        {dados.voo_volta_escolhido && typeof dados.voo_volta_escolhido === 'object' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-4">
            <CardVoo 
              tipo="Volta"
              data={formatarDataExtenso(dados.datas?.split(" até ")[1] || "")}
              preco={`R$ ${dados.voo_volta_escolhido.preco}`}
              co2={dados.voo_volta_escolhido.escalas === 0 ? "Voo Direto" : `${dados.voo_volta_escolhido.escalas} escala(s)`}
              partida={{ 
                hora: dados.voo_volta_escolhido.partida?.split(" ")[1] || "14:00", 
                aeroporto: dados.voo_volta_escolhido.aeroporto_partida || "Origem", 
                cidade: dados.destino 
              }}
              chegada={{ 
                hora: dados.voo_volta_escolhido.chegada?.split(" ")[1] || "18:00", 
                aeroporto: dados.voo_volta_escolhido.aeroporto_chegada || "Destino", 
                cidade: dados.origem 
              }}
              duracao={formatarDuracao(dados.voo_volta_escolhido.duracao_minutos)}
              detalhes={dados.voo_volta_escolhido.companhia}
            />
          </div>
        )}

        {/* Card de Hotel */}
        {dados.hotel_escolhido && typeof dados.hotel_escolhido === 'object' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <CardHotel 
              nome={dados.hotel_escolhido.nome}
              estrelas={Math.floor(dados.hotel_escolhido.avaliacao || 4)}
              categoria="Hospedagem Selecionada"
              noites={5}
              precoTotal={`R$ ${parseInt(dados.hotel_escolhido.preco_noite?.replace(/\D/g, '') || '0') * 5}`}
              localizacao={dados.destino}
              precoNoite={dados.hotel_escolhido.preco_noite}
              checkIn="14:00"
              checkOut="12:00"
              comodidades={["Wi-Fi Grátis", "Café da Manhã"]}
            />
          </div>
        )}

        {dados.estilo && (
           <div className="bg-[#FCF3F3] text-[#A63C3C] p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Sparkles size={20} />
             <span className="font-semibold text-sm">Estilo da viagem: {dados.estilo}</span>
           </div>
        )}

        {/* Atividades Geradas pela IA */}
        {roteiroIa && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-2">
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-3">
              <Sparkles size={20} />
              {roteiroIa.resumo}
            </div>

            {roteiroIa.dias?.map((dia: any, index: number) => (
              <div key={index} className="bg-white/80 p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start cursor-pointer group">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-[#A63C3C]" size={28} strokeWidth={2} />
                      <h3 className="text-[#A63C3C] text-xl font-bold group-hover:underline">
                        Dia {dia.dia} — {dia.titulo}
                      </h3>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-10">
                      {formatarDataExtenso(dia.data)} • {dia.clima_dia}
                    </p>
                  </div>
                  <ChevronDown className="text-gray-400 mt-2" />
                </div>
                
                <div className="relative ml-3.5 border-l-2 border-[#FCF3F3] mt-4 pl-6 py-2 flex flex-col gap-6">
                  {dia.atividades?.map((ativ: any, i: number) => (
                    <div key={i} className="relative flex gap-4 group">
                      <div className="absolute -left-[31px] top-[6px] w-2 h-2 rounded-full bg-[#EACFC4] group-hover:bg-[#A63C3C] transition-colors"></div>
                      
                      <span className="text-sm font-bold text-gray-400 shrink-0 w-12 pt-0.5">{ativ.horario}</span>
                      <div>
                        <p className="font-bold text-[#0F2942] text-[15px] leading-tight">{ativ.nome}</p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{ativ.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}