import { prisma } from "@/lib/prisma";
import { ReservationsTable } from "@/components/admin/ReservationsTable";

export default async function AdminDashboardPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = reservations.filter((r) => r.status === "pending").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground">Demandes de réservation</h1>
        <p className="mt-1 text-muted">
          {pendingCount > 0
            ? `${pendingCount} demande${pendingCount > 1 ? "s" : ""} en attente de réponse.`
            : "Aucune demande en attente."}
        </p>
      </div>
      <ReservationsTable reservations={reservations} />
    </div>
  );
}
