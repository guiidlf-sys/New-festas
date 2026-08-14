import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Périodes déjà bloquées (demandes en attente, confirmées ou payées).
 * Utilisé par le calendrier public pour griser les dates indisponibles.
 */
export async function GET() {
  const reservations = await prisma.reservation.findMany({
    where: { status: { in: ["pending", "confirmed", "paid"] } },
    select: { startDate: true, endDate: true },
  });

  return NextResponse.json({
    busyRanges: reservations.map((r) => ({
      from: r.startDate.toISOString(),
      to: r.endDate.toISOString(),
    })),
  });
}
