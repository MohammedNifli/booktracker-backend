import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { books } from "../models/book";
import { notes } from "../models/note";
import dotenv from 'dotenv'

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

export const db = drizzle(pool, { schema: { books, notes },logger:true });

export const poolClient=pool;
