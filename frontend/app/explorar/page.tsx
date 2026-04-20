"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Clock, DollarSign, ArrowRight, Compass, Search, MessageSquare, Settings, Home, User, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Tipos de dados
type City = 'Rio de Janeiro' | 'Paris' | 'Tóquio' | 'Nova York';
type Category = 'Todas' | 'Cultura e História' | 'Natureza e Aventura' | 'Gastronomia' | 'Esportes';

interface Attraction {
    id: string;
    city: City;
    category: Category;
    name: string;
    description: string;
    imageUrl: string;
    location: string;
    hours: string;
    price: string;
}

// Alguns dados apenas para visualização inicial
const ATRACOES: Attraction[] = [
    // Rio de Janeiro
    {
        id: '1',
        city: 'Rio de Janeiro',
        category: 'Cultura e História',
        name: 'Cristo Redentor',
        description: 'Uma das Sete Maravilhas do Mundo Moderno, oferecendo vista panorâmica da cidade.',
        imageUrl: 'https://www.shutterstock.com/image-photo/rio-de-janeiro-brazil-may-600nw-1436257919.jpg',
        location: 'Parque Nacional da Tijuca',
        hours: '08:00 - 19:00',
        price: 'R$ 97,50'
    },
    {
        id: '2',
        city: 'Rio de Janeiro',
        category: 'Natureza e Aventura',
        name: 'Pão de Açúcar',
        description: 'Famoso teleférico com vistas incríveis do pôr do sol e da Baía de Guanabara.',
        imageUrl: 'https://www.ruhmturismo.com.br/wp-content/uploads/2019/12/pao_acucar_1.jpg',
        location: 'Urca, Rio de Janeiro',
        hours: '08:30 - 20:00',
        price: 'R$ 185,00'
    },
    {
        id: '3',
        city: 'Rio de Janeiro',
        category: 'Natureza e Aventura',
        name: 'Trilha da Pedra da Gávea',
        description: 'Trilha desafiadora que recompensa com uma das melhores vistas do litoral carioca.',
        imageUrl: 'https://trilhandomontanhas.com/arquivos/2016-12/ab-negreiros-na-pedra-da-gavea-parque-nacional-da-tijuca-rj-media.jpg',
        location: 'Floresta da Tijuca',
        hours: '08:00 - 17:00',
        price: 'Gratuito'
    },
    // Paris
    {
        id: '4',
        city: 'Paris',
        category: 'Cultura e História',
        name: 'Torre Eiffel',
        description: 'O ícone global da França, com vistas espetaculares do rio Sena.',
        imageUrl: 'https://mega.ibxk.com.br/2018/03/21/torre-eiffel-21131927290247.jpg?ims=fit-in/800x500',
        location: 'Champ de Mars, Paris',
        hours: '09:30 - 22:45',
        price: '€ 29,40'
    },
    {
        id: '5',
        city: 'Paris',
        category: 'Cultura e História',
        name: 'Museu do Louvre',
        description: 'O maior museu de arte do mundo, lar da Mona Lisa e da Vênus de Milo.',
        imageUrl: 'https://www.parigi.biz/imgproxy/0a9CCFXXQYJL-5AgXXAqrFhDikV0m9GrMawdHQFkhOM/g:ce/rs:fill:800:0:0/aHR0cHM6Ly9tZWRpYS1pbnQuem9uem9mb3guY29tL2NpdGllcy9wYXJpcy9zZW9fYW5zd2VyLzJfMS9kZWZhdWx0L3BhcmlzXzAwNy5qcGc.jpg',
        location: 'Rue de Rivoli, Paris',
        hours: '09:00 - 18:00 (Fim de semana)',
        price: '€ 22,00'
    },
    {
        id: '6',
        city: 'Paris',
        category: 'Gastronomia',
        name: 'Le Marais',
        description: 'Bairro histórico repleto de cafés charmosos, bistrôs tradicionais e patisseries.',
        imageUrl: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=800&auto=format&fit=crop',
        location: '3rd/4th Arrondissement',
        hours: 'Varia por local',
        price: '$$'
    },
    // Tóquio
    {
        id: '7',
        city: 'Tóquio',
        category: 'Cultura e História',
        name: 'Templo Senso-ji',
        description: 'O templo budista mais antigo e significativo de Tóquio, localizado em Asakusa.',
        imageUrl: 'https://letsflyaway.com.br/wp-content/uploads/2018/09/senso-ji-templo-640x400.jpg',
        location: 'Asakusa, Tóquio',
        hours: '24 horas (Salão: 06h-17h)',
        price: 'Gratuito'
    },
    {
        id: '8',
        city: 'Tóquio',
        category: 'Gastronomia',
        name: 'Mercado de Tsukiji',
        description: 'Famoso mercado de rua perfeito para provar sushi fresco e street food japonês.',
        imageUrl: 'https://media.istockphoto.com/id/458234059/pt/foto/mercado-de-tsukiji.jpg?s=612x612&w=0&k=20&c=WqLYwLEIUUTXh5aZ7SY39pVkG4zlKc2VOfBBTtKAfmw=',
        location: 'Chuo City, Tóquio',
        hours: '05:00 - 14:00',
        price: '$$'
    },
    // Nova York
    {
        id: '9',
        city: 'Nova York',
        category: 'Natureza e Aventura',
        name: 'Central Park',
        description: 'Um imenso oásis verde no meio da selva de pedra de Manhattan.',
        imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?q=80&w=800&auto=format&fit=crop',
        location: 'Manhattan, NY',
        hours: '06:00 - 01:00',
        price: 'Gratuito'
    },
    {
        id: '10',
        city: 'Nova York',
        category: 'Cultura e História',
        name: 'Broadway',
        description: 'O coração da indústria teatral americana com musicais inesquecíveis.',
        imageUrl: 'https://www.siegeljcc.org/clientuploads/events/Adult%20&%20Senior%20Alliance/Bway-May21-Marquees-Shows.jpg',
        location: 'Times Square Area',
        hours: 'Noturno',
        price: 'A partir de US$ 80'
    },
];

const CITIES: City[] = ['Rio de Janeiro', 'Paris', 'Tóquio', 'Nova York'];
const CATEGORIES: Category[] = ['Todas', 'Cultura e História', 'Natureza e Aventura', 'Gastronomia', 'Esportes'];

export default function ExplorarPage() {
    // Exibição inicial
    const [selectedCity, setSelectedCity] = useState<City>('Rio de Janeiro');
    const [selectedCategory, setSelectedCategory] = useState<Category>('Todas');

    // Filtra os dados com base na cidade e categoria selecionadas
    const filteredAttractions = ATRACOES.filter(attraction => {
        const matchCity = attraction.city === selectedCity;
        const matchCategory = selectedCategory === 'Todas' || attraction.category === selectedCategory;
        return matchCity && matchCategory;
    });

    return (
        <div className="relative flex h-screen w-full overflow-hidden">

            {/* Imagem de fundo */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/fundo-login.jpg"
                    alt="Fundo"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
            </div>

            {/* Sidebar */}
            <aside className="w-20 lg:w-64 flex-shrink-0 flex flex-col justify-between h-full py-8 border-r border-white/40 bg-white/40 backdrop-blur-md shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-all z-20">
                <div className="flex flex-col gap-10 px-4">

                    {/* Logo direcionando para Landing Page */}
                    <Link href="/" className="flex items-center justify-center lg:justify-start lg:px-4 hover:opacity-80 transition-opacity">
                        <div className="hidden lg:block">
                            <Image
                                src="/logo.png"
                                width={120}
                                height={50}
                                alt="Logo ViajaAí"
                                className="object-contain"
                            />
                        </div>
                        <div className="flex lg:hidden w-12 h-12 bg-[#0F2942] rounded-xl items-center justify-center shadow-lg transition-transform active:scale-95">
                            <Compass className="text-white" size={26} strokeWidth={2} />
                        </div>
                    </Link>

                    {/* Links de navegação */}
                    <nav className="flex flex-col gap-2">
                        <Link href="/" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors">
                            <Home size={22} strokeWidth={1.5} />
                            <span className="hidden lg:block font-medium">Início</span>
                        </Link>

                        <Link href="/explorar" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl bg-white/70 text-[#A63C3C] shadow-sm font-semibold transition-colors border border-white/50">
                            <Compass size={22} strokeWidth={2} />
                            <span className="hidden lg:block">Explorar</span>
                        </Link>

                        <Link href="/chat" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors">
                            <MessageSquare size={22} strokeWidth={1.5} />
                            <span className="hidden lg:block font-medium">Novo Roteiro</span>
                        </Link>

                        <Link href="/historico" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
                            <History size={22} strokeWidth={1.5} />
                            <span className="hidden lg:block font-medium">Histórico</span>
                        </Link>
                    </nav>
                </div>

                {/* Rodapé da Sidebar */}
                <div className="flex flex-col gap-2 px-4">
                    <Link href="/configuracoes" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors opacity-70 hover:opacity-100">
                        <Settings size={22} strokeWidth={1.5} />
                        <span className="hidden lg:block font-medium">Configurações</span>
                    </Link>

                    <Link href="/login" className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-2xl text-[#0F2942] hover:bg-white/60 transition-colors">
                        <User size={22} strokeWidth={1.5} />
                        <span className="hidden lg:block font-medium">Meu Perfil</span>
                    </Link>
                </div>
            </aside>

            {/* Área principal de conteúdo */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto z-10">

                {/* Cabeçalho */}
                <header className="w-full bg-white/50 backdrop-blur-md border-b border-white/40 px-8 py-6 sticky top-0 z-20">
                    <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="font-bold text-[#0F2942] text-2xl">Descobrir Destinos</h1>
                                <p className="text-sm text-gray-700 font-medium">Inspirações para a sua próxima viagem</p>
                            </div>
                        </div>

                        {/* Barra de busca */}
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Procurar destinos, pontos turísticos..."
                                className="w-full md:w-80 pl-11 pr-4 py-3 rounded-full bg-white/80 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#D68585]/50 text-sm shadow-sm placeholder:text-gray-500 text-[#0F2942]"
                            />
                        </div>
                    </div>
                </header>

                {/* Filtros dos interesses */}
                <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-8 pb-20">
                    <section className="flex flex-col gap-6">

                        {/* Cidades */}
                        <div>
                            <h3 className="text-xs font-bold text-[#0F2942] mb-3 uppercase tracking-wider bg-white/50 inline-block px-3 py-1 rounded-md">Destinos mais procurados</h3>
                            <div className="flex flex-wrap gap-3">
                                {CITIES.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => setSelectedCity(city)}
                                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm ${selectedCity === city
                                            ? 'bg-[#0F2942] text-white'
                                            : 'bg-white/70 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white'
                                            }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Categorias */}
                        <div>
                            <h3 className="text-xs font-bold text-[#0F2942] mb-3 uppercase tracking-wider bg-white/50 inline-block px-3 py-1 rounded-md">Quais são seus interesses?</h3>
                            <div className="flex flex-wrap gap-3">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${selectedCategory === cat
                                            ? 'bg-[#FCF3F3] text-[#A63C3C] border-2 border-[#F2D6D6]'
                                            : 'bg-white/70 backdrop-blur-sm border border-white/40 text-gray-600 hover:bg-white/90'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Resultados dos interesses */}
                    <section>
                        {filteredAttractions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/90 backdrop-blur-sm rounded-3xl border border-white/40">
                                <Compass className="text-gray-400 mb-4" size={48} strokeWidth={1} />
                                <h3 className="text-xl font-semibold text-[#0F2942]">Nenhum local encontrado</h3>
                                <p className="text-gray-600 mt-2">Ainda estamos mapeando locais nesta categoria para {selectedCity}.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAttractions.map((attraction) => (
                                    <div key={attraction.id} className="group bg-white/90 backdrop-blur-md rounded-3xl border border-white/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                        <div className="relative h-56 w-full overflow-hidden">
                                            <img
                                                src={attraction.imageUrl}
                                                alt={attraction.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-[#A63C3C] shadow-sm">
                                                {attraction.category}
                                            </div>
                                            <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl leading-tight">
                                                {attraction.name}
                                            </h3>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1 gap-4">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {attraction.description}
                                            </p>
                                            <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin size={16} className="text-[#D68585]" />
                                                    <span className="truncate">{attraction.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock size={16} className="text-[#D68585]" />
                                                    <span>{attraction.hours}</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2942] bg-green-50 px-2 py-1 rounded-md">
                                                        <DollarSign size={16} className="text-green-600" />
                                                        <span className="text-green-700">{attraction.price}</span>
                                                    </div>

                                                    {/* Botão para adicionar o interesse ao roteiro caso seja pertinente futuramente */}
                                                    <Button variant="ghost" size="sm" className="text-[#A63C3C] hover:text-[#A63C3C] hover:bg-[#FCF3F3] rounded-full group/btn">
                                                        Adicionar <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}