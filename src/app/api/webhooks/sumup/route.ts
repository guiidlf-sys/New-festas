import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCheckout } from "@/lib/sumup";

/**
 * SumUp envoie uniquement { event_type, id } — sans garantie d'authenticité.
 * On revérifie donc toujours le statut réel auprès de l'API SumUp avant
 * de mettre à jour la réservation (comportement recommandé par SumUp).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const checkoutId = body?.id;

  if (typeof checkoutId !== "string") {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  try {
    const checkout = await getCheckout(checkoutId);

    if (checkout.status === "PAID") {
      await prisma.reservation.updateMany({
        where: { paymentCheckoutId: checkoutId },
        data: { status: "paid", paidAt: new Date() },
      });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du checkout SumUp :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
