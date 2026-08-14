import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={siteContent.gallery[0].src}
          alt={siteContent.gallery[0].alt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-start px-6 py-32 text-white sm:py-44">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          {siteContent.city}
        </p>
        <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">
          {siteContent.tagline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/90">
          {siteContent.capacity.seated} personnes assises · {siteContent.capacity.standing}{" "}
          en cocktail · {siteContent.surfaceM2} m²
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/reserver"
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg transition hover:opacity-90"
          >
            Vérifier les disponibilités
          </Link>
          <Link
            href="#galerie"
            className="rounded-full border border-white/70 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Voir la galerie
          </Link>
        </div>
      </div>
    </section>
  );
}
