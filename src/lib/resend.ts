import { Resend } from "resend";
import { siteContent } from "@/lib/content";
import { formatCents } from "@/lib/pricing";

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date);
}

type ReservationSummary = {
  fullName: string;
  email: string;
  phone: string;
  guests: number;
  eventType: string;
  startDate: Date;
  endDate: Date;
  message?: string | null;
  totalPriceCents: number;
};

export async function notifyOwnerOfNewReservation(reservation: ReservationSummary) {
  const client = getClient();
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!client || !ownerEmail) {
    console.warn(
      "[resend] RESEND_API_KEY ou OWNER_EMAIL manquant : email de notification non envoyé.",
    );
    return;
  }

  await client.emails.send({
    from: getFrom(),
    to: ownerEmail,
    replyTo: reservation.email,
    subject: `Nouvelle demande de réservation — ${reservation.fullName}`,
    html: `
      <h2>Nouvelle demande de réservation</h2>
      <p><strong>${reservation.fullName}</strong> (${reservation.eventType}) souhaite réserver
      ${siteContent.name} du ${formatDate(reservation.startDate)} au ${formatDate(reservation.endDate)}.</p>
      <ul>
        <li>Email : ${reservation.email}</li>
        <li>Téléphone : ${reservation.phone}</li>
        <li>Invités : ${reservation.guests}</li>
        <li>Montant estimé : ${formatCents(reservation.totalPriceCents)}</li>
      </ul>
      ${reservation.message ? `<p><strong>Message :</strong> ${reservation.message}</p>` : ""}
      <p>Connectez-vous à votre espace admin pour confirmer ou refuser cette demande.</p>
    `,
  });
}

export async function sendClientRequestReceived(reservation: ReservationSummary) {
  const client = getClient();
  if (!client) return;

  await client.emails.send({
    from: getFrom(),
    to: reservation.email,
    subject: `Votre demande de réservation — ${siteContent.name}`,
    html: `
      <h2>Merci ${reservation.fullName} !</h2>
      <p>Nous avons bien reçu votre demande de réservation pour ${siteContent.name}
      du ${formatDate(reservation.startDate)} au ${formatDate(reservation.endDate)}.</p>
      <p>Montant estimé : ${formatCents(reservation.totalPriceCents)}.</p>
      <p>Nous revenons vers vous très prochainement pour confirmer la disponibilité
      et vous transmettre le lien de paiement de l'acompte.</p>
    `,
  });
}

export async function sendPaymentLinkToClient(
  reservation: ReservationSummary,
  paymentUrl: string,
  depositCents: number,
) {
  const client = getClient();
  if (!client) {
    console.warn(
      "[resend] RESEND_API_KEY manquant : email avec le lien de paiement non envoyé.",
    );
    return;
  }

  await client.emails.send({
    from: getFrom(),
    to: reservation.email,
    subject: `Votre réservation est confirmée — ${siteContent.name}`,
    html: `
      <h2>Bonne nouvelle, ${reservation.fullName} !</h2>
      <p>Votre réservation pour ${siteContent.name} du ${formatDate(reservation.startDate)}
      au ${formatDate(reservation.endDate)} est confirmée sous réserve du règlement de l'acompte.</p>
      <p>Acompte à régler : <strong>${formatCents(depositCents)}</strong></p>
      <p><a href="${paymentUrl}">Cliquez ici pour régler l'acompte en ligne</a></p>
    `,
  });
}
