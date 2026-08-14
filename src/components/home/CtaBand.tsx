import Link from "next/link";
import { siteContent } from "@/lib/content";

export function CtaBand() {
  return (
    <section className="bg-accent">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 text-accent-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl">Prêt·e à réserver {siteContent.shortName} ?</h2>
          <p className="mt-2 text-accent-foreground/85">
            Consultez le calendrier et envoyez votre demande en quelques minutes.
          </p>
        </div>
        <Link
          href="/reserver"
          className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-accent transition hover:bg-white/90"
        >
          Vérifier les disponibilités
        </Link>
      </div>
    </section>
  );
}
