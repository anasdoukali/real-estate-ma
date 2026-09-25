import { config } from "dotenv";
import type { RowDataPacket } from "mysql2";

config({ path: ".env.local" });
async function main() {
  const { pool } = await import("../src/db");
  try {
    const [columns] = await pool.query<RowDataPacket[]>(
      "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'neighborhoods' AND COLUMN_NAME = 'profile'",
    );
    if (!columns.length) await pool.query("ALTER TABLE neighborhoods ADD COLUMN profile json");
    console.log("Neighborhood profile storage ready; existing data preserved.");
  } finally {
    await pool.end();
  }
}
main().catch(() => {
  console.error("Could not add neighborhood profile storage. Check database connectivity and permissions.");
  process.exitCode = 1;
});
