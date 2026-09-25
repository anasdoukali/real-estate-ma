import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2/promise";
import { mysqlCredentials } from "./config";

const globalForDb = globalThis as typeof globalThis & { __loukaMySqlPool?: Pool };

export const pool = globalForDb.__loukaMySqlPool ?? createPool({
  ...mysqlCredentials(),
  connectionLimit: 5,
  connectTimeout: 5_000,
  idleTimeout: 30_000,
  enableKeepAlive: true,
  charset: "utf8mb4",
  timezone: "Z",
  ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: true } } : {}),
});

if (process.env.NODE_ENV !== "production") globalForDb.__loukaMySqlPool = pool;

export const db = drizzle(pool, { mode: "default" });
