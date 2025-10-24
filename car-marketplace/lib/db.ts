import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';

const asString = (file: string) => {
  return fs.readFileSync(path.join(process.cwd(), '..', 'db', 'app', file), 'utf8');
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(asString(text), params),
};
