import { ChefHat, Volume2, Trees, ShieldCheck, Check } from "lucide-react";
import { siteContent } from "@/lib/content";
import { Section } from "@/components/home/Section";

const featureCards = [
  {
    icon: ChefHat,
    title: "Cuisine équipée",
    description:
      "Four, plaques et réfrigérateur sur place pour votre traiteur ou votre équipe.",
  },
  {
    icon: Volume2,
    title: "Son & lumière",
    description: "Sonorisation et éclairage d'ambiance déjà installés, prêts à l'emploi.",
  },
  {
    icon: Trees,
    title: "Espace extérieur",
    description: "Une terrasse privative pour prolonger votre événement à l'air libre.",
  },
  {
    icon: ShieldCheck,
    title: "Accès & confort",
    description: "Parking gratuit, accès PMR, wifi et climatisation inclus.",
  },
];

export function Amenities() {
  return (
    <Section
      id="equipements"
      eyebrow="Équipements"
      title="Tout est déjà en place"
      description={siteContent.description}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {featureCards.map(({ icon: Icon, title, description }) => (
          <div key={title} className="glass-card p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </div>
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap justify-center gap-3">
        {siteContent.amenities.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-2 text-sm text-foreground/80"
          >
            <Check className="h-4 w-4 shrink-0 text-accent" />
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}
