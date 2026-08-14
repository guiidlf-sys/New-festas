import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/lib/content";
import { capacityLabel } from "@/lib/pricing";
import { Glow } from "@/components/ui/Glow";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28">
      <Glow variant="hero" />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <span className="pill-badge">{siteContent.city}</span>
        <h1 className="mt-6 font-serif text-4xl leading-tight text-foreground sm:text-6xl">
          {siteContent.tagline}
        </h1>
        <p className="mt-6 max-w-xl text-balance text-muted">
          {capacityLabel()} · {siteContent.surfaceM2} m². Un lieu clé en main pour vos
          mariages, anniversaires et événements d&apos;entreprise.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/reserver"
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_0_30px_-6px_var(--accent)] transition hover:opacity-90"
          >
            Vérifier les disponibilités →
          </Link>
          <Link
            href="#galerie"
            className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition hover:bg-white/5"
          >
            Voir la galerie
          </Link>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl px-6">
        <div className="glass-card overflow-hidden p-3 shadow-[0_0_80px_-20px_var(--accent)] sm:p-4">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={siteContent.gallery[0].src}
              alt={siteContent.gallery[0].alt}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
