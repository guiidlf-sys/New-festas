import { z } from "zod";
import { siteContent } from "@/lib/content";

export const reservationFieldsSchema = z.object({
  fullName: z.string().trim().min(2, "Indiquez votre nom complet."),
  email: z.email("Adresse email invalide."),
  phone: z.string().trim().min(6, "Numéro de téléphone invalide."),
  guests: z
    .number()
    .int()
    .min(1, "Au moins 1 invité.")
    .max(
      siteContent.capacity.standing,
      `Capacité maximale : ${siteContent.capacity.standing} personnes.`,
    ),
  eventType: z.string().trim().min(1, "Sélectionnez un type d'événement."),
  message: z.string().trim().max(2000).optional(),
});

export type ReservationFieldsInput = z.infer<typeof reservationFieldsSchema>;

export const reservationRequestSchema = reservationFieldsSchema
  .extend({
    startDate: z.iso.date("Date de début invalide."),
    endDate: z.iso.date("Date de fin invalide."),
  })
  .refine((data) => data.endDate >= data.startDate, {
    error: "La date de fin doit être après la date de début.",
    path: ["endDate"],
  });

export type ReservationRequestInput = z.infer<typeof reservationRequestSchema>;
