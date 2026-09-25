/** Shared by the application and Drizzle CLI. Never log the returned credentials. */
export function mysqlCredentials(env: Record<string, string | undefined> = process.env) {
  if (env.DB_HOST) {
    if (!env.DB_NAME || !env.DB_USER || env.DB_PASSWORD === undefined) {
      throw new Error("Set DB_NAME, DB_USER and DB_PASSWORD alongside DB_HOST.");
    }
    const port = Number(env.DB_PORT || 3306);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error("DB_PORT must be a valid port number.");
    }
    return { host: env.DB_HOST, port, user: env.DB_USER, password: env.DB_PASSWORD, database: env.DB_NAME };
  }
  if (env.DATABASE_URL?.startsWith("mysql://")) {
    const url = new URL(env.DATABASE_URL);
    return {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: decodeURIComponent(url.pathname.slice(1)),
    };
  }
  throw new Error("Set DB_HOST, DB_NAME, DB_USER and DB_PASSWORD, or a mysql:// DATABASE_URL.");
}
