# ViajaAI 🌍✈️

Plataforma de roteiros de viagem personalizados gerados por IA, com busca real de voos, hotéis, atrações e previsão do tempo.

## Tecnologias

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — framework web
- [Anthropic Claude Haiku](https://www.anthropic.com/) — geração de roteiros com IA
- [SerpAPI](https://serpapi.com/) — busca de voos e hotéis (Google Flights / Google Hotels)
- [TripAdvisor Content API](https://tripadvisor.com/developers) — atrações e pontos de interesse
- [OpenWeatherMap](https://openweathermap.org/api) — previsão do tempo

## Estrutura do projeto

```
projeto-ds-viaja-ai/
├── backend/
│   ├── main.py                  # Endpoints da API
│   ├── requirements.txt
│   ├── .env.example             # Variáveis de ambiente necessárias
│   ├── ai/
│   │   └── llm_client.py        # Integração com Claude Haiku
│   ├── models/
│   │   └── chat.py              # Modelos Pydantic (tipos de dados)
│   └── services/
│       ├── chat_flow.py         # Lógica do fluxo de chat em etapas
│       ├── sessao.py            # Gerenciamento de sessões
│       ├── serpapi.py           # Voos e hotéis
│       ├── tripadvisor.py       # Atrações
│       └── clima.py             # Previsão do tempo
└── frontend/
    └── ...
```

## Como rodar o backend

### 1. Pré-requisitos
- Python 3.11+

### 2. Instalar dependências

```bash
cd backend
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas chaves de API (veja a seção abaixo).

### 4. Rodar o servidor

```bash
uvicorn main:app --reload
```

O servidor estará disponível em `http://localhost:8000`.

A documentação interativa da API estará em `http://localhost:8000/docs`.

## Variáveis de ambiente

| Variável | Onde obter | Obrigatória |
|---|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Sim |
| `SERPAPI_API_KEY` | [serpapi.com](https://serpapi.com) | Sim |
| `TRIPADVISOR_API_KEY` | [tripadvisor.com/developers](https://tripadvisor.com/developers) | Não* |
| `OPENWEATHERMAP_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api) | Não* |

*Se não configurada, o serviço usa dados mock automaticamente — o sistema continua funcionando.

## Endpoints principais

### Chat (fluxo principal)

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/chat/iniciar` | Inicia uma nova sessão de planejamento |
| `POST` | `/api/chat/mensagem` | Envia mensagem e avança o fluxo |
| `DELETE` | `/api/chat/{sessao_id}` | Encerra a sessão |

### Viagens anteriores

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/viagens` | Lista todas as viagens salvas |
| `GET` | `/api/viagens/{id}` | Retorna roteiro completo de uma viagem |
| `POST` | `/api/viagens/{id}/repetir` | Repete uma viagem com novas datas |
| `DELETE` | `/api/viagens/{id}` | Remove uma viagem do histórico |

## Fluxo do chat

```
iniciar → destino → pessoas → orçamento → datas
       → passagens → hotéis → estilo → interesses → roteiro gerado
```

Cada etapa retorna um JSON com:
- `etapa_atual` — etapa em que o chat está
- `mensagem_bot` — texto a exibir na interface
- `opcoes` — botões de ação (quando aplicável)
- `dados_extra` — voos/hotéis para exibição detalhada
- `roteiro` — roteiro completo (somente na etapa final)