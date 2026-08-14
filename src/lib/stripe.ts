import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY n'est pas configuré. Ajoutez votre clé Stripe dans .env pour activer le paiement en ligne.",
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function createDepositCheckoutSession({
  reservationId,
  fullName,
  amountCents,
  currency,
  description,
}: {
  reservationId: string;
  fullName: string;
  amountCents: number;
  currency: string;
  description: string;
}) {
  const stripe = getStripe();
  const appUrl = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: amountCents,
          product_data: {
            name: `Acompte réservation — ${fullName}`,
            description,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { reservationId },
    success_url: `${appUrl}/reservation-confirmee?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/reserver`,
  });

  return session;
}
