"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

export type GalleryImage = { id: number; imageUrl: string; altText: string | null };

export default function PropertyGallery({
  images,
  title,
  lang,
}: {
  images: GalleryImage[];
  title: string;
  lang: Lang;
}) {
  const en = lang === "en";
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % Math.max(images.length, 1)), [images.length]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1)),
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev]);

  if (!images.length) {
    return <div className="h-[50vh] w-full bg-stone" />;
  }

  const main = images[0];
  const rest = images.slice(1, 5);

  return (
    <>
      <div className="grid gap-2 lg:grid-cols-[65%_35%]">
        <button
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="group relative block h-[46vh] w-full overflow-hidden bg-stone lg:h-[68vh]"
        >
          <Image
            src={main.imageUrl}
            alt={main.altText ?? title}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 65vw"
            className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]"
          />
        </button>
        <div className="hidden grid-cols-2 gap-2 lg:grid">
          {rest.map((img, i) => (
            <button
              key={img.id}
              onClick={() => {
                setIndex(i + 1);
                setOpen(true);
              }}
              className="group relative block h-[calc(34vh-4px)] w-full overflow-hidden bg-stone"
            >
              <Image
                src={img.imageUrl}
                alt={img.altText ?? title}
                fill
                sizes="20vw"
                className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="label-xs border border-charcoal px-6 py-3 transition-colors hover:bg-charcoal hover:text-white"
        >
          {en ? `View all ${images.length} photos` : `Voir les ${images.length} photos`}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-charcoal/98">
          <div className="flex items-center justify-between px-5 py-5 text-white md:px-10">
            <span className="label-xs">
              {index + 1} / {images.length}
            </span>
            <button onClick={() => setOpen(false)} aria-label="close">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M5 5l14 14M19 5 5 19" />
              </svg>
            </button>
          </div>
          <div className="relative flex-1">
            <Image
              src={images[index].imageUrl}
              alt={images[index].altText ?? title}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <button
              onClick={prev}
              aria-label="previous"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white backdrop-blur hover:bg-white/20 md:left-8"
            >
              ←
            </button>
            <button
              onClick={next}
              aria-label="next"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white backdrop-blur hover:bg-white/20 md:right-8"
            >
              →
            </button>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-5 md:px-10">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setIndex(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden transition-opacity ${
                  i === index ? "opacity-100 ring-1 ring-champagne" : "opacity-45 hover:opacity-80"
                }`}
              >
                <Image src={img.imageUrl} alt="" fill sizes="100px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
