# Plenarte Fitness

> A força do fitness com a elegância do ballet.

Plataforma web de **Ballet Fitness** online — curso sob demanda, compra via Mercado Pago e área da aluna com aulas no YouTube.

**Site:** [plenarte-fitness-iota.vercel.app](https://plenarte-fitness-iota.vercel.app)  
**Marca irmã:** [Plenarte Ballet](https://www.plenarteballet.com.br)

---

## O que o produto faz

| Papel | O que consegue fazer |
| --- | --- |
| **Visitante** | Ver a home, o curso e criar conta |
| **Aluna** | Comprar, acompanhar progresso e assistir aulas |
| **Professora** | Ver alunas, receita, pendentes e gerenciar curso/aulas |

Também inclui **Minha conta** (nome e senha) para quem está logado.

---

## Stack

### Frontend

| Tecnologia | Para que serve |
| --- | --- |
| **Next.js** | Framework que monta o site (páginas e rotas) |
| **React** | Biblioteca que cria a interface em componentes |
| **TypeScript** | JavaScript com tipos, para reduzir erros |
| **Tailwind CSS** | Estiliza a interface com classes utilitárias |
| **Motion** | Animações leves na tela |

### Backend

| Tecnologia | Para que serve |
| --- | --- |
| **Next.js (API Routes)** | Endpoints no servidor (`/api`) para login, compra, conta etc. |
| **Auth.js (NextAuth)** | Autenticação: login, sessão e papéis (aluna / professora) |
| **Prisma** | ORM que lê e grava no banco com queries tipadas |
| **PostgreSQL** | Banco de dados relacional (usuários, curso, compras, progresso) |
| **Neon** | Hospeda o PostgreSQL em produção |
| **bcryptjs** | Criptografa e valida senhas |
| **Zod** | Valida dados que chegam nas APIs e formulários |
| **Mercado Pago** | Processa o pagamento do curso no servidor |

### Infra e outros

| Tecnologia | Para que serve |
| --- | --- |
| **Vercel** | Hospeda e faz o deploy do site |
| **YouTube** | Guarda e exibe as aulas (vídeos embutidos) |
| **Yarn / npm** | Gerencia as bibliotecas do projeto |

---

## Como rodar local

### 1. Pré-requisitos

- Node.js
- Yarn ou npm
- PostgreSQL local (`npx prisma dev`) ou uma URL de banco

### 2. Ambiente

```bash
cp .env.example .env
```

Preencha no `.env`:

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | Conexão com o PostgreSQL |
| `AUTH_SECRET` | Segredo da sessão (`openssl rand -base64 32`) |
| `AUTH_URL` | URL do app (local: `http://localhost:3000`) |
| `MERCADOPAGO_ACCESS_TOKEN` | Token do Mercado Pago |
| `NEXT_PUBLIC_APP_URL` | URL pública (checkout e webhook) |
| `TEACHER_EMAILS` | E-mails que viram professora no cadastro/login |

### 3. Instalar e preparar o banco

```bash
yarn
yarn db:setup
```

Isso gera o Prisma Client, aplica o schema e roda o seed.

### 4. Subir o app

Em um terminal:

```bash
npx prisma dev
```

Em outro:

```bash
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Conta de teste (seed)

| Campo | Valor |
| --- | --- |
| E-mail | `professora@plenarte.com` |
| Senha | `professora123` |

---

## Fluxo principal

```text
Professora cadastra / edita o curso e as aulas (YouTube)
        ↓
Aluna cria conta e compra pelo Mercado Pago
        ↓
Webhook confirma o pagamento (status PAID)
        ↓
Aluna assiste em Minha área · progresso é marcado ao abrir a aula
        ↓
Professora acompanha alunas, receita e pendentes no Painel
```

---

## Scripts úteis

| Comando | O que faz |
| --- | --- |
| `yarn dev` | Sobe o Next.js em desenvolvimento |
| `yarn build` | Gera o Prisma Client e faz o build |
| `yarn db:generate` | Gera o Prisma Client |
| `yarn db:push` | Sincroniza o schema com o banco |
| `yarn db:seed` | Popula professora e curso de exemplo |
| `yarn db:setup` | generate + push + seed |

---

## Produção (resumo)

1. Deploy na **Vercel** com as mesmas variáveis do `.env` (URL de produção).
2. Banco de produção no **Neon** — rode `prisma db push` quando o schema mudar.
3. Webhook do Mercado Pago apontando para  
   `https://SEU-DOMINIO/api/webhooks/mercadopago`.
4. Em local, use um túnel (ngrok etc.) se precisar testar o webhook.

---

## Fora do escopo (por enquanto)

- Ballet clássico no mesmo produto  
- App mobile  
- Marketplace de várias professoras  
- IA / recomendações  

---

## Licença

Projeto privado — Plenarte Fitness © 2026
