# Trackify

Trackify is a personal finance tracker built with Next.js App Router, Prisma, and NextAuth. It supports email/password auth, a protected dashboard, reporting/analytics, and profile management.

## Features

- Auth: credentials login with NextAuth (JWT sessions).
- Dashboard: stat cards, income/expense trends, category breakdown, recent transactions.
- Transactions: CRUD via API routes.
- Reports: analytics page with filters, charts, and summaries.
- Profile: update name/password, export data, clear transactions, logout.

## Tech Stack

- Next.js (App Router)
- Prisma + PostgreSQL
- NextAuth (Credentials provider)
- Recharts for charts
- Tailwind CSS for UI

## Project Structure

- app/(protected)/...: authenticated pages (dashboard, reports, profile)
- app/api/...: API routes (auth, transactions, profile)
- Components/: reusable UI components
- prisma/: Prisma schema and migrations
- scripts/: utilities (seed script)

## Environment Variables

Create a .env file with:

```
DATABASE_URL=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

Optional (if adding Google login later):

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Setup

Install dependencies:

```
npm install
```

Run the dev server:

```
npm run dev
```

Open http://localhost:3000/login

## Database

Prisma schema lives in prisma/schema.prisma.

Seed transactions (requires a user in the database):

```
node scripts/seed-transactions.mjs
```

## Routes

- /login, /signup: auth pages
- /dashboard: main dashboard
- /transaction: transaction management
- /reports: analytics
- /profile: profile settings


## API Endpoints

- /api/auth/[...nextauth]: NextAuth
- /api/auth/signup: signup
- /api/transactions: CRUD transactions
- /api/profile: profile updates, export, clear data

## Notes

- Root route (/) redirects to /dashboard.
- Profile updates write to Prisma and update the session so changes persist on refresh.
