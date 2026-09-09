"use client";

import { useCallback, useEffect, useState } from "react";

const FAV_KEY = "mk_favorites";
const CMP_KEY = "mk_compare";

function read(key: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function write(key: string, ids: number[]) {
  window.localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("mk-store-change", { detail: { key } }));
}

function useStore(key: string, max?: number) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    setIds(read(key));
    const handler = () => setIds(read(key));
    window.addEventListener("mk-store-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("mk-store-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [key]);

  const toggle = useCallback(
    (id: number) => {
      const current = read(key);
      let next: number[];
      if (current.includes(id)) next = current.filter((x) => x !== id);
      else next = max ? [...current, id].slice(-max) : [...current, id];
      write(key, next);
      setIds(next);
    },
    [key, max],
  );

  const remove = useCallback(
    (id: number) => {
      const next = read(key).filter((x) => x !== id);
      write(key, next);
      setIds(next);
    },
    [key],
  );

  const clear = useCallback(() => {
    write(key, []);
    setIds([]);
  }, [key]);

  return { ids, toggle, remove, clear };
}

export function useFavorites() {
  return useStore(FAV_KEY);
}

export function useCompare() {
  return useStore(CMP_KEY, 3);
}
