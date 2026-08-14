import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  bgClassName = "",
  align = "center",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  bgClassName?: string;
  align?: "center" | "left";
}) {
  const isCentered = align === "center";
  return (
    <section id={id} className={`relative ${bgClassName}`}>
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className={`mb-14 flex flex-col ${isCentered ? "items-center text-center mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {eyebrow && <span className="pill-badge mb-4">{eyebrow}</span>}
          <h2 className="font-serif text-3xl text-foreground sm:text-4xl">{title}</h2>
          {description && <p className="mt-4 text-muted">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
