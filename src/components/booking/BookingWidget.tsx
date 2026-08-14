"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { siteContent } from "@/lib/content";
import { computeDepositCents, computeTotalCents, countDays, formatCents } from "@/lib/pricing";
import { reservationFieldsSchema, type ReservationFieldsInput } from "@/lib/validation";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

export function BookingWidget() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [busyRanges, setBusyRanges] = useState<{ from: Date; to: Date }[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  useEffect(() => {
    fetch("/api/availability")
      .then((res) => res.json())
      .then((data: { busyRanges: { from: string; to: string }[] }) => {
        setBusyRanges(
          data.busyRanges.map((r) => ({ from: new Date(r.from), to: new Date(r.to) })),
        );
      })
      .catch(() => {
        // Le calendrier reste utilisable même si la vérification échoue silencieusement ;
        // le serveur revalide la disponibilité à la soumission du formulaire.
      });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFieldsInput>({
    resolver: zodResolver(reservationFieldsSchema),
    defaultValues: { guests: siteContent.capacity.seated },
  });

  const pricing = useMemo(() => {
    if (!range?.from || !range?.to) return null;
    const total = computeTotalCents(range.from, range.to);
    return {
      days: countDays(range.from, range.to),
      total,
      deposit: computeDepositCents(total),
    };
  }, [range]);

  const onSubmit = async (fields: ReservationFieldsInput) => {
    if (!range?.from || !range?.to) {
      setSubmitState({ status: "error", message: "Sélectionnez une période sur le calendrier." });
      return;
    }

    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          startDate: format(range.from, "yyyy-MM-dd"),
          endDate: format(range.to, "yyyy-MM-dd"),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setSubmitState({
          status: "error",
          message: data?.error || "Une erreur est survenue. Merci de réessayer.",
        });
        return;
      }

      setSubmitState({ status: "success" });
      reset();
      setRange(undefined);
    } catch {
      setSubmitState({ status: "error", message: "Une erreur est survenue. Merci de réessayer." });
    }
  };

  if (submitState.status === "success") {
    return (
      <div className="glass-card p-10 text-center">
        <h3 className="font-serif text-2xl text-foreground">Demande envoyée !</h3>
        <p className="mt-3 text-muted">
          Merci, votre demande a bien été transmise. Vous recevrez une confirmation par email
          avec le lien de paiement dès qu&apos;elle sera validée.
        </p>
        <button
          onClick={() => setSubmitState({ status: "idle" })}
          className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90"
        >
          Faire une nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <AvailabilityCalendar
        selected={range}
        onSelect={setRange}
        busyRanges={busyRanges}
        disabled={submitState.status === "submitting"}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass-card flex flex-col gap-4 p-6"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">Période sélectionnée</p>
          {pricing ? (
            <div className="mt-1 text-sm text-muted">
              <p>
                Du {range?.from && format(range.from, "dd/MM/yyyy")} au{" "}
                {range?.to && format(range.to, "dd/MM/yyyy")} ({pricing.days} jour
                {pricing.days > 1 ? "s" : ""})
              </p>
              <p className="mt-1 font-semibold text-foreground">
                Total estimé : {formatCents(pricing.total)} · Acompte :{" "}
                {formatCents(pricing.deposit)}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted">
              Sélectionnez une date de début et de fin sur le calendrier.
            </p>
          )}
        </div>

        <Field label="Nom complet" error={errors.fullName?.message}>
          <input className="input" {...register("fullName")} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" error={errors.email?.message}>
            <input type="email" className="input" {...register("email")} />
          </Field>
          <Field label="Téléphone" error={errors.phone?.message}>
            <input type="tel" className="input" {...register("phone")} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre d'invités" error={errors.guests?.message}>
            <input
              type="number"
              min={1}
              className="input"
              {...register("guests", { valueAsNumber: true })}
            />
          </Field>
          <Field label="Type d'événement" error={errors.eventType?.message}>
            <select className="input" {...register("eventType")}>
              <option value="">Choisir…</option>
              {siteContent.eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Message (optionnel)" error={errors.message?.message}>
          <textarea rows={3} className="input" {...register("message")} />
        </Field>

        {submitState.status === "error" && (
          <p className="text-sm text-red-400">{submitState.message}</p>
        )}

        <button
          type="submit"
          disabled={submitState.status === "submitting"}
          className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {submitState.status === "submitting" ? "Envoi en cours…" : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
