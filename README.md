# Private Feedback

Full-stack Base44 application with a React + Vite frontend and Base44-native backend.

## Stack
- React 18 + Vite
- Tailwind CSS + shadcn/Radix-style UI primitives
- Base44 Auth + SDK
- Base44 Entities, Functions and AI Agent
- Telnyx SMS integration
- Stripe credits + Automatic Tax

## Base44 app
App ID: `6a9483ca2476b4e2122ed931`

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to Base44
Authenticate the Base44 CLI, then:
```bash
npx base44 --app-id 6a9483ca2476b4e2122ed931 deploy --build -y
```

Required secrets are documented in `.env.example`. Never commit real secret values.
