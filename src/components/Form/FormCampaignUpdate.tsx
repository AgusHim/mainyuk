"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  createCampaignUpdate,
  getCampaignReport,
  updateCampaignUpdate,
} from "@/redux/slices/campaignAdminSlice";
import { CampaignUpdate, UpdateKind } from "@/types/fundraising";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  campaignId: string;
  update?: CampaignUpdate | null;
  onDone?: () => void;
}

const KIND_OPTIONS: { value: UpdateKind; label: string }[] = [
  { value: "update", label: "Perkembangan" },
  { value: "usage", label: "Penggunaan dana" },
  { value: "fee", label: "Biaya" },
];

export default function FormCampaignUpdate({
  campaignId,
  update,
  onDone,
}: Props) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.campaignAdmin.loading);

  const [title, setTitle] = useState(update?.title ?? "");
  const [body, setBody] = useState(update?.body ?? "");
  const [kind, setKind] = useState<UpdateKind>(update?.kind ?? "update");
  const [amount, setAmount] = useState<string>(
    update?.amount != null ? `${update.amount}` : ""
  );
  const [proofUrl, setProofUrl] = useState(update?.proof_url ?? "");
  const [isPublished, setIsPublished] = useState(update?.is_published ?? true);

  const needsAmount = kind === "usage" || kind === "fee";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (needsAmount && amount.trim() === "") {
      toast.error("Baris penggunaan dana dan biaya wajib mencantumkan nominal");
      return;
    }

    const payload = {
      title,
      body,
      kind,
      amount: amount.trim() === "" ? null : Number(amount),
      proof_url: proofUrl.trim() === "" ? null : proofUrl.trim(),
      is_published: isPublished,
    };

    const action = update
      ? dispatch(updateCampaignUpdate({ id: update.id, data: payload }))
      : dispatch(createCampaignUpdate({ campaignId, data: payload }));

    action
      .unwrap()
      .then(() => {
        toast.success(update ? "Update diperbarui" : "Update ditambahkan");
        dispatch(getCampaignReport(campaignId));
        onDone?.();
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal menyimpan update");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div>
        <Label className="text-black">Judul</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border-2 border-black"
        />
      </div>

      <div>
        <Label className="text-black">Jenis</Label>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as UpdateKind)}
          className="w-full rounded-md border-2 border-black px-3 py-2 text-black"
        >
          {KIND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {needsAmount ? (
        <div>
          <Label className="text-black">Nominal (Rp)</Label>
          <Input
            type="number"
            min={0}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="border-2 border-black"
          />
          <p className="mt-1 text-xs text-black">
            Nominal dicatat sebagai baris laporan dan tidak mengurangi dana
            terkumpul.
          </p>
        </div>
      ) : null}

      <div>
        <Label className="text-black">Isi</Label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          required
          className="w-full rounded-md border-2 border-black px-3 py-2 text-black"
        />
      </div>

      <div>
        <Label className="text-black">URL bukti (opsional)</Label>
        <Input
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          placeholder="https://…"
          className="border-2 border-black"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-black">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4 border-2 border-black"
        />
        Tampilkan di halaman publik
      </label>

      <div className="mt-2 flex justify-end gap-2">
        {onDone ? (
          <Button
            type="button"
            onClick={onDone}
            className="border-2 border-black bg-white text-black"
          >
            Batal
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={isLoading}
          className="border-2 border-black bg-meta-3 text-white"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          {isLoading ? "Menyimpan…" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
