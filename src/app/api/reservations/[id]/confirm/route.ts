import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { computeDepositCents } from "@/lib/pricing";
import { siteContent } from "@/lib/content";
import { createDepositCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import { sendPaymentLinkToClient } from "@/lib/resend";

export async function POST(_request: Request, context: RouteContext<"/api/reservations/[id]/confirm">) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  const depositCents = computeDepositCents(reservation.totalPriceCents);

  if (!isStripeConfigured()) {
    const updated = await prisma.reservation.update({
      where: { id },
      data: { status: "confirmed", depositCents },
    });
    return NextResponse.json({
      reservation: updated,
      warning:
        "Stripe n'est pas configuré : la réservation est confirmée mais aucun lien de paiement n'a été généré.",
    });
  }

  const checkoutSession = await createDepositCheckoutSession({
    reservationId: reservation.id,
    fullName: reservation.fullName,
    amountCents: depositCents,
    currency: siteContent.pricing.currency,
    description: `Acompte pour la location du ${reservation.startDate.toLocaleDateString("fr-FR")} au ${reservation.endDate.toLocaleDateString("fr-FR")}`,
  });

  const updated = await prisma.reservation.update({
    where: { id },
    data: {
      status: "confirmed",
      depositCents,
      stripeSessionId: checkoutSession.id,
      stripePaymentUrl: checkoutSession.url,
    },
  });

  if (checkoutSession.url) {
    await sendPaymentLinkToClient(updated, checkoutSession.url, depositCents).catch((error) => {
      console.error("Erreur lors de l'envoi du lien de paiement :", error);
    });
  }

  return NextResponse.json({ reservation: updated });
}
