# Guia de Contribuição - Viaja AI 🌍✈️

Este documento foi criado para guiar nossa equipe no desenvolvimento da plataforma. Nosso objetivo com este guia é manter o código organizado, padronizar nossa comunicação técnica e garantir que o projeto escale com qualidade.

---

## 1. Stack/Estrutura

Nosso projeto funciona como um monorepo, dividido em duas frentes principais:

* **Frontend (`/frontend`):** Next.js 16 (App Router), React, TypeScript, Tailwind CSS e componentes da Shadcn UI.
* **Backend (`/backend`):** Python (FastAPI), PostgreSQL (via SQLAlchemy assíncrono), Alembic para migrations e integração com LLMs (Claude/Gemini) e APIs externas (SerpAPI, TripAdvisor, OpenWeatherMap).

---

## 2. Nomenclatura de Branches

Para manter o histórico limpo e sabermos exatamente em que cada integrante está trabalhando, utilizamos um sistema baseado em prefixos e escopo. O fluxo principal ocorre na branch `main`. 

Ao iniciar uma nova tarefa, crie uma branch a partir da `main` seguindo o formato: `tipo/escopo/descricao-curta`.

**Tipos:**
* `feat/`: Para novas funcionalidades (ex: `feat/front/roteiro-dinamico`)
* `fix/`: Para correção de bugs (ex: `fix/back/erro-conexao`)
* `refactor/`: Para melhorias de código sem alterar o comportamento (ex: `refactor/front/componentizacao-sidebar`)
* `ai/`: Para ajustes de prompt ou troca de modelos de linguagem (ex: `ai/back/migracao-para-gemini`)
* `docs/`: Para documentação (ex: `docs/atualiza-readme`)

---

## 3. Padrões de Commit

Adotamos o padrão do **Conventional Commits**. As mensagens devem ser claras, no tempo verbal imperativo e escritas em **português**.

**Estrutura do commit:**
`tipo(escopo opcional): descrição curta`

**Exemplos Práticos:**
* ✅ `feat(frontend): adiciona card de exibicao de voos`
* ✅ `fix(backend): corrige loop infinito na chamada da SerpAPI`
* ✅ `refactor(db): altera coluna content para aceitar jsonb`
* ✅ `ai(prompts): refina prompt principal para evitar roteiros muito longos`

**O que NÃO fazer:**
* ❌ `commit comitando tudo`
* ❌ `arrumei um bug la no front`
* ❌ `update`

---

## 4. Fluxo de Trabalho e Pull Requests (PRs)

Para manter a estabilidade do sistema e garantir que o trabalho em equipe flua sem conflitos, **ninguém deve comitar ou dar merge diretamente na branch `main`**.

**Passo a passo do commit:**

1. **Sincronize com a main** Antes de começar, garanta que sua base está atualizada (`git pull origin main`).
2. **Crie sua branch:** Siga o padrão de nomenclatura (ex:`git checkout -b feat/front/roteiro-dinamico`).
3. **Faça os commits:** Faça commits granulares (pequenos e lógicos) e envie para o GitHub (`git push origin sua-branch`).
4. **Abra o Pull Request:** No GitHub, abra um PR da sua branch apontando para a `main`.

**Modelo de descrição do Pull Request:**

Copie, cole e preencha a estrutura abaixo ao abrir um PR no GitHub:

```text
**Descrição:**
[Explicação direta e concisa da implementação ou correção]

**Checklist:**
- [ ] Código atende aos padrões do CONTRIBUTING.md.
- [ ] Novas dependências/variáveis foram documentadas.
- [ ] Migrations do banco foram geradas (se aplicável).

**Como Testar:**
1. [Passo a passo técnico. Ex: alembic upgrade head]
2. [Passo a passo de uso. Ex: acessar a rota /login]

**Screenshots:**
[Inserir evidências visuais, se houver impacto na interface]
```

