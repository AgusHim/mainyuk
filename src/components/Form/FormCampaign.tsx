"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  createCampaign,
  getAdminCampaigns,
  updateCampaign,
} from "@/redux/slices/campaignAdminSlice";
import { FundType } from "@/types/fundraising";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  toggleDialog: () => void;
};

// datetime-local menghasilkan "YYYY-MM-DDTHH:mm" tanpa offset. Server menolak
// waktu tanpa offset eksplisit, jadi nilai lokal diberi offset +07:00 (WIB)
// supaya jadwal campaign tidak bergeser mengikuti zona server.
const toJakartaRFC3339 = (localValue: string): string => {
  if (!localValue) {
    return "";
  }
  return `${localValue}:00+07:00`;
};

const toLocalInput = (value?: string | null): string => {
  if (!value) {
    return "";
  }
  return value.slice(0, 16);
};

const FUND_TYPES: FundType[] = [
  "operasional",
  "dakwah",
  "sosial",
  "pendidikan",
  "lainnya",
];

const FormCampaign: React.FC<Props> = ({ toggleDialog }) => {
  const dispatch = useAppDispatch();
  const campaign = useAppSelector((state) => state.campaignAdmin.campaign);
  const isLoading = useAppSelector((state) => state.campaignAdmin.loading);

  const [formData, setFormData] = useState({
    slug: campaign?.slug ?? "",
    title: campaign?.title ?? "",
    summary: campaign?.summary ?? "",
    story: campaign?.story ?? "",
    cover_image_url: campaign?.cover_image_url ?? "",
    fund_type: (campaign?.fund_type ?? "dakwah") as FundType,
    recipient: campaign?.recipient ?? "",
    target_amount: campaign?.target_amount ?? 0,
    starts_at: toLocalInput(campaign?.starts_at),
    ends_at: toLocalInput(campaign?.ends_at),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      slug: formData.slug,
      title: formData.title,
      summary: formData.summary === "" ? null : formData.summary,
      story: formData.story === "" ? null : formData.story,
      cover_image_url:
        formData.cover_image_url === "" ? null : formData.cover_image_url,
      fund_type: formData.fund_type,
      recipient: formData.recipient,
      target_amount: Number(formData.target_amount) || 0,
      starts_at: formData.starts_at ? toJakartaRFC3339(formData.starts_at) : null,
      ends_at: formData.ends_at ? toJakartaRFC3339(formData.ends_at) : null,
    };

    const action = campaign
      ? dispatch(updateCampaign({ id: campaign.id, data: payload }))
      : dispatch(createCampaign(payload));

    action
      .unwrap()
      .then(() => {
        toast.success(campaign ? "Campaign diperbarui" : "Campaign dibuat");
        dispatch(getAdminCampaigns());
        toggleDialog();
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal menyimpan campaign");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div>
        <Label className="text-black">Judul</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="border-2 border-black"
        />
      </div>

      <div>
        <Label className="text-black">Slug</Label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="bantu-pendidikan-anak-yatim"
          required
          className="border-2 border-black"
        />
        <p className="mt-1 text-xs text-black">
          Dipakai pada tautan publik. Huruf kecil, angka, dan tanda hubung.
        </p>
      </div>

      <div>
        <Label className="text-black">Jenis dana</Label>
        <select
          value={formData.fund_type}
          onChange={(e) =>
            setFormData({ ...formData, fund_type: e.target.value as FundType })
          }
          className="w-full rounded-md border-2 border-black px-3 py-2 text-black"
        >
          {FUND_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label className="text-black">Penerima dana</Label>
        <Input
          value={formData.recipient}
          onChange={(e) =>
            setFormData({ ...formData, recipient: e.target.value })
          }
          required
          className="border-2 border-black"
        />
      </div>

      <div>
        <Label className="text-black">Target dana (Rp)</Label>
        <Input
          type="number"
          min={0}
          step={1000}
          value={formData.target_amount}
          onChange={(e) =>
            setFormData({
              ...formData,
              target_amount: Number(e.target.value) || 0,
            })
          }
          className="border-2 border-black"
        />
        <p className="mt-1 text-xs text-black">Isi 0 bila tanpa target.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-black">Mulai</Label>
          <Input
            type="datetime-local"
            value={formData.starts_at}
            onChange={(e) =>
              setFormData({ ...formData, starts_at: e.target.value })
            }
            className="border-2 border-black"
          />
        </div>
        <div>
          <Label className="text-black">Berakhir</Label>
          <Input
            type="datetime-local"
            value={formData.ends_at}
            onChange={(e) =>
              setFormData({ ...formData, ends_at: e.target.value })
            }
            className="border-2 border-black"
          />
        </div>
      </div>

      <div>
        <Label className="text-black">Ringkasan</Label>
        <Input
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          maxLength={300}
          className="border-2 border-black"
        />
      </div>

      <div>
        <Label className="text-black">Cerita</Label>
        <textarea
          value={formData.story}
          onChange={(e) => setFormData({ ...formData, story: e.target.value })}
          rows={5}
          className="w-full rounded-md border-2 border-black px-3 py-2 text-black"
        />
      </div>

      <div>
        <Label className="text-black">URL gambar sampul</Label>
        <Input
          value={formData.cover_image_url}
          onChange={(e) =>
            setFormData({ ...formData, cover_image_url: e.target.value })
          }
          placeholder="https://…"
          className="border-2 border-black"
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button
          type="button"
          onClick={toggleDialog}
          className="border-2 border-black bg-white text-black"
        >
          Batal
        </Button>
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
};

export default FormCampaign;
