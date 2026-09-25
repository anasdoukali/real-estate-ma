import assert from "node:assert/strict";
import { mysqlCredentials } from "../src/db/config";

async function main() {
  assert.deepEqual(mysqlCredentials({ DATABASE_URL: "mysql://user:p%40ss@localhost:3307/site" }), {
    host: "localhost", port: 3307, user: "user", password: "p@ss", database: "site",
  });
  assert.equal(mysqlCredentials({ DB_HOST: "localhost", DB_NAME: "site", DB_USER: "user", DB_PASSWORD: "p@ss", DATABASE_URL: "postgresql://unused" }).password, "p@ss");
  assert.throws(() => mysqlCredentials({ DATABASE_URL: "postgresql://old" }), /mysql/);
  assert.throws(() => mysqlCredentials({ DB_HOST: "localhost" }), /DB_PASSWORD/);

  delete process.env.DB_HOST;
  process.env.DATABASE_URL = "mysql://test:test@127.0.0.1:1/test";
  const { db, pool } = await import("../src/db");
  const { leads, newsletterSubscribers, siteMaintenance } = await import("../src/db/schema");
  const { countProperties } = await import("../src/lib/queries");
  const queries: { sql: string; values: unknown[] }[] = [];
  const original = pool.query;
  // Exercise the real MySQL query builder/driver adapter, without network access.
  pool.query = (async (options: { sql: string }, values: unknown[]) => {
    queries.push({ sql: options.sql, values });
    if (options.sql.startsWith("select")) return [[[2]], []];
    return [{ insertId: 42, affectedRows: 1 }, []];
  }) as unknown as typeof pool.query;
  try {
    const ids = await db.insert(leads).values({ name: "Test", message: "Été à Marrakech" }).$returningId();
    assert.deepEqual(ids, [{ id: 42 }]);
    assert(queries[0].values.includes("Été à Marrakech"));
    assert(!queries[0].sql.toLowerCase().includes("returning"));

    await db.insert(newsletterSubscribers).values({ email: "test@example.com" }).onDuplicateKeyUpdate({ set: { active: true } });
    assert.match(queries[1].sql, /on duplicate key update/);
    await db.insert(siteMaintenance).values({ id: 1, description: "Test" }).onDuplicateKeyUpdate({ set: { enabled: true } });
    assert.match(queries[2].sql, /on duplicate key update/);

    assert.equal(await countProperties({ reference: "RiAd" }), 2);
    assert.match(queries[3].sql, /LOWER\(/);
    assert(!queries[3].sql.includes("ILIKE"));
    assert(queries[3].values.includes("%RiAd%"));
    console.log("MySQL adapter checks passed: configuration, generated IDs, UTF-8 parameters, upserts and case-insensitive search. No database was contacted.");
  } finally {
    pool.query = original;
    await pool.end();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
