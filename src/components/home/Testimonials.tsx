import { siteContent } from "@/lib/content";
import { Section } from "@/components/home/Section";

export function Testimonials() {
  return (
    <Section eyebrow="Avis" title="Ce qu'en disent nos clients" bgClassName="bg-card">
      <div className="grid gap-6 sm:grid-cols-2">
        {siteContent.testimonials.map((t) => (
          <figure
            key={t.author}
            className="rounded-3xl border border-border bg-background p-8"
          >
            <blockquote className="font-serif text-lg leading-relaxed text-foreground">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted">
              <span className="font-semibold text-foreground">{t.author}</span> — {t.event}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
