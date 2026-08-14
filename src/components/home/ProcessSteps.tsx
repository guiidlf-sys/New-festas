import { CalendarSearch, Send, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/home/Section";

const steps = [
  {
    icon: CalendarSearch,
    title: "Choisissez vos dates",
    description: "Consultez le calendrier en temps réel et sélectionnez votre période.",
  },
  {
    icon: Send,
    title: "Envoyez votre demande",
    description: "Un court formulaire suffit : vos coordonnées et le type d'événement.",
  },
  {
    icon: CheckCircle2,
    title: "Confirmez & payez l'acompte",
    description: "Dès validation, réglez l'acompte en ligne en toute sécurité.",
  },
];

export function ProcessSteps() {
  return (
    <Section
      eyebrow="Comment ça marche"
      title="Réservez votre salle en 3 étapes"
      description="Un processus simple, du premier clic à la confirmation."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }, i) => (
          <div key={title} className="glass-card p-7">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-serif text-3xl text-foreground/15">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
