import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next.js loads .env.local for the application. Load the same file here so
// schema commands target the database the application actually uses.
config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Add it to .env.local.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
