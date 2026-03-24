import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/d1';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { AnyD1Database } from 'drizzle-orm/d1/driver';
import * as schema from './schema';

@Injectable()
export class DatabaseService {
  private database: DrizzleD1Database<typeof schema> | null = null;

  setBinding(binding: AnyD1Database) {
    this.database = drizzle(binding, { schema });
  }

  getDb() {
    return this.database;
  }

  isConfigured() {
    return this.database !== null;
  }
}
