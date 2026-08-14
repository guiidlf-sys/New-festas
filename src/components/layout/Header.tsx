import Link from "next/link";
import { siteContent } from "@/lib/content";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-foreground"
        >
          {siteContent.shortName}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 sm:flex">
          <Link href="/#galerie" className="hover:text-accent">
            Galerie
          </Link>
          <Link href="/#equipements" className="hover:text-accent">
            Équipements
          </Link>
          <Link href="/#tarifs" className="hover:text-accent">
            Tarifs
          </Link>
          <Link href="/#contact" className="hover:text-accent">
            Contact
          </Link>
        </nav>
        <Link
          href="/reserver"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:opacity-90"
        >
          Vérifier les disponibilités
        </Link>
      </div>
    </header>
  );
}
