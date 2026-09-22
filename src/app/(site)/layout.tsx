import type { ReactNode } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import NewsletterSection from "@/components/site/NewsletterSection";
import { getLang } from "@/lib/lang";
import { DEFAULT_AGENCY_SETTINGS, getSettings, listNeighborhoods } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";
import { getMaintenance } from "@/lib/maintenance";
import MaintenanceScreen from "@/components/site/MaintenanceScreen";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const lang = await getLang();
  const [settings, hoods, maintenance] = await Promise.all([
    loadPublicData(() => getSettings(), DEFAULT_AGENCY_SETTINGS),
    loadPublicData(() => listNeighborhoods(), []).then((items) =>
      items.map((n) => ({ name: n.name, slug: n.slug })),
    ),
    loadPublicData(getMaintenance, { enabled: false, description: "" }),
  ]);

  if (maintenance.enabled) return <MaintenanceScreen agency={settings} description={maintenance.description} />;

  return (
    <div className="site-layout flex min-h-screen flex-col bg-page">
      <Header lang={lang} agencyName={settings.agencyName} whatsapp={settings.whatsapp} />
      <main className="flex-1">{children}</main>
      <NewsletterSection lang={lang} />
      <Footer lang={lang} settings={settings} neighborhoods={hoods} />
    </div>
  );
}
