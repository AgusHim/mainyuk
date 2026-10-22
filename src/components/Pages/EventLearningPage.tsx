"use client";

import { CommonHeader } from "@/components/Header/CommonHeader";
import { user_api } from "@/redux/api";
import { BookOpen, LockKeyhole, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Content = { id: string; type: "material" | "recording"; title: string; description: string; url: string };
type Episode = { id: string; position: number; title: string; description: string; unlocked: boolean; contents?: Content[] };

export default function EventLearningPage({ slug }: { slug: string }) {
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    user_api.get(`/events/${slug}/learning`)
      .then((response) => setEpisodes(response.data as Episode[]))
      .catch(() => setError("Materi belum dapat dimuat. Pastikan kamu sudah login dan tiketmu telah dibayar."));
  }, [slug]);

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
          </div> : <p className="border-t border-[var(--yn-border)] px-5 py-3 text-sm text-[var(--yn-muted)]">Butuh tiket yang mencakup episode ini.</p>}
        </section>)}
      </div>
      {episodes?.length === 0 && <div className="mt-7 rounded-2xl border border-[var(--yn-border)] p-6 text-sm text-[var(--yn-muted)]">Belum ada episode yang diterbitkan.</div>}
      <Link className="mt-7 inline-flex rounded-full border border-[var(--yn-border)] px-5 py-2.5 text-sm font-semibold text-[var(--yn-foreground)]" href={`/events/${slug}`}>Kembali ke event</Link>
    </main>
  </>;
}
