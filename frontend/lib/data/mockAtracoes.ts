export type City = 'Rio de Janeiro' | 'Paris' | 'Tóquio' | 'Nova York';
export type Category = 'Todas' | 'Cultura e História' | 'Natureza e Aventura' | 'Gastronomia' | 'Esportes';

export interface Attraction {
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

export const CITIES: City[] = ['Rio de Janeiro', 'Paris', 'Tóquio', 'Nova York'];
export const CATEGORIES: Category[] = ['Todas', 'Cultura e História', 'Natureza e Aventura', 'Gastronomia', 'Esportes'];

export const ATRACOES: Attraction[] = [
    { id: '1', city: 'Rio de Janeiro', category: 'Cultura e História', name: 'Cristo Redentor', description: 'Uma das Sete Maravilhas do Mundo Moderno, oferecendo vista panorâmica da cidade.', imageUrl: 'https://www.shutterstock.com/image-photo/rio-de-janeiro-brazil-may-600nw-1436257919.jpg', location: 'Parque Nacional da Tijuca', hours: '08:00 - 19:00', price: 'R$ 97,50' },
    { id: '2', city: 'Rio de Janeiro', category: 'Natureza e Aventura', name: 'Pão de Açúcar', description: 'Famoso teleférico com vistas incríveis do pôr do sol e da Baía de Guanabara.', imageUrl: 'https://www.ruhmturismo.com.br/wp-content/uploads/2019/12/pao_acucar_1.jpg', location: 'Urca, Rio de Janeiro', hours: '08:30 - 20:00', price: 'R$ 185,00' },
    { id: '3', city: 'Rio de Janeiro', category: 'Natureza e Aventura', name: 'Trilha da Pedra da Gávea', description: 'Trilha desafiadora que recompensa com uma das melhores vistas do litoral carioca.', imageUrl: 'https://trilhandomontanhas.com/arquivos/2016-12/ab-negreiros-na-pedra-da-gavea-parque-nacional-da-tijuca-rj-media.jpg', location: 'Floresta da Tijuca', hours: '08:00 - 17:00', price: 'Gratuito' },
    { id: '4', city: 'Paris', category: 'Cultura e História', name: 'Torre Eiffel', description: 'O ícone global da França, com vistas espetaculares do rio Sena.', imageUrl: 'https://mega.ibxk.com.br/2018/03/21/torre-eiffel-21131927290247.jpg?ims=fit-in/800x500', location: 'Champ de Mars, Paris', hours: '09:30 - 22:45', price: '€ 29,40' },
    { id: '5', city: 'Paris', category: 'Cultura e História', name: 'Museu do Louvre', description: 'O maior museu de arte do mundo, lar da Mona Lisa e da Vênus de Milo.', imageUrl: 'https://www.parigi.biz/imgproxy/0a9CCFXXQYJL-5AgXXAqrFhDikV0m9GrMawdHQFkhOM/g:ce/rs:fill:800:0:0/aHR0cHM6Ly9tZWRpYS1pbnQuem9uem9mb3guY29tL2NpdGllcy9wYXJpcy9zZW9fYW5zd2VyLzJfMS9kZWZhdWx0L3BhcmlzXzAwNy5qcGc.jpg', location: 'Rue de Rivoli, Paris', hours: '09:00 - 18:00 (Fim de semana)', price: '€ 22,00' },
    { id: '6', city: 'Paris', category: 'Gastronomia', name: 'Le Marais', description: 'Bairro histórico repleto de cafés charmosos, bistrôs tradicionais e patisseries.', imageUrl: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=800&auto=format&fit=crop', location: '3rd/4th Arrondissement', hours: 'Varia por local', price: '$$' },
    { id: '7', city: 'Tóquio', category: 'Cultura e História', name: 'Templo Senso-ji', description: 'O templo budista mais antigo e significativo de Tóquio, localizado em Asakusa.', imageUrl: 'https://letsflyaway.com.br/wp-content/uploads/2018/09/senso-ji-templo-640x400.jpg', location: 'Asakusa, Tóquio', hours: '24 horas (Salão: 06h-17h)', price: 'Gratuito' },
    { id: '8', city: 'Tóquio', category: 'Gastronomia', name: 'Mercado de Tsukiji', description: 'Famoso mercado de rua perfeito para provar sushi fresco e street food japonês.', imageUrl: 'https://media.istockphoto.com/id/458234059/pt/foto/mercado-de-tsukiji.jpg?s=612x612&w=0&k=20&c=WqLYwLEIUUTXh5aZ7SY39pVkG4zlKc2VOfBBTtKAfmw=', location: 'Chuo City, Tóquio', hours: '05:00 - 14:00', price: '$$' },
    { id: '9', city: 'Nova York', category: 'Natureza e Aventura', name: 'Central Park', description: 'Um imenso oásis verde no meio da selva de pedra de Manhattan.', imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?q=80&w=800&auto=format&fit=crop', location: 'Manhattan, NY', hours: '06:00 - 01:00', price: 'Gratuito' },
    { id: '10', city: 'Nova York', category: 'Cultura e História', name: 'Broadway', description: 'O coração da indústria teatral americana com musicais inesquecíveis.', imageUrl: 'https://www.siegeljcc.org/clientuploads/events/Adult%20&%20Senior%20Alliance/Bway-May21-Marquees-Shows.jpg', location: 'Times Square Area', hours: 'Noturno', price: 'A partir de US$ 80' },
];