import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { siteContent } from "@/lib/content";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminDashboardLayout({ children }: LayoutProps<"/admin">) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card-strong backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-serif text-lg text-foreground">{siteContent.shortName}</p>
            <p className="text-xs text-muted">Espace propriétaire — {session.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted hover:text-accent">
              Voir le site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
