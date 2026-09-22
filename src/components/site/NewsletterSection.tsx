import Reveal from "@/components/Reveal";
import NewsletterForm from "./NewsletterForm";
import type { Lang } from "@/lib/i18n";

export default function NewsletterSection({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
      <section className="bg-page px-5 py-24 md:px-10 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="label-xs text-accent">Newsletter</p>
          <h2 className="display mt-5 text-[34px] sm:text-[46px]">
            {en ? "The latest listings, before everyone else." : "Les nouveautés, avant tout le monde."}
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-secondary">
            {en
              ? "Receive newly added properties directly in your inbox."
              : "Recevez les biens récemment ajoutés directement dans votre boîte mail."}
          </p>
          <div className="mx-auto mt-10 max-w-2xl text-left">
            <NewsletterForm lang={lang} />
          </div>
        </Reveal>
      </section>
  );
}
