import Image from "next/image";
import { Button } from "@/components/ui/button";
import {ArrowRight} from "lucide-react"
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      
      {/* vídeo do fundo */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/santorini.mp4" type="video/mp4" />
      </video>

    <main className="flex-1">{/*Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 gap-12 items-start min-h-[70vh]">
          <div className="relative bg-secondary h-150 w-100 ml-50 px-8 pt-0 pb-8 rounded-2xl shadow-2xl flex flex-col gap-6">
            <Image className="mb-6" src="/logo.png" width={150} height={50} alt="Logo da página do Viaja Aí, um avião deixando um jato de fumaça para trás nas cores vermelho e azul, ambas em tons escuros."/>
            <div className="absolute left-45 top-9 flex flex-col items-center gap-0">
            <Image src="/bubble-relogios.png" width={150} height={50} alt="Colagem de torres de relógio de Zurique, Londres (Big Ben) e Kiev, com um relógio de rua no centro."/>
            <p className="font-bold text-center text-primary -mt-2.5">Economize <br/> o seu tempo</p>
            <p className="text-xs text-muted-foreground text-center">Nós cuidamos da pesquisa, <br/> você curte o destino.</p>
            </div>
            <div className="absolute left-6 top-48 flex flex-col items-center gap-0">
            <Image src="/bubble-roteiro.png" width={150} height={50} alt="Imagem circular com fundo azul escuro destacando diversos elementos que representam viagens. Da esquerda para a direita: um pinheiro verde com uma bicicleta azul estacionada na frente, a Torre Eiffel ao fundo, um clássico ônibus vermelho de dois andares no centro, e a estátua colorida do Galo da Madrugada usando uma câmera fotográfica pendurada no pescoço."/>
            <p className="font-bold text-center text-primary -mt-2.5">Roteiros <br/> personalizados</p>
            <p className="text-xs text-muted-foreground text-center">Para todos os gostos e <br/> para todos os lugares.</p>
            </div>
            <div className="absolute left-55 top-65 flex flex-col items-center gap-0">
            <Image src="/bubble-facilidade.png" width={150} height={50} alt="Imagem circular com fundo azul escuro destacando diversos elementos que representam viagens. Da esquerda para a direita: um pinheiro verde com uma bicicleta azul estacionada na frente, a Torre Eiffel ao fundo, um clássico ônibus vermelho de dois andares no centro, e a estátua colorida do Galo da Madrugada usando uma câmera fotográfica pendurada no pescoço."/>
            <p className="font-bold text-center text-primary -mt-2.5">Facilidade</p>
            <p className="text-xs text-muted-foreground text-center">Esqueça as abas abertas. <br/> Tudo em um só lugar.</p>
            </div>
            <div className="mt-auto flex flex-col items-center gap-2">
              <Button size="lg" className="h-12 px-4 font-medium">Cadastre-se e planeje <ArrowRight className=""></ArrowRight></Button>
              <p className="text-sm text-muted-foreground">Já tem um cadastro? <Link href="/login" className="underline hover:text-primary">Faça login</Link></p>
            </div>
          </div>
          <div className="max-w-4xl text-right ml-auto">
            <h1 className="font-bold text-secondary mb-6 text-6xl">Planeje sua próxima viagem de forma inteligente.</h1>
            <p className="text-secondary mb-10 size-xl text-right">Defina seu destino, ajuste seu orçamento e planeje <br/> seu roteiro de viagem em um só lugar.</p>
          </div>
        </div>
      </section>
    </main>
    </div>
  );
}


