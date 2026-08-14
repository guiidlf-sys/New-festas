import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reservationRequestSchema } from "@/lib/validation";
import { computeTotalCents } from "@/lib/pricing";
import { notifyOwnerOfNewReservation, sendClientRequestReceived } from "@/lib/resend";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = reservationRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Formulaire invalide.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const startDate = new Date(`${data.startDate}T00:00:00.000Z`);
  const endDate = new Date(`${data.endDate}T00:00:00.000Z`);

  const overlapping = await prisma.reservation.findFirst({
    where: {
      status: { in: ["pending", "confirmed", "paid"] },
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
  });

  if (overlapping) {
    return NextResponse.json(
      { error: "Ces dates ne sont plus disponibles. Merci d'en choisir d'autres." },
      { status: 409 },
    );
  }

  const totalPriceCents = computeTotalCents(startDate, endDate);

  const reservation = await prisma.reservation.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      guests: data.guests,
      eventType: data.eventType,
      startDate,
      endDate,
      message: data.message || null,
      totalPriceCents,
    },
  });

  await Promise.all([
    notifyOwnerOfNewReservation(reservation),
    sendClientRequestReceived(reservation),
  ]).catch((error) => {
    console.error("Erreur lors de l'envoi des emails de réservation :", error);
  });

  return NextResponse.json({ id: reservation.id }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reservations });
}
