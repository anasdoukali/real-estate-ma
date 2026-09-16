import type { MetadataRoute } from "next";
import { listArticles, listNeighborhoods, listProperties } from "@/lib/queries";
import { PROPERTY_TYPES } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/biens", "/quartiers", "/agence", "/contact", "/estimation", "/home-staging", "/confiez-nous-votre-bien", "/blog"].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
  }));
  try {
    const [props, hoods, posts] = await Promise.all([
      listProperties({ limit: 500 }),
      listNeighborhoods(),
      listArticles(true, 200),
    ]);
    return [
      ...staticRoutes,
      ...PROPERTY_TYPES.map((t) => ({ url: `${base}/types/${t.value}`, lastModified: new Date() })),
      ...props.map((p) => ({ url: `${base}/biens/${p.slug}`, lastModified: p.updatedAt })),
      ...hoods.map((h) => ({ url: `${base}/quartiers/${h.slug}`, lastModified: new Date() })),
      ...posts.map((a) => ({ url: `${base}/blog/${a.slug}`, lastModified: a.updatedAt })),
    ];
  } catch {
    return staticRoutes;
  }
}
