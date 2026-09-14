/**
 * Public pages should remain renderable when the remote database is sleeping or
 * temporarily unreachable. Admin pages and API writes deliberately keep their
 * normal error behavior so a database outage is never mistaken for empty data.
 */
let lastWarningAt = 0;

export async function loadPublicData<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    const now = Date.now();
    if (now - lastWarningAt > 30_000) {
      lastWarningAt = now;
      const cause = error instanceof Error && "cause" in error ? error.cause : error;
      const code =
        cause && typeof cause === "object" && "code" in cause && typeof cause.code === "string"
          ? ` (${cause.code})`
          : "";
      console.warn(`[public-data] Database unavailable${code}; serving fallback content.`);
    }
    return fallback;
  }
}
