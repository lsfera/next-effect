# Indie AI Tools Directory

A curated directory of AI apps for every use case. Submit your AI app for free to get discovered, find new users, and boost SEO with a backlink.

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker with Compose support

### Install dependencies

```bash
pnpm install
```

### Start local services

This project uses:

- PostgreSQL (Docker service: `postgres`)
- LocalStack for AWS mocks (Docker service: `localstack`, services: S3 + SES)

```bash
docker compose up -d postgres localstack
```

### Environment variables

Use `.env.local` for local runtime configuration.

Minimum local values:

```env
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/next_effect
AWS_REGION=us-east-1
AWS_ENDPOINT_URL=http://host.docker.internal:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EMAIL_FROM=no-reply@example.com
S3_BUCKET_NAME=local-bucket
```

Optional:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `ADMIN_EMAILS` (comma-separated)

### Database migrations

Apply schema migrations:

```bash
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/next_effect pnpm exec drizzle-kit migrate
```

### Seed snapshot data

Load sample data:

```bash
docker compose exec -T postgres psql -U postgres -d next_effect < drizzle/0002_seed_snapshot.sql
```

### Run the app

Recommended in VS Code:

- Run task: `dev` from `.vscode/tasks.json`

This task:

- starts required Docker services
- waits for Postgres readiness
- resolves current container IPs dynamically
- exports runtime env vars
- runs `pnpm dev`

Or run manually:

```bash
pnpm run dev
```

### Troubleshooting

- `Unable to acquire lock at .next/dev/lock`
	- Stop all running Next.js dev processes, then remove `.next/dev/lock`.
- Better Auth invalid origin for `localhost:3001`
	- If port 3000 is in use, Next may start on 3001. Current auth config allows both origins.
- `next/image` invalid hostname for seeded images
	- `dummyimage.com` is configured in `next.config.ts`.
