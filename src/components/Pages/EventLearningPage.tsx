"use client";

import { CommonHeader } from "@/components/Header/CommonHeader";
import { user_api } from "@/redux/api";
import { BookOpen, FileUp, LockKeyhole, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Content = { id: string; type: "material" | "recording"; title: string; description: string; url: string };
type Submission = { id: string; file_type: "document" | "video" | "image"; drive_url: string; note: string; updated_at: string };
type Episode = { id: string; position: number; title: string; description: string; unlocked: boolean; contents?: Content[]; submission?: Submission };

export default function EventLearningPage({ slug }: { slug: string }) {
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  useEffect(() => {
    user_api.get(`/events/${slug}/learning`)
      .then((response) => setEpisodes(response.data as Episode[]))
      .catch(() => setError("Materi belum dapat dimuat. Pastikan kamu sudah login dan tiketmu telah dibayar."));
  }, [slug]);

  async function submitAssignment(event: React.FormEvent<HTMLFormElement>, episodeId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(episodeId); setSubmissionMessage(null);
    try {
      const response = await user_api.post(`/event_episodes/${episodeId}/assignments`, {
        file_type: form.get("file_type"), drive_url: form.get("drive_url"), note: form.get("note"),
      });
      setEpisodes((current) => current?.map((episode) => episode.id === episodeId ? { ...episode, submission: response.data as Submission } : episode) ?? current);
      setSubmissionMessage("Tugas berhasil dikirim.");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setSubmissionMessage(message ?? "Tugas belum dapat dikirim. Pastikan link Google Drive dapat diakses publik.");
    } finally { setSubmitting(null); }
  }

  return <>
    <CommonHeader title="Materi event" isShowBack />
    <main className="yn-container max-w-3xl py-8 pb-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--yn-accent)]">Ruang belajar</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--yn-foreground)]">Materi & rekaman</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--yn-muted)]">Setiap episode terbuka sesuai tiket yang kamu miliki.</p>
      {error && <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</div>}
      {episodes === null && !error && <p className="mt-8 text-sm text-[var(--yn-muted)]">Memuat episode…</p>}
      <div className="mt-7 space-y-4">
        {episodes?.map((episode) => <section key={episode.id} className={`overflow-hidden rounded-2xl border ${episode.unlocked ? "border-[var(--yn-border)] bg-[var(--yn-surface)]" : "border-[var(--yn-border)] bg-[var(--yn-surface-muted)]"}`}>
          <div className="flex items-start gap-4 p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-sm font-semibold text-[var(--yn-accent-dark)]">{episode.position}</span>
            <div className="min-w-0 flex-1"><h2 className="font-semibold text-[var(--yn-foreground)]">{episode.title}</h2><p className="mt-1 text-sm text-[var(--yn-muted)]">{episode.description}</p></div>
            {episode.unlocked ? <BookOpen className="size-5 shrink-0 text-[var(--yn-accent)]" aria-label="Terbuka" /> : <LockKeyhole className="size-5 shrink-0 text-[var(--yn-muted)]" aria-label="Terkunci" />}
          </div>
          {episode.unlocked ? <div className="border-t border-[var(--yn-border)] p-3">
            {(episode.contents?.length ?? 0) > 0 ? episode.contents?.map((content) => <a key={content.id} href={content.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-[var(--yn-accent-soft)]"><PlayCircle className="size-5 text-[var(--yn-accent)]" /><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-[var(--yn-foreground)]">{content.title}</span><span className="block text-xs text-[var(--yn-muted)]">{content.type === "recording" ? "Rekaman" : "Materi"}{content.description ? ` · ${content.description}` : ""}</span></span></a>) : <p className="p-3 text-sm text-[var(--yn-muted)]">Materi untuk episode ini belum diterbitkan.</p>}
            <form onSubmit={(event) => void submitAssignment(event, episode.id)} className="mt-3 rounded-xl border border-dashed border-[var(--yn-border)] p-4">
              <div className="flex items-center gap-2"><FileUp className="size-4 text-[var(--yn-accent)]" /><p className="text-sm font-semibold text-[var(--yn-foreground)]">Kumpulkan tugas</p></div>
              <p className="mt-1 text-xs leading-5 text-[var(--yn-muted)]">Unggah file ke Google Drive, atur akses ke “Siapa saja yang memiliki link”, lalu tempel tautannya di sini.</p>
              {episode.submission && <p className="mt-3 text-xs text-[var(--yn-accent-dark)]">Kiriman terakhir: <a className="underline" href={episode.submission.drive_url} target="_blank" rel="noopener noreferrer">lihat file</a>. Mengirim lagi akan memperbarui kiriman ini.</p>}
              <div className="mt-3 grid gap-2 sm:grid-cols-[130px_1fr]"><select name="file_type" defaultValue={episode.submission?.file_type ?? "document"} className="h-10 rounded-lg border border-[var(--yn-border)] bg-[var(--yn-surface)] px-3 text-sm"><option value="document">Dokumen</option><option value="video">Video</option><option value="image">Gambar</option></select><input name="drive_url" type="url" required defaultValue={episode.submission?.drive_url ?? ""} placeholder="https://drive.google.com/..." className="h-10 rounded-lg border border-[var(--yn-border)] bg-[var(--yn-surface)] px-3 text-sm" /></div>
              <input name="note" defaultValue={episode.submission?.note ?? ""} placeholder="Catatan untuk pengajar (opsional)" className="mt-2 h-10 w-full rounded-lg border border-[var(--yn-border)] bg-[var(--yn-surface)] px-3 text-sm" />
              <button disabled={submitting === episode.id} className="mt-3 rounded-full bg-[var(--yn-accent)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">{submitting === episode.id ? "Mengirim…" : episode.submission ? "Perbarui tugas" : "Kirim tugas"}</button>
            </form>
          </div> : <p className="border-t border-[var(--yn-border)] px-5 py-3 text-sm text-[var(--yn-muted)]">Butuh tiket yang mencakup episode ini.</p>}
        </section>)}
      </div>
      {submissionMessage && <p role="status" className="mt-4 text-sm text-[var(--yn-accent-dark)]">{submissionMessage}</p>}
      {episodes?.length === 0 && <div className="mt-7 rounded-2xl border border-[var(--yn-border)] p-6 text-sm text-[var(--yn-muted)]">Belum ada episode yang diterbitkan.</div>}
      <Link className="mt-7 inline-flex rounded-full border border-[var(--yn-border)] px-5 py-2.5 text-sm font-semibold text-[var(--yn-foreground)]" href={`/events/${slug}`}>Kembali ke event</Link>
    </main>
  </>;
}
