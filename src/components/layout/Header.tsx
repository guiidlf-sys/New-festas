import Link from "next/link";
import { siteContent } from "@/lib/content";

export function Header() {
  return (
    <header className="sticky top-4 z-40 px-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-border bg-card-strong px-5 py-3 backdrop-blur-xl">
        <Link href="/" className="font-serif text-lg tracking-tight text-foreground">
          {siteContent.shortName}
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/75 sm:flex">
          <Link href="/#galerie" className="transition hover:text-foreground">
            Galerie
          </Link>
          <Link href="/#equipements" className="transition hover:text-foreground">
            Équipements
          </Link>
          <Link href="/#tarifs" className="transition hover:text-foreground">
            Tarifs
          </Link>
          <Link href="/#contact" className="transition hover:text-foreground">
            Contact
          </Link>
        </nav>
        <Link
          href="/reserver"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-[0_0_20px_-4px_var(--accent)] transition hover:opacity-90 sm:px-5 sm:py-2.5"
        >
          Vérifier les disponibilités
        </Link>
      </div>
    </header>
  );
}
