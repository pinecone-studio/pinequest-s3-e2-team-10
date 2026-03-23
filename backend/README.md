# Backend

NestJS API scaffold for the LMS demo.

## Modules

- `auth`
- `users`
- `courses`
- `assessments`
- `assignments`
- `submissions`
- `results`
- `reports`

## Guidelines

- Keep each module focused on one business responsibility.
- Start with in-memory data or mock responses if needed.
- Implement only the endpoints required by the demo flow first.
- Add database integration only after the flow is stable.

## Cloudflare Setup

This backend now has a real Wrangler config at [`wrangler.toml`](/c:/Users/tsats/Desktop/pinequest-s3-e2-team-10/backend/wrangler.toml) for the Cloudflare account and D1 database verified on March 23, 2026.

- Account: `Avengers.pinequest@gmail.com's Account`
- D1 binding: `lms`
- D1 database name: `lms-apac`
- D1 database id: `78c854ea-0d1c-4104-965d-aa59d095be32`

This project is still a standard NestJS server right now. The Wrangler config is the source of truth for Cloudflare resources, but the Nest app has not yet been adapted to run as a Cloudflare Worker.

When you want to inspect the Cloudflare side manually, run Wrangler directly from the `backend` folder, for example:

- `npx wrangler whoami`
- `npx wrangler d1 list`

## Drizzle Setup

Drizzle has been added as the database layer foundation without replacing the current mock-data flow yet.

- Schema file: [`src/database/schema.ts`](/c:/Users/tsats/Desktop/pinequest-s3-e2-team-10/backend/src/database/schema.ts)
- Drizzle config: [`drizzle.config.ts`](/c:/Users/tsats/Desktop/pinequest-s3-e2-team-10/backend/drizzle.config.ts)
- Initial migration: [`drizzle/0000_initial_schema.sql`](/c:/Users/tsats/Desktop/pinequest-s3-e2-team-10/backend/drizzle/0000_initial_schema.sql)
- Env template: [`.env.example`](/c:/Users/tsats/Desktop/pinequest-s3-e2-team-10/backend/.env.example)

Useful commands:

- `npm run db:generate`
- `npm run db:migrate:local`
- `npm run db:migrate:remote`
- `npm run db:studio`

Before running Drizzle against Cloudflare D1, set these variables in `backend/.env`:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_D1_TOKEN`

## Starter endpoints

- `GET /api`
- `GET /api/auth/roles`
- `GET /api/users`
- `GET /api/courses`
- `GET /api/assessments`
- `GET /api/assignments`
- `GET /api/submissions`
- `GET /api/results`
- `GET /api/reports/summary`
