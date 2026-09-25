import { config } from "dotenv";

config({ path: ".env.local" });
async function main() {
  const { pool } = await import("../src/db");
  try {
    const sql = `CREATE TABLE IF NOT EXISTS site_maintenance (
      id int PRIMARY KEY,
      enabled boolean NOT NULL DEFAULT false,
      description text NOT NULL,
      updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
    await pool.query(sql);
    console.log("Maintenance table ready (existing settings preserved).");
  } finally { await pool.end(); }
}
main().catch(() => { console.error("Could not create maintenance table. Check database connectivity and permissions."); process.exitCode = 1; });
