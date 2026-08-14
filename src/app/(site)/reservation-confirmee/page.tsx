import Link from "next/link";
import { siteContent } from "@/lib/content";

export default function ReservationConfirmeePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-4xl text-foreground">Paiement reçu, merci !</h1>
      <p className="mt-4 text-muted">
        Votre acompte a bien été réglé. Votre réservation pour {siteContent.name} est confirmée.
        Vous recevrez un email de confirmation sous peu.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
