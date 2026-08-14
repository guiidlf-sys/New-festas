import { siteContent } from "@/lib/content";

export function capacityLabel(): string {
  const { seated, standing } = siteContent.capacity;
  return seated === standing
    ? `Jusqu'à ${seated} personnes`
    : `${seated} personnes assises · ${standing} en cocktail`;
}

/** Nombre de jours facturés entre deux dates (inclusif, minimum 1). */
export function countDays(startDate: Date, endDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.round((endDate.getTime() - startDate.getTime()) / msPerDay) + 1;
  return Math.max(1, days);
}

export function computeTotalCents(startDate: Date, endDate: Date): number {
  return countDays(startDate, endDate) * siteContent.pricing.perDayCents;
}

export function computeDepositCents(totalCents: number): number {
  return Math.round((totalCents * siteContent.pricing.depositPercent) / 100);
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: siteContent.pricing.currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
