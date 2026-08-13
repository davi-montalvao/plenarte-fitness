# Plenarte Ballet Fitness

MVP de cursos online de **ballet fitness** para mulheres adultas.

## O que já tem

- Cadastro / login
- Catálogo de cursos
- Compra via Mercado Pago
- Área da aluna com vídeos (YouTube unlisted)
- Painel da professora (criar curso e aulas)

## Stack

Next.js · PostgreSQL · Prisma · Auth.js · Mercado Pago

## Setup

1. Crie um banco PostgreSQL local (ou na nuvem).

2. Copie o env:

```bash
cp .env.example .env
```

3. Preencha no `.env`:

- `DATABASE_URL`
- `AUTH_SECRET` (gere com `openssl rand -base64 32`)
- `MERCADOPAGO_ACCESS_TOKEN` (token de teste primeiro)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

4. Instale e prepare o banco:

```bash
npm install
npm run db:setup
```

5. Rode:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Conta seed (professora)

- Email: `professora@plenarte.com`
- Senha: `professora123`

## Fluxo do MVP

1. Professora cria curso e aulas com URL do YouTube unlisted
2. Aluna se cadastra, compra no Mercado Pago
3. Webhook marca a compra como paga
4. Aluna assiste em **Minha área**

## Fora do MVP (por enquanto)

- Ballet clássico
- IA / recomendações
- App mobile
- Marketplace de várias professoras

## Observação sobre webhook

Em local, o Mercado Pago precisa alcançar `/api/webhooks/mercadopago`. Use um túnel (ngrok, Cloudflare Tunnel) e coloque essa URL pública em `NEXT_PUBLIC_APP_URL` / `notification_url`.
