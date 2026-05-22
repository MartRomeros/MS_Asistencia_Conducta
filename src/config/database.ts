import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbSchema = process.env.DB_SCHEMA?.trim();
const searchPath = dbSchema ? `${dbSchema},public` : "public";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  // Backward compatibility: some env files still use the typo DB_DATABSE.
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!),
  options: `-c search_path=${searchPath}`,
  ssl:
    process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export default pool;
