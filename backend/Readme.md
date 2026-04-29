# ViajaAI 🌍✈️

Plataforma de roteiros de viagem personalizados gerados por IA, com busca real de voos, hotéis, atrações e previsão do tempo.

## Tecnologias

**Backend**

- [FastAPI](https://fastapi.tiangolo.com/) — framework web
- [SQLAlchemy](https://sqlalchemy.org/) + [PostgreSQL](https://www.postgresql.org/) — banco de dados
- [Alembic](https://alembic.sqlalchemy.org/) — migrations
- [Anthropic Claude Haiku](https://www.anthropic.com/) — geração de roteiros com IA
- [Gemini 3 Flash Preview](https://ai.google.dev/gemini) — geração de roteiros com IA
- [SerpAPI](https://serpapi.com/) — busca de voos e hotéis
- [TripAdvisor Content API](https://tripadvisor.com/developers) — atrações e pontos de interesse
- [OpenWeatherMap](https://openweathermap.org/api) — previsão do tempo

## Estrutura do projeto

```
projeto-ds-viaja-ai/
├── backend/
│   ├── alembic/                 # Migrations do banco de dados
│   ├── app/
│   │   ├── main.py              # Endpoints da API
│   │   ├── db/
│   │   │   ├── database.py      # Conexão com o banco
│   │   │   └── models.py        # Models do SQLAlchemy
│   │   ├── schemas/
│   │   │   └── chat.py          # Schemas Pydantic
│   │   ├── ia/
│   │   │   └── llm_client.py    # Integração com Claude Haiku / Gemini
│   │   └── services/
│   │       ├── chat_flow.py     # Lógica do fluxo de chat
│   │       ├── sessao.py        # Gerenciamento de sessões
│   │       ├── SerpAPI.py       # Voos e hotéis
│   │       ├── TripAdvisor.py   # Atrações
│   │       └── OpenWeather.py   # Previsão do tempo
│   ├── .env.example
│   └── requirements.txt
└── frontend/
└── ...
```

## Como rodar o backend

### 1. Pré-requisitos

- Python 3.11+
- PostgreSQL instalado e rodando

### 2. Clonar e entrar na pasta

```bash
cd backend
```

### 3. Criar e ativar o ambiente virtual

```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

### 4. Instalar dependências

```bash
pip install -r requirements.txt
```

### 5. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais (veja a seção de variáveis abaixo).

### 6. Criar o banco de dados

```bash
psql postgres -c "CREATE DATABASE travel_db;"
```

### 7. Rodar as migrations

```bash
alembic upgrade head
```

### 8. Rodar o servidor

```bash
uvicorn app.main:app --reload
```

O servidor estará disponível em `http://localhost:8000`.
A documentação interativa estará em `http://localhost:8000/docs`.

## Variáveis de ambiente

| Variável                 | Onde obter                                                       | Obrigatória |
| ------------------------ | ---------------------------------------------------------------- | ----------- |
| `ANTHROPIC_API_KEY`      | [console.anthropic.com](https://console.anthropic.com)           | Sim         |
| `GEMINI_API_KEY`         | [ai.google.dev](https://ai.google.dev)                           | Sim         |
| `SERPAPI_API_KEY`        | [serpapi.com](https://serpapi.com)                               | Sim         |
| `TRIPADVISOR_API_KEY`    | [tripadvisor.com/developers](https://tripadvisor.com/developers) | Não\*       |
| `OPENWEATHERMAP_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api)         | Não\*       |
| `DATABASE_URL`           | —                                                                | Sim         |
| `DATABASE_URL_SYNC`      | —                                                                | Sim         |

\*Se não configurada, o serviço usa dados mock automaticamente.

## Endpoints principais

### Chat (fluxo principal)

| Método   | Endpoint                | Descrição                              |
| -------- | ----------------------- | -------------------------------------- |
| `POST`   | `/api/chat/iniciar`     | Inicia uma nova sessão de planejamento |
| `POST`   | `/api/chat/mensagem`    | Envia mensagem e avança o fluxo        |
| `DELETE` | `/api/chat/{sessao_id}` | Encerra a sessão                       |

### Viagens

| Método   | Endpoint            | Descrição                              |
| -------- | ------------------- | -------------------------------------- |
| `GET`    | `/api/viagens`      | Lista todas as viagens salvas          |
| `GET`    | `/api/viagens/{id}` | Retorna roteiro completo de uma viagem |
| `DELETE` | `/api/viagens/{id}` | Remove uma viagem do histórico         |

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
