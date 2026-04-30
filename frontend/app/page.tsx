import Image from "next/image";
import { Button } from "@/components/ui/button";
import {ArrowRight} from "lucide-react"
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">

      <header className="w-full h-20 px-8 flex items-center justify-between z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shrink-0">
      
        <div className="flex items-center gap-2">
          <Image src="/logo.png" width={120} height={70} alt="Logo da página do Viaja Aí, um avião deixando um jato de fumaça para trás nas cores vermelho e azul, ambas em tons escuros."/>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="font-medium text-secondary hover:text-white transition-colors">
            Entrar
          </Link>
          
          <Link href="/login?aba=registro">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-6">
              Criar conta
            </Button>
          </Link>
        </div>

      </header>
      
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

    <main className="flex-1 min-h-0">{/*Hero Section */}
      <section className="mx-auto h-full px-4 py-8">
        <div className="grid grid-cols-2 gap-12 items-start h-full">
          <div className="relative bg-secondary h-150 w-99 ml-45 px-7 pt-0 pb-7 rounded-2xl shadow-2xl flex flex-col gap-5">
            <Image className="mb-5" src="/logo.png" width={145} height={41} alt="Logo da página do Viaja Aí, um avião deixando um jato de fumaça para trás nas cores vermelho e azul, ambas em tons escuros."/>
            <div className="absolute left-42 top-8 flex flex-col items-center gap-0">
            <Image src="/bubble-relogios.png" width={145} height={49} alt="Colagem de torres de relógio de Zurique, Londres (Big Ben) e Kiev, com um relógio de rua no centro."/>
            <p className="font-bold text-base text-center text-primary -mt-2">Economize <br/> o seu tempo</p>
            <p className="font-medium text-xs text-muted-foreground text-center">Nós cuidamos da pesquisa, <br/> você curte o destino.</p>
            </div>
            <div className="absolute left-5 top-45 flex flex-col items-center gap-0">
            <Image src="/bubble-roteiro.png" width={145} height={49} alt="Imagem circular com fundo azul escuro destacando diversos elementos que representam viagens. Da esquerda para a direita: um pinheiro verde com uma bicicleta azul estacionada na frente, a Torre Eiffel ao fundo, um clássico ônibus vermelho de dois andares no centro, e a estátua colorida do Galo da Madrugada usando uma câmera fotográfica pendurada no pescoço."/>
            <p className="font-bold text-base text-center text-primary -mt-2">Roteiros <br/> personalizados</p>
            <p className="font-medium text-xs text-muted-foreground text-center">Para todos os gostos e <br/> para todos os lugares.</p>
            </div>
            <div className="absolute left-52 top-61 flex flex-col items-center gap-0">
            <Image src="/bubble-facilidade.png" width={145} height={49} alt="Imagem circular com fundo azul escuro destacando diversos elementos que representam viagens. Da esquerda para a direita: um pinheiro verde com uma bicicleta azul estacionada na frente, a Torre Eiffel ao fundo, um clássico ônibus vermelho de dois andares no centro, e a estátua colorida do Galo da Madrugada usando uma câmera fotográfica pendurada no pescoço."/>
            <p className="font-bold text-base text-center text-primary -mt-2">Facilidade</p>
            <p className="font-medium text-xs text-muted-foreground text-center">Esqueça as abas abertas. <br/> Tudo em um só lugar.</p>
            </div>
            <div className="mt-auto flex flex-col items-center gap-2">
              <Link href="/login?aba=registro"><Button size="lg" className="h-11 px-4 text-sm font-medium">Cadastre-se e planeje <ArrowRight /></Button></Link>
              <p className="text-[13px] text-muted-foreground">Já tem um cadastro? <Link href="/login" className="underline hover:text-primary">Faça login</Link></p>
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


