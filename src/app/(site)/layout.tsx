import type { ReactNode } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getLang } from "@/lib/lang";
import { getSettings, listNeighborhoods } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const lang = await getLang();
  let settings = await getSettings();
  let hoods: { name: string; slug: string }[] = [];
  try {
    hoods = (await listNeighborhoods()).map((n) => ({ name: n.name, slug: n.slug }));
  } catch {
    hoods = [];
  }
  settings = settings ?? (await getSettings());

  return (
    <div className="flex min-h-screen flex-col bg-warm">
      <Header lang={lang} agencyName={settings.agencyName} whatsapp={settings.whatsapp} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} settings={settings} neighborhoods={hoods} />
    </div>
  );
}
