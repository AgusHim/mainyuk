"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { admin_api } from "@/redux/api";
import { format } from "date-fns";
import {
  putTicket,
  getTicketsByEventID,
  postTicket,
} from "@/redux/slices/ticketSlice";
import { Ticket } from "@/types/ticket";
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

type Props = {
  toggleDialog: () => void;
};

type EpisodeOption = { id: string; position: number; title: string };

const FormTicket: React.FC<Props> = ({ toggleDialog }) => {
  const dispatch = useAppDispatch();

  const event = useAppSelector((state) => state.event.event);
  const ticket = useAppSelector((state) => state.ticket.ticket);
  const isLoadingTicket = useAppSelector((state) => state.ticket.loading);

  const [formData, setFormData] = useState({
    id: ticket?.id ?? "",
    name: ticket?.name ?? "",
    description: ticket?.description ?? "",
    visibility: ticket?.visibility ?? "public",
    price: ticket?.price ?? 0,
    min_order_pax: ticket?.min_order_pax ?? 1,
    max_order_pax: ticket?.max_order_pax ?? 1,
    max_pax: ticket?.max_pax ?? 1,
    pax_multiplier: ticket?.pax_multiplier ?? 1,
    start_at: ticket?.start_at!.replace("Z", ""),
    end_at: ticket?.end_at!.replace("Z", ""),
    gender_allowed: ticket?.gender_allowed ?? "both",
    access_mode: ticket?.access_mode ?? "all",
    episode_ids: ticket?.episode_ids ?? ([] as string[]),
  });
  const [episodes, setEpisodes] = useState<EpisodeOption[]>([]);

  useEffect(() => {
    if (!event?.id) return;
    admin_api.get(`/event_episodes?event_id=${event.id}`)
      .then((response) => setEpisodes(response.data as EpisodeOption[]))
      .catch(() => setEpisodes([]));
  }, [event?.id]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    var bodyData = {
      id: formData.id,
      event_id: event?.id ?? "",
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price.toString()),
      visibility: formData.visibility,
      gender_allowed: formData.gender_allowed,
      access_mode: formData.access_mode,
      episode_ids: formData.access_mode === "selected" ? formData.episode_ids : [],
      max_pax: parseInt(formData.max_pax.toString()),
      min_order_pax: parseInt(formData.min_order_pax.toString()),
      max_order_pax: parseInt(formData.max_order_pax.toString()),
      pax_multiplier: parseInt(formData.pax_multiplier.toString()),
      start_at: format(
        Date.parse(formData.start_at!.replace("Z", "")),
        "yyyy-MM-dd HH:mm"
      ).replace(" ", "T"),
      end_at: format(
        Date.parse(formData.end_at!.replace("Z", "")),
        "yyyy-MM-dd HH:mm"
      ).replace(" ", "T"),
    };

    if (ticket == null) {
      dispatch(postTicket(bodyData as Ticket))
        .unwrap()
        .then((res) => {
          if (res != null) {
            toggleDialog();
            dispatch(getTicketsByEventID(event?.id ?? ""));
          }
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error("Error fetching data:", error);
        });
    } else {
      dispatch(putTicket(bodyData as Ticket))
        .unwrap()
        .then((res) => {
          if (res != null) {
            toggleDialog();
            dispatch(getTicketsByEventID(event?.id ?? ""));
          }
        })
        .catch((error) => {
          // Handle errors here if needed
          console.error("Error fetching data:", error);
        });
    }
  };

  return (
    <>
      <h3 className="text-2xl font-bold text-black dark:text-white">
        {ticket != null ? "Edit Tiket" : "Tambah Tiket"}
      </h3>
      <Separator className="my-2" />
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="name" className="font-bold text-black dark:text-white">
            Nama Tiket <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["name"]}
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Masukan nama tiket"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Name */}

        {/* Description */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="description"
            className="font-bold text-black dark:text-white"
          >
            Deskripsi Tiket <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["description"]}
            onChange={handleChange}
            type="text"
            name="description"
            placeholder="Masukan deskripsi tiket"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Description */}

        {/* GenderAllowed & Visibility */}
        <div className="-mx-3 mb-2 flex flex-wrap">
          <div className="mb-6 w-1/2 space-y-1.5 px-3 md:mb-0">
            <Label
              htmlFor="gender_allowed"
              className="font-bold text-black dark:text-white"
            >
              Gender Allowed <span className="text-meta-1 text-lg">*</span>
            </Label>
            <Select
              name="gender_allowed"
              value={formData["gender_allowed"]}
              onValueChange={(value) =>
                handleChange({ target: { name: "gender_allowed", value } })
              }
            >
              <SelectTrigger
                id="gender_allowed"
                className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Semua</SelectItem>
                <SelectItem value="male">Khusus Ikhwan</SelectItem>
                <SelectItem value="female">Khusus Akhwat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-6 w-1/2 space-y-1.5 px-3 md:mb-0">
            <Label
              htmlFor="visibility"
              className="font-bold text-black dark:text-white"
            >
              Visibility <span className="text-meta-1 text-lg">*</span>
            </Label>
            <Select
              name="visibility"
              value={formData["visibility"]}
              onValueChange={(value) =>
                handleChange({ target: { name: "visibility", value } })
              }
            >
              <SelectTrigger
                id="visibility"
                className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">PUBLIC</SelectItem>
                <SelectItem value="draft">DRAFT</SelectItem>
                <SelectItem value="private">PRIVATE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* GenderAllowed & Visibility */}

        {/* Price */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="price" className="font-bold text-black dark:text-white">
            Harga Tiket <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["price"]}
            onChange={handleChange}
            type="text"
            name="price"
            placeholder="Masukan harga tiket"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            required
          />
        </div>
        {/* End of Price */}

        <div className="my-5 rounded-xl border border-[var(--yn-border)] bg-[var(--yn-surface-muted)] p-4">
          <Label className="font-bold text-black dark:text-white">Akses materi dan rekaman</Label>
          <p className="mt-1 text-sm text-[var(--yn-muted)]">Tiket episode membuka sesi yang dipilih. Tiket bundle pilih beberapa sesi.</p>
          <Select
            value={formData.access_mode}
            onValueChange={(value) => setFormData({ ...formData, access_mode: value as "all" | "selected" })}
          >
            <SelectTrigger className="mt-3 h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua episode</SelectItem>
              <SelectItem value="selected">Episode tertentu / bundle</SelectItem>
            </SelectContent>
          </Select>
          {formData.access_mode === "selected" && (
            <div className="mt-3 space-y-2">
              {episodes.length ? episodes.map((episode) => {
                const checked = formData.episode_ids.includes(episode.id);
                return <label key={episode.id} className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-3 text-sm dark:bg-boxdark">
                  <input type="checkbox" checked={checked} onChange={() => setFormData({ ...formData, episode_ids: checked ? formData.episode_ids.filter((id) => id !== episode.id) : [...formData.episode_ids, episode.id] })} />
                  <span>Episode {episode.position}: {episode.title}</span>
                </label>;
              }) : <p className="text-sm text-[var(--yn-muted)]">Buat episode terlebih dahulu sebelum membuat tiket bundle.</p>}
            </div>
          )}
        </div>

        {/* Max Pax & Pax Multiplier */}
        <div className="-mx-3 mb-2 flex flex-wrap">
          <div className="mb-6 w-1/2 space-y-1.5 px-3 md:mb-0">
            <Label
              htmlFor="max_pax"
              className="font-bold text-black dark:text-white"
            >
              Maksimal Pax <span className="text-meta-1 text-lg">*</span>
            </Label>
            <Input
              value={formData["max_pax"]}
              onChange={handleChange}
              type="text"
              name="max_pax"
              placeholder="Masukan maksimal pax"
              className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
              required
            />
          </div>
          <div className="mb-6 w-1/2 space-y-1.5 px-3 md:mb-0">
            <Label
              htmlFor="pax_multiplier"
              className="font-bold text-black dark:text-white"
            >
              Pax Multiplier <span className="text-meta-1 text-lg">*</span>
            </Label>
            <Input
              value={formData["pax_multiplier"]}
              onChange={handleChange}
              type="text"
              name="pax_multiplier"
              placeholder="Masukan maksimal pax perorder"
              className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
              required
            />
          </div>
        </div>
        {/* Max Pax & Pax Multiplier */}

        {/* Min & Max Order Pax */}
        <div className="-mx-3 mb-2 flex flex-wrap">
          <div className="mb-6 w-1/2 space-y-1.5 px-3 md:mb-0">
            <Label
              htmlFor="min_order_pax"
              className="font-bold text-black dark:text-white"
            >
              Min Order Pax <span className="text-meta-1 text-lg">*</span>
            </Label>
            <Input
              value={formData["min_order_pax"]}
              onChange={handleChange}
              type="text"
              name="min_order_pax"
              placeholder="Masukan maksimal pax perorder"
              className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
              required
            />
          </div>
          <div className="mb-6 w-1/2 space-y-1.5 px-3 md:mb-0">
            <Label
              htmlFor="max_order_pax"
              className="font-bold text-black dark:text-white"
            >
              Max Order Pax <span className="text-meta-1 text-lg">*</span>
            </Label>
            <Input
              value={formData["max_order_pax"]}
              onChange={handleChange}
              type="text"
              name="max_order_pax"
              placeholder="Masukan maksimal pax perorder"
              className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
              required
            />
          </div>
        </div>
        {/* Min & Max Order Pax */}

        {/* Start At */}
        <div className="my-2 space-y-1.5">
          <Label
            htmlFor="start_at"
            className="font-bold text-black dark:text-white"
          >
            Jadwal Mulai <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["start_at"]}
            onChange={handleChange}
            type="datetime-local"
            name="start_at"
            placeholder="Jadwal mulai"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            min="2024-01-01T00:00"
            required
          />
        </div>
        {/* End of Start At */}

        {/* End At */}
        <div className="my-2 space-y-1.5">
          <Label htmlFor="end_at" className="font-bold text-black dark:text-white">
            Jadwal Selesai <span className="text-meta-1 text-lg">*</span>
          </Label>
          <Input
            value={formData["end_at"]}
            onChange={handleChange}
            type="datetime-local"
            name="end_at"
            placeholder="Jadwal selesai"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            min="2024-01-01T00:00"
            required
          />
        </div>
        {/* End of End At */}

        <div className="my-2 mt-10">
          {isLoadingTicket ? (
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <Button
              type="submit"
              className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
              style={{ boxShadow: "0px 5px 0px 0px #000000" }}
            >
              {ticket == null ? "Tambah Tiket" : "Simpan Perubahan"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default FormTicket;
