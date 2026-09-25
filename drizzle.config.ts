import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { mysqlCredentials } from "./src/db/config";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations/mysql",
  dbCredentials: {
    ...mysqlCredentials(),
    ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: true } } : {}),
  },
});
