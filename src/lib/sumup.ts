const SUMUP_API_BASE = "https://api.sumup.com";

export function isSumUpConfigured() {
  return Boolean(process.env.SUMUP_API_KEY && process.env.SUMUP_MERCHANT_CODE);
}

function getConfig() {
  const apiKey = process.env.SUMUP_API_KEY;
  const merchantCode = process.env.SUMUP_MERCHANT_CODE;
  if (!apiKey || !merchantCode) {
    throw new Error(
      "SUMUP_API_KEY / SUMUP_MERCHANT_CODE ne sont pas configurés. Ajoutez vos identifiants SumUp dans .env pour activer le paiement en ligne.",
    );
  }
  return { apiKey, merchantCode };
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

async function sumupFetch(path: string, init: RequestInit) {
  const { apiKey } = getConfig();
  const res = await fetch(`${SUMUP_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Erreur SumUp (${res.status}) : ${body}`);
  }

  return res.json();
}

export type SumUpCheckout = {
  id: string;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  checkout_reference: string;
  hosted_checkout_url?: string;
};

/** Crée un lien de paiement hébergé par SumUp pour l'acompte d'une réservation. */
export async function createDepositCheckout({
  reservationId,
  amountCents,
  currency,
  description,
}: {
  reservationId: string;
  amountCents: number;
  currency: string;
  description: string;
}): Promise<SumUpCheckout> {
  const { merchantCode } = getConfig();
  const appUrl = getAppUrl();

  const checkout = await sumupFetch("/v0.1/checkouts", {
    method: "POST",
    body: JSON.stringify({
      checkout_reference: reservationId,
      amount: Math.round(amountCents) / 100,
      currency: currency.toUpperCase(),
      merchant_code: merchantCode,
      description,
      redirect_url: `${appUrl}/reservation-confirmee?reservation=${reservationId}`,
      return_url: `${appUrl}/api/webhooks/sumup`,
      hosted_checkout: { enabled: true },
    }),
  });

  return checkout as SumUpCheckout;
}

/** Récupère le statut à jour d'un checkout directement auprès de l'API SumUp. */
export async function getCheckout(checkoutId: string): Promise<SumUpCheckout> {
  const checkout = await sumupFetch(`/v0.1/checkouts/${checkoutId}`, { method: "GET" });
  return checkout as SumUpCheckout;
}
