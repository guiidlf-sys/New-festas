import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Permet de marquer manuellement une réservation comme payée (virement, espèces…). */
export async function POST(_request: Request, context: RouteContext<"/api/reservations/[id]/mark-paid">) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status: "paid", paidAt: new Date() },
  });

  return NextResponse.json({ reservation });
}
