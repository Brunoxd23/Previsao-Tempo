# Weather App — Guia para Desenvolvedor Júnior

Aplicação full-stack de previsão do tempo que exibe o clima atual e a previsão dos próximos dias para qualquer cidade do mundo.

---

## Estrutura do Projeto

```
weather-app/
├── backend/                    # API Node.js + Fastify + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   │   └── weatherController.ts   # Recebe a requisição HTTP
│   │   ├── services/
│   │   │   └── weatherService.ts      # Chama a API externa
│   │   ├── routes/
│   │   │   └── weatherRoutes.ts       # Define as rotas da API
│   │   ├── types/
│   │   │   ├── weather.ts             # Tipos TypeScript
│   │   │   └── errors.ts              # Classe de erro customizado
│   │   └── server.ts                  # Ponto de entrada do servidor
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                   # Interface React + Vite + TypeScript
    ├── src/
    │   ├── components/
    │   │   ├── ui/                    # Componentes Shadcn/ui
    │   │   │   ├── button.tsx
    │   │   │   ├── card.tsx
    │   │   │   ├── input.tsx
    │   │   │   └── sonner.tsx
    │   │   ├── SearchForm.tsx         # Formulário de busca
    │   │   ├── CurrentWeather.tsx     # Card do clima atual
    │   │   └── ForecastList.tsx       # Lista de previsão
    │   ├── lib/
    │   │   └── utils.ts               # Utilitário cn() do Tailwind
    │   ├── schemas/
    │   │   └── searchSchema.ts        # Validação Zod
    │   ├── services/
    │   │   └── api.ts                 # Chamadas HTTP com Axios
    │   ├── types/
    │   │   └── weather.ts             # Tipos TypeScript
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (já vem com o Node.js)

---

## Passo 1 — Obter a API Key do OpenWeatherMap

1. Acesse [https://openweathermap.org](https://openweathermap.org) e crie uma conta gratuita
2. Após o login, vá em **API keys** no menu do seu perfil
3. Copie a chave gerada (pode levar alguns minutos para ativar)

> A conta gratuita dá acesso ao endpoint de previsão de 5 dias, que é suficiente para esta aplicação.

---

## Passo 2 — Configurar o Back-End

### 2.1 Instalar dependências

```bash
cd weather-app/backend
npm install
```

### 2.2 Criar o arquivo `.env`

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha com sua chave:

```env
OPENWEATHER_API_KEY=cole_sua_chave_aqui
PORT=3333
FRONTEND_URL=http://localhost:5173
```

### 2.3 Iniciar o servidor em modo desenvolvimento

```bash
npm run dev
```

Você deve ver a mensagem:

```
Servidor rodando em http://localhost:3333
```

### Testar a API

Abra o navegador ou use um cliente HTTP e acesse:

```
GET http://localhost:3333/api/weather/São Paulo
```

---

## Passo 3 — Configurar o Front-End

Abra um **novo terminal** (mantenha o backend rodando).

### 3.1 Instalar dependências

```bash
cd weather-app/frontend
npm install
```

### 3.2 Criar o arquivo `.env`

```bash
cp .env.example .env
```

O arquivo `.env` do frontend deve conter:

```env
VITE_API_URL=http://localhost:3333/api
```

### 3.3 Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

---

## Como a Aplicação Funciona

### Fluxo completo de uma busca

```
Usuário digita "Londres" → Clica em "Buscar"
     ↓
React Hook Form valida o campo com Zod
     ↓
Axios faz GET /api/weather/Londres
     ↓
Backend recebe a requisição no weatherController
     ↓
weatherService chama a API do OpenWeatherMap
  - GET /data/2.5/weather (clima atual)
  - GET /data/2.5/forecast (previsão 5 dias)
     ↓
Dados são transformados e retornados ao frontend
     ↓
React renderiza CurrentWeather + ForecastList
     ↓
Toast exibe "Previsão carregada para London!"
```

### Por que o backend existe?

A API Key do OpenWeatherMap **nunca** pode ficar exposta no frontend, pois qualquer pessoa poderia ver no código-fonte do navegador e usar sua cota gratuita. O backend age como intermediário: ele recebe o nome da cidade do frontend, injeta a API Key (armazenada com segurança no `.env`), chama o OpenWeatherMap, e devolve apenas os dados necessários.

---

## Scripts Disponíveis

### Backend

| Comando         | Descrição                               |
| --------------- | --------------------------------------- |
| `npm run dev`   | Inicia com hot-reload (desenvolvimento) |
| `npm run build` | Compila TypeScript para JavaScript      |
| `npm run start` | Inicia a versão compilada (produção)    |

### Frontend

| Comando           | Descrição                                |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Inicia o servidor Vite (desenvolvimento) |
| `npm run build`   | Gera a build de produção                 |
| `npm run preview` | Pré-visualiza a build de produção        |

---

## Decisões Técnicas

| Tecnologia          | Motivo                                                             |
| ------------------- | ------------------------------------------------------------------ |
| **Fastify**         | Framework Node.js de alta performance com tipagem nativa           |
| **Zod**             | Validação de schema no frontend com inferência de tipos TypeScript |
| **React Hook Form** | Gerenciamento de formulários performático e integrado com Zod      |
| **Shadcn/ui**       | Componentes acessíveis e estilizáveis baseados em Radix UI         |
| **Sonner**          | Toast moderno e com suporte a estados (loading/sucesso/erro)       |
| **Axios**           | Cliente HTTP com tratamento de erros e interceptors                |

---

## Possíveis Erros e Soluções

**"Cidade não encontrada"** → Verifique a ortografia do nome da cidade. Tente em inglês (ex: "London" em vez de "Londres").

**"API Key inválida"** → Verifique se a chave no `.env` do backend está correta e ativa. Novas chaves podem demorar até 2 horas para ativar.

**Erro de CORS** → Verifique se o backend está rodando na porta 3333 e se `FRONTEND_URL` no `.env` do backend aponta para a URL correta do frontend.

**Porta já em uso** → Altere o `PORT` no `.env` do backend e atualize o `VITE_API_URL` no `.env` do frontend de acordo.
