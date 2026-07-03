# Operation ANSA

Self-hosted web app for tracking daily activities and progress toward goals over weeks, months, and years.

## Features

- Create goals with yes/no check-ins or numeric daily targets
- Log daily progress with optional notes
- View current streaks and weekly/monthly completion rates
- Charts for the last 7 and 30 days per goal
- PostgreSQL-backed storage via Docker

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Recharts

## Getting started

### Option A: Use your system PostgreSQL (recommended if Docker Compose is unavailable)

If you already have PostgreSQL running on port 5432, create the app database and user:

```bash
sudo -u postgres psql <<'SQL'
CREATE USER ansa WITH PASSWORD 'ansa' CREATEDB;
CREATE DATABASE operation_ansa OWNER ansa;
GRANT ALL PRIVILEGES ON DATABASE operation_ansa TO ansa;
SQL
```

Then install, migrate, and run:

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

### Option B: Use Docker PostgreSQL

Requires the Docker Compose plugin (`docker compose`). If `docker compose up -d` fails, install the compose plugin or use Option A instead.

```bash
docker compose up -d
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Troubleshooting

**`P1010: User was denied access`** — PostgreSQL is reachable, but the user/database in `DATABASE_URL` does not exist or has the wrong password. Either create the `ansa` user and `operation_ansa` database (Option A), or update `.env` to match your existing PostgreSQL credentials.

**`docker compose up -d` fails with `unknown shorthand flag: 'd'`** — Docker Compose is not installed. Use Option A, or install the Docker Compose plugin for your distro.

## Useful commands

```bash
npm run dev          # start Next.js in development
npm run build        # production build
npm run start        # run production server
npm run db:migrate   # apply Prisma migrations
npm run db:studio    # open Prisma Studio
```

## Deployment notes

This MVP is designed for self-hosting on your own server. Run PostgreSQL alongside the Next.js app, set `DATABASE_URL`, run migrations, then build and start the app with `npm run build && npm run start`.

Authentication and multi-user support are not included yet; add those before exposing the app to the public internet.
