import type { ReactNode } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getLang } from "@/lib/lang";
import { DEFAULT_AGENCY_SETTINGS, getSettings, listNeighborhoods } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const lang = await getLang();
  const [settings, hoods] = await Promise.all([
    loadPublicData(() => getSettings(), DEFAULT_AGENCY_SETTINGS),
    loadPublicData(() => listNeighborhoods(), []).then((items) =>
      items.map((n) => ({ name: n.name, slug: n.slug })),
    ),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-warm">
      <Header lang={lang} agencyName={settings.agencyName} whatsapp={settings.whatsapp} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} settings={settings} neighborhoods={hoods} />
    </div>
  );
}
