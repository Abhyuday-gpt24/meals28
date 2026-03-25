# Meals28 — Food Delivery E-commerce Platform

A full-stack food delivery platform built for a client migrating from WordPress to a modern, scalable web application. Features a responsive storefront, menu management, user authentication, and a Supabase-powered backend.

Built with **Next.js (App Router)**, **Supabase**, **Prisma ORM**, and **TypeScript**.

> 🔗 **Live Preview:** [meals28.vercel.app](https://meals28.vercel.app)

---

## Features

- **Product Catalog & Menu** — Browse food items with categories, descriptions, images, and pricing.
- **User Authentication** — Secure sign-up and login powered by Supabase Auth.
- **Cart & Ordering** — Add items to cart, manage quantities, and place orders.
- **Responsive Design** — Mobile-first UI built with Tailwind CSS, works across all devices.
- **Type-Safe Data Layer** — Prisma ORM connected to Supabase (PostgreSQL) for reliable database operations.
- **Input Validation** — Zod schema validation for all forms and API inputs.
- **REST API Routes** — Next.js API routes handling all backend operations.

---

## Tech Stack

| Layer           | Technology            |
| --------------- | --------------------- |
| **Framework**   | Next.js (App Router)  |
| **Language**    | TypeScript            |
| **Database**    | Supabase (PostgreSQL) |
| **ORM**         | Prisma                |
| **Validation**  | Zod                   |
| **Styling**     | Tailwind CSS          |
| **Deployment**  | Vercel                |
| **Dev Tooling** | Claude Code, ESLint   |

---

## Project Structure

```
├── app/                  # Next.js App Router — pages, layouts, API routes
├── lib/                  # Shared utilities, database client, helpers
├── prisma/               # Prisma schema, migrations, seed data
├── public/images/        # Static food item images
├── scripts/              # Utility scripts (DB setup, data seeding)
├── proj_des.txt          # Original project requirements document
├── proxy.ts              # Proxy configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- pnpm (recommended)

### Setup

```bash
# Clone the repository
git clone https://github.com/Abhyuday-gpt24/meals28.git
cd meals28

# Install dependencies
pnpm install

# Set up environment variables
# Create a .env file with your Supabase credentials:
# DATABASE_URL=your_supabase_postgres_url
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run database migrations
npx prisma migrate dev

# Seed the database with sample menu items
npx prisma db seed

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Architecture Decisions

- **Supabase over custom backend** — Chose Supabase for built-in auth, real-time capabilities, and managed PostgreSQL, reducing backend development time significantly.
- **Prisma ORM** — Provides type-safe database queries that catch errors at compile time rather than runtime. Auto-generated types from the schema keep the frontend and database in sync.
- **Zod validation** — All user inputs and API payloads are validated with Zod schemas, preventing malformed data from reaching the database.
- **Next.js App Router** — Server Components for fast initial page loads, Server Actions for form handling, and API routes for REST endpoints.

---

## Status

This project was built for a client as a WordPress replacement. The core platform (menu, auth, cart, ordering) is functional. Payment gateway integration is pending.

---

## Author

**Abhyuday Gupta** — Software Engineer

- [LinkedIn](https://www.linkedin.com/in/AbhyudayGupta24)
- [GitHub](https://github.com/Abhyuday-gpt24)
