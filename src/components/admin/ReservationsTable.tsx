"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCents } from "@/lib/pricing";
import type { ReservationModel } from "@/generated/prisma/models";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  paid: "Payée",
  cancelled: "Annulée",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-zinc-200 text-zinc-600",
};

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "pending", label: "En attente" },
  { key: "confirmed", label: "Confirmées" },
  { key: "paid", label: "Payées" },
  { key: "cancelled", label: "Annulées" },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date));
}

export function ReservationsTable({ reservations }: { reservations: ReservationModel[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [errorFor, setErrorFor] = useState<{ id: string; message: string } | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? reservations : reservations.filter((r) => r.status === filter)),
    [reservations, filter],
  );

  async function runAction(id: string, action: "confirm" | "cancel" | "mark-paid") {
    setPendingAction(id + action);
    setErrorFor(null);
    try {
      const res = await fetch(`/api/reservations/${id}/${action}`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorFor({ id, message: data?.error || "Une erreur est survenue." });
        return;
      }
      router.refresh();
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f.key
                ? "bg-accent text-accent-foreground"
                : "bg-card text-muted hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted">
          Aucune réservation dans cette catégorie.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-foreground">{r.fullName}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}
                    >
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(r.startDate)} → {formatDate(r.endDate)} · {r.guests} invités ·{" "}
                    {r.eventType}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {r.email} · {r.phone}
                  </p>
                  {r.message && <p className="mt-2 text-sm text-foreground/80">« {r.message} »</p>}
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatCents(r.totalPriceCents)}
                    {r.depositCents ? ` · Acompte ${formatCents(r.depositCents)}` : ""}
                  </p>
                  {r.stripePaymentUrl && (
                    <a
                      href={r.stripePaymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-accent hover:underline"
                    >
                      Lien de paiement →
                    </a>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  {r.status === "pending" && (
                    <>
                      <button
                        onClick={() => runAction(r.id, "confirm")}
                        disabled={pendingAction === r.id + "confirm"}
                        className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60"
                      >
                        {pendingAction === r.id + "confirm" ? "…" : "Confirmer"}
                      </button>
                      <button
                        onClick={() => runAction(r.id, "cancel")}
                        disabled={pendingAction === r.id + "cancel"}
                        className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-background disabled:opacity-60"
                      >
                        Refuser
                      </button>
                    </>
                  )}
                  {r.status === "confirmed" && (
                    <button
                      onClick={() => runAction(r.id, "mark-paid")}
                      disabled={pendingAction === r.id + "mark-paid"}
                      className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-background disabled:opacity-60"
                    >
                      Marquer payée
                    </button>
                  )}
                </div>
              </div>
              {errorFor && errorFor.id === r.id && (
                <p className="mt-3 text-sm text-red-600">{errorFor.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
