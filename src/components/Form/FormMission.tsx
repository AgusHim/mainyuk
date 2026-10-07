"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  createMission,
  getAdminMissions,
  updateMission,
} from "@/redux/slices/missionSlice";
import { MissionType, VerificationMode } from "@/types/mission";
import { useState } from "react";

type Props = {
  toggleDialog: () => void;
};

// datetime-local menghasilkan "YYYY-MM-DDTHH:mm" tanpa offset. Server menolak
// waktu tanpa offset eksplisit, jadi nilai lokal diberi offset +07:00 (WIB)
// supaya jadwal misi tidak bergeser mengikuti zona server.
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
  // Ambil bagian "YYYY-MM-DDTHH:mm" dari RFC3339 agar cocok dengan input.
  return value.slice(0, 16);
};

const FormMission: React.FC<Props> = ({ toggleDialog }) => {
  const dispatch = useAppDispatch();
  const mission = useAppSelector((state) => state.mission.adminMission);
  const isLoading = useAppSelector((state) => state.mission.loading);

  const [formData, setFormData] = useState({
    code: mission?.code ?? "",
    title: mission?.title ?? "",
    description: mission?.description ?? "",
    type: (mission?.type ?? "daily") as MissionType,
    verification_mode: (mission?.verification_mode ??
      "self_claim") as VerificationMode,
    reward_xp: mission?.reward_xp ?? 25,
    claim_limit: mission?.claim_limit ?? 1,
    starts_at: toLocalInput(mission?.starts_at),
    ends_at: toLocalInput(mission?.ends_at),
    is_published: mission?.is_published ?? false,
    sort_order: mission?.sort_order ?? 0,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      code: formData.code,
      title: formData.title,
      description: formData.description === "" ? null : formData.description,
      type: formData.type,
      verification_mode: formData.verification_mode,
      reward_xp: Number(formData.reward_xp),
      claim_limit: Number(formData.claim_limit),
      starts_at: toJakartaRFC3339(formData.starts_at),
      ends_at: toJakartaRFC3339(formData.ends_at),
      is_published: formData.is_published,
      sort_order: Number(formData.sort_order),
    };

    const action =
      mission == null
        ? dispatch(createMission(payload))
        : dispatch(updateMission({ id: mission.id, data: payload }));

    action
      .unwrap()
      .then(() => {
        toggleDialog();
        dispatch(getAdminMissions());
      })
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  return (
    <>
      <h3 className="text-2xl font-bold text-black dark:text-white">
        {mission != null ? "Edit Misi" : "Tambah Misi"}
      </h3>
      <Separator className="my-2" />
      <form onSubmit={handleSubmit}>
        <div className="my-2 space-y-1.5">
          <Label htmlFor="code" className="font-bold text-black dark:text-white">
            Kode Misi <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData.code}
            onChange={handleChange}
            type="text"
            name="code"
            placeholder="mis. hadir-kajian-mingguan"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>

        <div className="my-2 space-y-1.5">
          <Label htmlFor="title" className="font-bold text-black dark:text-white">
            Judul <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData.title}
            onChange={handleChange}
            type="text"
            name="title"
            placeholder="Judul misi yang dilihat anggota"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>

        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="description"
            className="font-bold text-black dark:text-white"
          >
            Deskripsi
          </Label>
          <Input
            value={formData.description}
            onChange={handleChange}
            type="text"
            name="description"
            placeholder="Penjelasan singkat misi"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
        </div>

        <div className="my-2 space-y-1.5">
          <Label htmlFor="type" className="font-bold text-black dark:text-white">
            Jenis <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({ ...formData, type: value as MissionType })
            }
          >
            <SelectTrigger
              id="type"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Pilih jenis misi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Harian</SelectItem>
              <SelectItem value="weekly">Mingguan</SelectItem>
              <SelectItem value="special">Khusus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="verification_mode"
            className="font-bold text-black dark:text-white"
          >
            Verifikasi <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Select
            value={formData.verification_mode}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                verification_mode: value as VerificationMode,
              })
            }
          >
            <SelectTrigger
              id="verification_mode"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Pilih cara verifikasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Otomatis</SelectItem>
              <SelectItem value="self_claim">Klaim mandiri</SelectItem>
              <SelectItem value="proof_approval">Bukti + persetujuan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="my-2 grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="reward_xp"
              className="font-bold text-black dark:text-white"
            >
              Reward XP
            </Label>
            <Input
              value={formData.reward_xp}
              onChange={handleChange}
              type="number"
              min={0}
              name="reward_xp"
              className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="claim_limit"
              className="font-bold text-black dark:text-white"
            >
              Batas Klaim
            </Label>
            <Input
              value={formData.claim_limit}
              onChange={handleChange}
              type="number"
              min={1}
              name="claim_limit"
              className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            />
          </div>
        </div>

        <div className="my-2 grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="starts_at"
              className="font-bold text-black dark:text-white"
            >
              Mulai (WIB) <span className="text-meta-1 text-lg">*</span>
            </Label>
            <Input
              value={formData.starts_at}
              onChange={handleChange}
              type="datetime-local"
              name="starts_at"
              className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="ends_at"
              className="font-bold text-black dark:text-white"
            >
              Berakhir (WIB) <span className="text-meta-1 text-lg">*</span>
            </Label>
            <Input
              value={formData.ends_at}
              onChange={handleChange}
              type="datetime-local"
              name="ends_at"
              className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
              required
            />
          </div>
        </div>

        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="sort_order"
            className="font-bold text-black dark:text-white"
          >
            Urutan Tampil
          </Label>
          <Input
            value={formData.sort_order}
            onChange={handleChange}
            type="number"
            name="sort_order"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
        </div>

        <label className="my-3 flex items-center gap-3 text-black dark:text-white">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="h-5 w-5 accent-black"
          />
          Publikasikan misi ini
        </label>

        <div className="my-2 mt-10">
          {isLoading ? (
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <Button
              type="submit"
              className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              {mission == null ? "Tambah Misi Baru" : "Simpan Perubahan"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormMission;
