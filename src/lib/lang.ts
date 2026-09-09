import { cookies } from "next/headers";
import type { Lang } from "./i18n";

export const LANG_COOKIE = "lang";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return value === "en" ? "en" : "fr";
}
