import { config } from "dotenv";
import type { RowDataPacket } from "mysql2";

config({ path: ".env.local", quiet: true });

async function main() {
  const { pool } = await import("../src/db");
  try {
    await pool.query("SELECT 1");
    const required = ["admin_users", "agency_settings", "agents", "articles", "leads", "neighborhoods", "newsletter_subscribers", "properties", "property_features", "property_images", "site_maintenance", "testimonials", "valuation_requests"];
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT TABLE_NAME AS name FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()",
    );
    const found = new Set(rows.map((row) => row.name));
    const missing = required.filter((table) => !found.has(table));
    if (missing.length) throw new Error(`Missing tables: ${missing.join(", ")}`);
    console.log("MySQL connection succeeded; all 13 application tables exist.");
  } finally {
    await pool.end();
  }
}

main().catch(() => {
  console.error("MySQL check failed. Verify host, credentials, access permissions and the imported schema.");
  process.exitCode = 1;
});
