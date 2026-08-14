import { Check } from "lucide-react";
import { siteContent } from "@/lib/content";
import { Section } from "@/components/home/Section";

export function Amenities() {
  return (
    <Section
      id="equipements"
      eyebrow="Équipements"
      title="Tout est déjà en place"
      description={siteContent.description}
      bgClassName="bg-card"
    >
      <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {siteContent.amenities.map((item) => (
          <li key={item} className="flex items-start gap-3 text-foreground">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
