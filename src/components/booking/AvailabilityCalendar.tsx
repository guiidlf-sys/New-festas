"use client";

import { DayPicker, type DateRange, type Matcher } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "react-day-picker/style.css";

export function AvailabilityCalendar({
  selected,
  onSelect,
  busyRanges,
  disabled,
}: {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  busyRanges: { from: Date; to: Date }[];
  disabled?: boolean;
}) {
  const disabledMatchers: Matcher[] = [{ before: new Date() }, ...busyRanges];

  return (
    <div className="booking-calendar glass-card p-4 sm:p-6">
      <DayPicker
        mode="range"
        locale={fr}
        numberOfMonths={2}
        selected={selected}
        onSelect={disabled ? undefined : onSelect}
        disabled={disabled ? true : disabledMatchers}
        excludeDisabled
        showOutsideDays
        className="mx-auto"
      />
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent-soft" /> Indisponible
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-accent" /> Sélectionné
        </span>
      </div>
    </div>
  );
}
