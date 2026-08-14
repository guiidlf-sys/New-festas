import Link from "next/link";
import { siteContent } from "@/lib/content";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-2 to-accent px-8 py-14 text-center shadow-[0_0_90px_-20px_var(--accent)] sm:px-16">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-white/10 blur-[100px]" />
        <h2 className="font-serif text-3xl text-white sm:text-4xl">
          Prêt·e à réserver {siteContent.shortName} ?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/85">
          Consultez le calendrier et envoyez votre demande en quelques minutes.
        </p>
        <Link
          href="/reserver"
          className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-accent transition hover:bg-white/90"
        >
          Vérifier les disponibilités
        </Link>
      </div>
    </section>
  );
}
