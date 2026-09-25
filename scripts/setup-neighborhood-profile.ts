import { config } from "dotenv";
import { readFile } from "node:fs/promises";

config({ path: ".env.local" });
async function main() {
  const { pool } = await import("../src/db");
  try {
    const sql = await readFile(new URL("../src/db/migrations/002_neighborhood_profile.sql", import.meta.url), "utf8");
    await pool.query(sql);
    console.log("Neighborhood profile storage ready; existing data preserved.");
  } finally {
    await pool.end();
  }
}
main().catch(() => {
  console.error("Could not add neighborhood profile storage. Check database connectivity and permissions.");
  process.exitCode = 1;
});
