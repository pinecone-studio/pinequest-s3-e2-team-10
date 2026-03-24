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
- R2 binding: `pinequest_assets`
- R2 bucket name: `pinequest-assets`

This project is still a standard NestJS server right now. The Wrangler config is the source of truth for Cloudflare resources, but the Nest app has not yet been adapted to run as a Cloudflare Worker.

When you want to inspect the Cloudflare side manually, run Wrangler directly from the `backend` folder, for example:

- `npx wrangler whoami`
- `npx wrangler d1 list`
- `npx wrangler r2 bucket list`

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

## R2 Setup

R2 storage was created for this project on March 24, 2026.

- Bucket name: `pinequest-assets`
- Wrangler binding name: `pinequest_assets`
- Env template: [`.env.example`](/c:/Users/tsats/Desktop/pinequest-s3-e2-team-10/backend/.env.example)

The Worker-side binding is already defined in [`wrangler.toml`](/c:/Users/tsats/Desktop/pinequest-s3-e2-team-10/backend/wrangler.toml). For the current NestJS server, use the S3-compatible R2 API values in `backend/.env` when you add upload/download code:

- `CLOUDFLARE_R2_BUCKET_NAME`
- `CLOUDFLARE_R2_BINDING_NAME`
- `CLOUDFLARE_R2_ENDPOINT`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_PUBLIC_URL`

Useful commands:

- `npm run r2:list`
- `npm run r2:create`

To finish S3-compatible access for the Nest server, create an R2 API token in Cloudflare and place its access key ID and secret access key into `backend/.env`.

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
- `POST /api/uploads`
- `GET /api/uploads`
- `GET /api/uploads/:id`
- `GET /api/uploads/:id/content`

## Upload Endpoint

Use `multipart/form-data` and send the file in the `file` field.

Example:

```bash
curl -X POST "http://localhost:3001/api/uploads?folder=submissions" \
  -F "file=@./example.pdf"
```

The upload response includes:

- The upload record `id`
- The R2 object `key`
- The `bucket` name
- The original file name
- The uploaded `contentType`
- The file `size`
- A `publicUrl` if `CLOUDFLARE_R2_PUBLIC_URL` is configured

Useful follow-up routes:

- `GET /api/uploads` returns known upload metadata records
- `GET /api/uploads/:id` returns one upload metadata record
- `GET /api/uploads/:id/content` streams the private file through the backend
