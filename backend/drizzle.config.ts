import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const token = process.env.CLOUDFLARE_D1_TOKEN;

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials:
    accountId && databaseId && token
      ? {
          accountId,
          databaseId,
          token,
        }
      : undefined,
});
