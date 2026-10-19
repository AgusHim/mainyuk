"use client";

import { admin_api } from "@/redux/api";
import { useEffect, useState } from "react";

type Episode = { id: string; position: number; title: string; description: string; is_published: boolean };

export default function EventEpisodeManager({ eventId }: { eventId: string }) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const load = () => admin_api.get(`/event_episodes?event_id=${eventId}`).then((r) => setEpisodes(r.data as Episode[])).catch(() => setMessage("Episode gagal dimuat."));
  useEffect(() => { void load(); }, [eventId]);

  async function createEpisode(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      await admin_api.post("/event_episodes", { event_id: eventId, position: episodes.length + 1, title, description, is_published: true });
      setTitle(""); setDescription(""); setMessage("Episode ditambahkan."); await load();
    } catch { setMessage("Episode belum dapat disimpan."); }
  }

  async function addContent(event: React.FormEvent<HTMLFormElement>, episodeId: string) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await admin_api.post("/event_episode_contents", { episode_id: episodeId, position: 1, title: data.get("title"), type: data.get("type"), url: data.get("url"), description: "", is_published: true });
      event.currentTarget.reset(); setMessage("Konten diterbitkan untuk peserta yang memiliki akses.");
    } catch { setMessage("Konten belum dapat disimpan."); }
  }

  return <div className="my-10 max-w-3xl space-y-6">
    <div><p className="text-3xl font-semibold text-black dark:text-white">Episode & materi</p><p className="mt-1 text-sm text-body dark:text-bodydark">Buat sesi terlebih dahulu, lalu pilih sesi tersebut saat membuat tiket episode atau bundle.</p></div>
    {message && <p role="status" className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">{message}</p>}
    <form onSubmit={createEpisode} className="grid gap-3 rounded-lg border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul episode, mis. Episode 1: Pengantar" className="h-11 rounded-lg border border-stroke bg-transparent px-3 text-black dark:border-strokedark dark:text-white" required />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi singkat (opsional)" className="h-11 rounded-lg border border-stroke bg-transparent px-3 text-black dark:border-strokedark dark:text-white" />
      <button className="w-fit rounded-lg border-2 border-black bg-primary px-5 py-2 font-medium text-white" type="submit">Tambah episode</button>
    </form>
    <div className="space-y-4">{episodes.map((episode) => <section key={episode.id} className="rounded-lg border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark"><h2 className="font-semibold text-black dark:text-white">Episode {episode.position} · {episode.title}</h2><p className="mt-1 text-sm text-body dark:text-bodydark">{episode.description}</p><form onSubmit={(e) => addContent(e, episode.id)} className="mt-4 grid gap-2 sm:grid-cols-[1fr_140px_2fr_auto]"><input name="title" placeholder="Judul materi/rekaman" required className="h-10 rounded border border-stroke bg-transparent px-3 text-sm dark:border-strokedark" /><select name="type" className="h-10 rounded border border-stroke bg-transparent px-3 text-sm dark:border-strokedark"><option value="material">Materi</option><option value="recording">Rekaman</option></select><input name="url" type="url" placeholder="https://…" required className="h-10 rounded border border-stroke bg-transparent px-3 text-sm dark:border-strokedark" /><button className="rounded bg-primary px-4 text-sm font-medium text-white" type="submit">Terbitkan</button></form></section>)}</div>
  </div>;
}
