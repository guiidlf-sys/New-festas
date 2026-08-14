import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  bgClassName = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  bgClassName?: string;
}) {
  return (
    <section id={id} className={bgClassName}>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
          )}
          <h2 className="font-serif text-3xl text-foreground sm:text-4xl">{title}</h2>
          {description && <p className="mt-4 text-muted">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
