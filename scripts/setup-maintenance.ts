import { config } from "dotenv";
import { readFile } from "node:fs/promises";

config({ path: ".env.local" });
async function main() {
  const { pool } = await import("../src/db");
  try {
    const sql = await readFile(new URL("../src/db/migrations/001_site_maintenance.sql", import.meta.url), "utf8");
    await pool.query(sql);
    console.log("Maintenance table ready (existing settings preserved).");
  } finally { await pool.end(); }
}
main().catch(() => { console.error("Could not create maintenance table. Check database connectivity and permissions."); process.exitCode = 1; });
