"use client";

import { admin_api } from "@/redux/api";
import { ExternalLink, FileText, Image, Video } from "lucide-react";
import { useEffect, useState } from "react";

type Submission = {
  id: string; file_type: "document" | "video" | "image"; drive_url: string; note: string; updated_at: string;
  user?: { name?: string; email?: string }; episode?: { position: number; title: string };
};

const fileIcon = (type: Submission["file_type"]) => type === "video" ? Video : type === "image" ? Image : FileText;

export default function EventAssignmentSubmissions({ eventId }: { eventId: string }) {
  const [items, setItems] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(null); setError(null);
    admin_api.get(`/events/${eventId}/assignments`).then((response) => setItems(response.data as Submission[])).catch(() => setError("Daftar tugas belum dapat dimuat."));
  }, [eventId]);

  return <div className="my-10">
    <h2 className="text-3xl font-semibold text-black dark:text-white">Tugas peserta</h2>
    <p className="mt-1 text-sm text-body dark:text-bodydark">Tautan menuju file publik Google Drive yang dikirim peserta per episode.</p>
    {error && <p role="alert" className="mt-5 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
    {items === null && !error && <p className="mt-5 text-sm text-body">Memuat tugas…</p>}
    {items?.length === 0 && <p className="mt-5 rounded-lg border border-stroke p-5 text-sm text-body dark:border-strokedark">Belum ada tugas yang dikumpulkan.</p>}
    <div className="mt-5 space-y-3">{items?.map((item) => {
      const Icon = fileIcon(item.file_type);
      return <article key={item.id} className="flex flex-col gap-3 rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3"><Icon className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="font-medium text-black dark:text-white">{item.user?.name ?? "Peserta"}</p><p className="text-xs text-body dark:text-bodydark">{item.user?.email}</p><p className="mt-1 text-sm text-body dark:text-bodydark">Episode {item.episode?.position}: {item.episode?.title} · {item.file_type === "document" ? "Dokumen" : item.file_type === "video" ? "Video" : "Gambar"}</p>{item.note && <p className="mt-1 text-sm text-body dark:text-bodydark">{item.note}</p>}<p className="mt-1 text-xs text-body">Diperbarui {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(item.updated_at))} WIB</p></div></div>
        <a href={item.drive_url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"><ExternalLink className="size-4" /> Buka file</a>
      </article>;
    })}</div>
  </div>;
}
