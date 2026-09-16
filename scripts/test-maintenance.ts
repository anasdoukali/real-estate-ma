import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { SignJWT } from "jose";

async function main() {
  // Isolated test configuration: never connect to or modify the real database.
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  process.env.ADMIN_JWT_SECRET = "maintenance-test-secret-not-used-in-production";
  const { db, pool } = await import("../src/db");
  let enabled = false;
  let unavailable = false;
  let reads = 0;
  const original = db.select;
  db.select = (() => ({ from: () => ({ where: async () => {
    reads++;
    if (unavailable) throw new Error("Simulated database failure");
    return [{ enabled, description: "Test agency" }];
  } }) })) as unknown as typeof db.select;
  const { proxy } = await import("../src/proxy");
  const request = (path: string, options?: ConstructorParameters<typeof NextRequest>[1]) => new NextRequest(`http://localhost:3000${path}`, options);
  try {
    assert.equal((await proxy(request("/"))).headers.get("x-middleware-next"), "1");
    enabled = true;
    for (const path of ["/", "/biens/test", "/home-staging", "/blog/test?x=1"]) {
      const response = await proxy(request(path));
      assert.equal(response.status, 503);
      assert.equal(response.headers.get("x-middleware-rewrite"), "http://localhost:3000/maintenance");
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(response.headers.get("retry-after"), "300");
    }
    const api = await proxy(request("/api/services", { method: "POST" }));
    assert.equal(api.status, 503);
    assert.match((await api.json()).error, /maintenance/);
    const before = reads;
    for (const path of ["/admin/login", "/maintenance", "/api/health"]) {
      assert.equal((await proxy(request(path))).headers.get("x-middleware-next"), "1");
    }
    assert.equal(reads, before);
    assert.match((await proxy(request("/admin/maintenance"))).headers.get("location")!, /\/admin\/login/);
    const token = await new SignJWT({ sub: "1", email: "test@example.com", name: "Test" }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1m").sign(new TextEncoder().encode(process.env.ADMIN_JWT_SECRET));
    for (const path of ["/", "/biens/test", "/admin/maintenance", "/api/properties"]) {
      assert.equal((await proxy(request(path, { headers: { cookie: `mk_admin_session=${token}` } }))).headers.get("x-middleware-next"), "1");
    }
    assert.equal((await proxy(request("/", { headers: { cookie: "mk_admin_session=invalid" } }))).status, 503);
    enabled = false;
    assert.equal((await proxy(request("/"))).headers.get("x-middleware-next"), "1");
    unavailable = true;
    assert.equal((await proxy(request("/"))).status, 503);
    console.log("Maintenance checks passed: enabled/disabled, deep links, APIs, admin bypass, invalid sessions, database outage.");
  } finally { db.select = original; await pool.end(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
