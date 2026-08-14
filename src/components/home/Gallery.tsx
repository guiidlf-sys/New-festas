import Image from "next/image";
import { siteContent } from "@/lib/content";
import { Section } from "@/components/home/Section";

export function Gallery() {
  return (
    <Section
      id="galerie"
      eyebrow="Galerie"
      title="Un lieu qui se prête à tous vos événements"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {siteContent.gallery.map((photo) => (
          <div
            key={photo.src}
            className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-accent-soft"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition duration-500 hover:scale-105"
              sizes="(min-width: 640px) 25vw, 50vw"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
