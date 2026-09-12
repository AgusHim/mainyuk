"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * DatePicker berbasis shadcn/ui (Popover + Calendar/react-day-picker).
 * Menggantikan `Datepicker` dari flowbite-react dengan API yang kompatibel:
 *   <DatePicker value={...} onSelectedDateChanged={(date: Date) => ...} />
 *
 * Prop `theme` (rightPopupTheme/leftPopupTheme) masih diterima agar konsumen
 * lama tidak perlu diubah, tetapi sudah tidak berpengaruh (tema datang dari
 * token shadcn di globals.css).
 */
export type DatePickerProps = {
  value?: Date | string | null;
  onSelectedDateChanged?: (date: Date) => void;
  /** @deprecated dipertahankan untuk kompatibilitas; tidak berpengaruh */
  theme?: unknown;
  /** @deprecated dipertahankan untuk kompatibilitas; tidak berpengaruh */
  language?: string;
  /** @deprecated dipertahankan untuk kompatibilitas; tidak berpengaruh */
  showClearButton?: boolean;
  /** @deprecated dipertahankan untuk kompatibilitas; tidak berpengaruh */
  autoHide?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const PARSE_FORMATS = [
  "dd MMMM yyyy",
  "dd MMM yyyy",
  "dd-MM-yyyy",
  "dd/MM/yyyy",
  "yyyy-MM-dd",
];

function parseDateValue(
  value: Date | string | null | undefined,
): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? undefined : value;
  }
  // ISO string ("2026-09-26T10:00:00") dipercaya native parser
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const iso = new Date(value);
    if (!isNaN(iso.getTime())) return iso;
  }
  for (const fmt of PARSE_FORMATS) {
    const parsed = parse(value, fmt, new Date(), { locale: id });
    if (!isNaN(parsed.getTime())) return parsed;
  }
  const fallback = new Date(value);
  return isNaN(fallback.getTime()) ? undefined : fallback;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onSelectedDateChanged,
  placeholder = "Pilih tanggal",
  disabled,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const selected = parseDateValue(value);

  const displayValue = value
    ? value instanceof Date
      ? format(value, "dd MMMM yyyy", { locale: id })
      : value
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          aria-orientation="vertical"
          className={cn(
            "h-11 min-w-55 justify-start rounded-lg border-2 border-black bg-white px-4 text-left font-medium text-black dark:border-strokedark dark:bg-boxdark dark:text-white",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{displayValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          locale={id}
          mode="single"
          selected={selected}
          defaultMonth={selected}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (date) {
              onSelectedDateChanged?.(date);
              setOpen(false);
            }
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
};

/** @deprecated tema flowbite — dipertahankan agar import lama tidak rusak. */
export const rightPopupTheme = {};

/** @deprecated tema flowbite — dipertahankan agar import lama tidak rusak. */
export const leftPopupTheme = {};

export default DatePicker;
