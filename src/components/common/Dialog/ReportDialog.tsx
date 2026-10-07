"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ReportReason,
  reportReasonLabel,
  reportReasons,
} from "@/types/thread";
import { useState } from "react";

type Props = {
  /** Jenis konten yang dilaporkan, dipakai di judul dialog. */
  targetLabel: string;
  onConfirm: (reason: ReportReason, note: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

/**
 * Dialog pelaporan konten. Alasannya wajib dipilih, mengikuti pola dialog
 * penolakan klaim misi: tombol kirim mati sampai pilihannya diisi.
 *
 * Catatan tidak wajib — kadang alasannya sudah cukup jelas dari kategorinya,
 * dan memaksa menulis penjelasan hanya menambah friksi bagi pelapor.
 */
const ReportDialog = ({
  targetLabel,
  onConfirm,
  onCancel,
  isLoading = false,
}: Props) => {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [note, setNote] = useState("");

  return (
    <>
      <h3 className="text-lg font-bold text-black dark:text-white">
        Laporkan {targetLabel}
      </h3>
      <p className="py-2 text-sm text-black dark:text-white">
        Laporan diteruskan ke pengurus. Identitas pelapor tidak pernah
        ditampilkan ke penulis konten.
      </p>

      <div className="grid gap-2">
        {reportReasons.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 text-sm text-black dark:text-white"
          >
            <input
              type="radio"
              name="report-reason"
              value={option}
              checked={reason === option}
              onChange={() => setReason(option)}
              className="h-4 w-4 accent-black"
            />
            {reportReasonLabel(option)}
          </label>
        ))}
      </div>

      <Input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Catatan tambahan (opsional)"
        className="mt-4 h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
      />

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          disabled={reason === "" || isLoading}
          onClick={() => onConfirm(reason as ReportReason, note)}
          className="h-10 border-2 border-black bg-danger text-white hover:bg-danger/80 disabled:opacity-50"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Kirim laporan
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="h-10 border-2 border-black bg-success text-white hover:bg-success/80"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Batal
        </Button>
      </div>
    </>
  );
};

export default ReportDialog;
