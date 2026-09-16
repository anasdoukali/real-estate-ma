import { PROPERTY_TYPES } from "@/lib/site";

export function parseServiceRequest(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  const str = (key: string, max: number) => typeof b[key] === "string" ? (b[key] as string).trim().slice(0, max) : "";
  const service = str("service", 40);
  const transaction = str("transaction", 20);
  const propertyType = str("propertyType", 40);
  const neighborhood = str("neighborhood", 160);
  const name = str("name", 160);
  const email = str("email", 190);
  const phone = str("phone", 60);
  const budgetText = str("budget", 30);
  const budget = Number(budgetText);
  if (!["home-staging", "confier"].includes(service) || !["sale", "rent"].includes(transaction)
    || !PROPERTY_TYPES.some(t => t.value === propertyType) || !neighborhood || !name
    || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone
    || !budgetText || !Number.isFinite(budget) || budget <= 0 || budget > 1e12) return null;
  const type = PROPERTY_TYPES.find(t => t.value === propertyType)!;
  return {
    name, email, phone, source: service, intent: service === "home-staging" ? "home-staging" : transaction === "sale" ? "vendre" : "louer",
    message: [
      `Service : ${service === "home-staging" ? "Home Staging" : "Confiez-nous votre bien"}`,
      `Projet : ${transaction === "sale" ? "Vente" : "Location"}`,
      `Type de bien : ${type.fr}`, `Quartier : ${neighborhood}`,
      `${service === "home-staging" ? "Budget Home Staging" : "Prix souhaité"} : ${budget.toLocaleString("fr-FR")} MAD${service === "confier" && transaction === "rent" ? " / mois" : ""}`,
      str("message", 5000),
    ].filter(Boolean).join("\n"),
  };
}
