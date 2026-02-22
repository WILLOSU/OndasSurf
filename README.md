# 🌊 OndasSurf API

> API REST de previsão de condições de surf, construída com **Node.js**, **TypeScript** e **MongoDB**, seguindo os princípios de **Clean Architecture** e **TDD**.

[![Build Status](https://github.com/WILLOSU/OndasSurf/actions/workflows/ci.yml/badge.svg)](https://github.com/WILLOSU/OndasSurf/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológico](#stack-tecnológico)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [Endpoints da API](#endpoints-da-api)
- [Deploy](#deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## Sobre o Projeto

**OndasSurf** é uma API que fornece previsões de condições de surf para praias cadastradas pelo usuário. A API integra dados meteorológicos da [StormGlass API](https://stormglass.io/) e aplica um algoritmo próprio de rating (1–5 estrelas) baseado em direção e altura do swell, período entre ondas, direção e velocidade do vento e posição geográfica da praia.

O projeto foi desenvolvido com foco em **qualidade de software**: 54 testes automatizados (41 unitários + 13 funcionais), pipeline de CI/CD com GitHub Actions e deploy contínuo.

---

## Arquitetura

O projeto segue os princípios da **Clean Architecture**, organizando o código em camadas com dependências unidirecionais:

```
HTTP Request
     │
     ▼
┌─────────────┐
│ Controllers │  ← Recebem requisições, delegam ao service
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │  ← Orquestram a lógica de negócio
└──────┬──────┘
       │
  ┌────┴────┐
  ▼         ▼
┌───────┐ ┌────────┐
│Models │ │Clients │  ← Dados (MongoDB) e APIs externas
└───────┘ └────────┘
```

**Fluxo do endpoint `/forecast`:**

```
Cliente → [JWT Middleware] → ForecastController
       → BeachModel (busca praias do usuário)
       → ForecastService → StormGlassClient → StormGlass API
       → Algoritmo de Rating → Resposta agrupada por horário
```

---

## Funcionalidades

- **Autenticação JWT** — registro e login com geração de token
- **Hash de senhas** — bcrypt com pre-hook do Mongoose
- **Cadastro de praias** — vinculadas ao usuário autenticado
- **Previsão de surf** — dados meteorológicos normalizados por horário
- **Rating automático** — algoritmo que avalia qualidade da sessão (1–5)
- **Rate limiting** — proteção contra abuso da API
- **Validação OpenAPI** — schemas de entrada validados automaticamente
- **Logs estruturados** — Pino em formato JSON, pronto para observabilidade
- **CI/CD** — testes automáticos e deploy a cada push na branch principal

---

## Stack Tecnológico

| Categoria | Tecnologia |
|---|---|
| Runtime | Node.js 18+ |
| Linguagem | TypeScript 5 (modo strict) |
| Framework HTTP | Express + OvernightJS |
| Banco de Dados | MongoDB Atlas + Mongoose |
| Autenticação | JSON Web Token + bcrypt |
| HTTP Client | Axios (abstraído em `HTTPUtil.Request`) |
| Testes | Jest + ts-jest + Supertest + Nock |
| Logger | Pino + pino-pretty |
| Validação | express-openapi-validator |
| Utilitários | Lodash, http-status-codes, express-rate-limit |
| Dev Tools | ts-node-dev, ESLint, Prettier |
| CI/CD | GitHub Actions |

---

## Pré-requisitos

- **Node.js** >= 18
- **Yarn** >= 1.22
- **MongoDB** (local via Docker ou conta no [MongoDB Atlas](https://www.mongodb.com/atlas))
- Conta na [StormGlass API](https://stormglass.io/) para obter o token

---

## Instalação e Configuração

```bash
# 1. Clone o repositório
git clone https://github.com/WILLOSU/OndasSurf.git
cd OndasSurf

# 2. Instale as dependências
yarn install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais (veja seção abaixo)

# 4. (Opcional) Suba o MongoDB local com Docker
docker run -p 27017:27017 -d mongo

# 5. Inicie em modo desenvolvimento
yarn start:local
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# MongoDB
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/surf-forecast

# StormGlass API
STORM_GLASS_API_TOKEN=seu_token_aqui

# Autenticação JWT
AUTH_KEY=sua_chave_secreta_aqui
```

> ⚠️ **Nunca commite o arquivo `.env`.** Ele já está no `.gitignore`.

---

## Scripts Disponíveis

```bash
# Desenvolvimento com hot-reload
yarn start:local

# Build para produção
yarn build

# Iniciar versão compilada
yarn start

# Todos os testes
yarn test

# Apenas testes unitários
yarn test:unit

# Apenas testes funcionais (requer MongoDB rodando)
yarn test:functional

# Lint
yarn lint
yarn lint:fix

# Formatação
yarn style:check
yarn style:fix
```

---

## Testes

O projeto conta com **54 testes automatizados** seguindo a pirâmide de testes:

```
        ┌──────────────┐
        │  Funcionais  │  13 testes
        │  (E2E)       │  Servidor real + MongoDB + Nock
        └──────┬───────┘
               │
        ┌──────┴───────┐
        │   Unitários  │  41 testes
        │              │  Isolados com mocks tipados
        └──────────────┘
```

**Cobertura dos testes unitários:**
- `StormGlass Client` — normalização, validação e tratamento de erros
- `ForecastService` — agrupamento por horário e algoritmo de rating
- `AuthMiddleware` — validação e decodificação de JWT
- `AuthService` — geração e comparação de tokens/senhas

**Cobertura dos testes funcionais:**
- Criação e validação de usuários (incluindo e-mail único e hash de senha)
- Autenticação JWT e casos de erro (senha incorreta, usuário inexistente)
- CRUD de praias com autenticação
- Fluxo completo do forecast com Nock interceptando a StormGlass API

```bash
# Executar todos os testes
yarn test

# Executar com watch (desenvolvimento)
yarn test:unit --watch
```

---

## Endpoints da API

### Usuários

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| `POST` | `/users` | Criar novo usuário | ❌ |
| `POST` | `/users/authenticate` | Login e geração de JWT | ❌ |

### Praias

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| `POST` | `/beaches` | Cadastrar uma praia | ✅ |

### Forecast

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| `GET` | `/forecast` | Previsão de surf para as praias do usuário | ✅ |

> Endpoints com ✅ exigem o header: `x-access-token: <jwt_token>`

**Exemplo de resposta do `/forecast`:**

```json
[
  {
    "time": "2024-04-26T00:00:00+00:00",
    "forecast": [
      {
        "lat": -33.792726,
        "lng": 151.289824,
        "name": "Manly",
        "position": "E",
        "rating": 3,
        "swellDirection": 64.26,
        "swellHeight": 0.15,
        "swellPeriod": 3.89,
        "waveDirection": 231.38,
        "waveHeight": 0.47,
        "windDirection": 299.45,
        "windSpeed": 100
      }
    ]
  }
]
```

---

## Deploy

O projeto utiliza **GitHub Actions** para CI/CD:

1. A cada push na branch `main`, os testes são executados automaticamente
2. Em caso de sucesso, o deploy é realizado no servidor de produção (Render)

O arquivo de workflow está em `.github/workflows/ci.yml`.

---

## Estrutura do Projeto

```
OndasSurf/
├── src/
│   ├── clients/
│   │   ├── __tests__/
│   │   │   └── stormGlass.test.ts
│   │   └── stormGlass.ts          # Integração com API externa
│   ├── controllers/
│   │   ├── beaches.ts
│   │   ├── forecast.ts
│   │   ├── index.ts               # BaseController com tratamento de erros
│   │   └── users.ts
│   ├── middlewares/
│   │   ├── __tests__/
│   │   │   └── auth.test.ts
│   │   └── auth.ts                # Validação JWT
│   ├── models/
│   │   ├── beach.ts               # Mongoose model + interface
│   │   └── user.ts                # Mongoose model + pre-hooks
│   ├── services/
│   │   ├── __tests__/
│   │   │   └── forecast.test.ts
│   │   ├── auth.ts                # JWT + bcrypt
│   │   └── forecast.ts            # Lógica de negócio + rating
│   ├── util/
│   │   ├── errors/
│   │   └── request.ts             # Abstração HTTP (Axios)
│   ├── database.ts
│   ├── logger.ts                  # Pino singleton
│   ├── server.ts                  # Setup Express + OvernightJS
│   └── index.ts                   # Entrypoint
├── test/
│   ├── fixtures/                  # Dados mockados (JSON)
│   ├── functional/                # Testes E2E
│   ├── jest-setup.ts
│   └── jest-setup.unit.ts
├── config/
│   ├── default.json
│   ├── test.json
│   └── custom-environment-variables.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── jest.config.js
├── tsconfig.json
└── package.json
```

---

## Autor

**William Mota**
- GitHub: [@WILLOSU](https://github.com/WILLOSU)

---

> Projeto desenvolvido como aplicação prática dos conceitos de Clean Architecture, TDD e engenharia de software moderna com Node.js e TypeScript.