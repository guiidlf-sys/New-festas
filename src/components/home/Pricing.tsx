import Link from "next/link";
import { Users, Ruler, Percent } from "lucide-react";
import { siteContent } from "@/lib/content";
import { formatCents } from "@/lib/pricing";
import { Section } from "@/components/home/Section";

export function Pricing() {
  return (
    <Section id="tarifs" eyebrow="Tarifs" title="Une formule simple et transparente">
      <div className="grid gap-8 sm:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-8">
          <p className="font-serif text-4xl text-foreground">
            {formatCents(siteContent.pricing.perDayCents)}
            <span className="ml-2 text-base font-sans font-normal text-muted">/ jour</span>
          </p>
          <p className="mt-4 text-muted">{siteContent.pricing.note}</p>
          <Link
            href="/reserver"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Vérifier les disponibilités
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
            <Users className="h-6 w-6 text-accent" />
            <div>
              <p className="font-semibold text-foreground">
                {siteContent.capacity.seated} assis / {siteContent.capacity.standing} debout
              </p>
              <p className="text-sm text-muted">Capacité d&apos;accueil</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
            <Ruler className="h-6 w-6 text-accent" />
            <div>
              <p className="font-semibold text-foreground">{siteContent.surfaceM2} m²</p>
              <p className="text-sm text-muted">Surface totale</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
            <Percent className="h-6 w-6 text-accent" />
            <div>
              <p className="font-semibold text-foreground">
                {siteContent.pricing.depositPercent}% d&apos;acompte
              </p>
              <p className="text-sm text-muted">Pour confirmer la réservation</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
