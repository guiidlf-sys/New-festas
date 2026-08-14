import type { Metadata } from "next";
import { siteContent } from "@/lib/content";
import { BookingWidget } from "@/components/booking/BookingWidget";

export const metadata: Metadata = {
  title: `Réserver — ${siteContent.name}`,
  description: `Vérifiez les disponibilités et envoyez votre demande de réservation pour ${siteContent.name}.`,
};

export default function ReserverPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Réservation
        </p>
        <h1 className="font-serif text-4xl text-foreground">
          Vérifiez les disponibilités de {siteContent.shortName}
        </h1>
        <p className="mt-4 text-muted">
          Choisissez vos dates puis envoyez votre demande. Nous revenons vers vous rapidement
          pour confirmer et vous transmettre le lien de paiement de l&apos;acompte.
        </p>
      </div>
      <BookingWidget />
    </div>
  );
}
