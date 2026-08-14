import Link from "next/link";
import { siteContent } from "@/lib/content";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-card backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg text-foreground">{siteContent.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">{siteContent.tagline}</p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-semibold text-foreground">Adresse</p>
          <p className="mt-2">{siteContent.address}</p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-semibold text-foreground">Contact</p>
          <p className="mt-2">
            <a
              className="hover:text-accent"
              href={`mailto:${siteContent.contact.email}`}
            >
              {siteContent.contact.email}
            </a>
          </p>
          <p>
            <a
              className="hover:text-accent"
              href={`tel:${siteContent.contact.phone.replace(/\s+/g, "")}`}
            >
              {siteContent.contact.phone}
            </a>
          </p>
          <Link
            href="/reserver"
            className="mt-3 inline-block font-semibold text-accent hover:underline"
          >
            Demander une réservation →
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-6 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {siteContent.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
