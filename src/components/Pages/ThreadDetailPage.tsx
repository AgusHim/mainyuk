"use client";

import Dialog from "@/components/common/Dialog/Dialog";
import ReportDialog from "@/components/common/Dialog/ReportDialog";
import ThreadCommentList from "@/components/Thread/ThreadCommentList";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { applyReaction, applyUnreact, createReport, deleteThread, getThreadDetail, reactToThread, removeThreadFromList, unreactToThread } from "@/redux/slices/threadSlice";
import { ReportReason, threadSourceLabel } from "@/types/thread";
import { formatStrToDateTime } from "@/utils/convert";
import { ArrowLeft, Heart, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = { publicId: string };

const ThreadDetailPage = ({ publicId }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const thread = useAppSelector((state) => state.thread.thread);
  const isLoading = useAppSelector((state) => state.thread.loading);
  const error = useAppSelector((state) => state.thread.error);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => { dispatch(getThreadDetail(publicId)); }, [dispatch, publicId]);

  const toggleReaction = async () => {
    if (!thread) return;
    if (!user) { toast.info("Masuk dulu untuk memberi reaksi"); return; }
    const action = thread.reacted ? unreactToThread : reactToThread;
    dispatch(thread.reacted ? applyUnreact(thread.public_id) : applyReaction(thread.public_id));
    try { await dispatch(action(thread.public_id)).unwrap(); } catch { /* Interceptor menampilkan galat. */ }
  };

  const submitReport = async (reason: ReportReason, note: string) => {
    if (!thread || !user) { toast.info("Masuk dulu untuk melaporkan"); return; }
    try {
      await dispatch(createReport({ target_type: "thread", target_id: thread.public_id, reason, note: note.trim() || null })).unwrap();
      toast.success("Laporan diterima");
      dialogRef.current?.close();
    } catch { /* Interceptor menampilkan galat. */ }
  };

  const removeThread = async () => {
    if (!thread) return;
    try {
      await dispatch(deleteThread(thread.public_id)).unwrap();
      dispatch(removeThreadFromList(thread.public_id));
      toast.success("Kiriman dihapus");
      router.push("/community");
    } catch { /* Interceptor menampilkan galat. */ }
  };

  const sourceLabel = threadSourceLabel(thread?.source_type);

  return (
    <MainLayout>
      <main className="mx-auto min-h-screen max-w-2xl border-x border-[var(--yn-border)] bg-[var(--yn-surface)] pb-10">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 bg-[var(--yn-background)]/95 px-5 backdrop-blur-sm">
          <Link href="/community" aria-label="Kembali ke komunitas" className="flex size-9 items-center justify-center text-[var(--yn-foreground)] hover:bg-[var(--yn-surface-muted)]"><ArrowLeft className="size-5" /></Link>
          <h1 className="text-lg font-semibold tracking-[-0.025em]">Percakapan</h1>
        </header>

        {error && thread === null ? <p role="alert" className="mx-5 mt-5 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
        {thread === null ? (
          <div className="px-5 py-12 text-sm text-[var(--yn-muted)]">
            {isLoading ? "Memuat percakapan…" : error == null ? "Percakapan tidak ditemukan atau sudah dihapus." : null}
          </div>
        ) : (
          <>
            <article className="px-5 py-7 sm:px-8">
              <div className="flex items-center gap-3">
                {thread.author?.avatar_url ? <Image src={thread.author.avatar_url} alt={thread.author.alias} width={44} height={44} className="size-11 rounded-full object-cover" /> : <div className="flex size-11 items-center justify-center rounded-full bg-[var(--yn-surface-muted)] text-sm font-semibold text-[var(--yn-foreground)]">{thread.author?.alias?.charAt(0)?.toUpperCase() ?? "A"}</div>}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--yn-foreground)]">{thread.author?.alias ?? "Anonim"}</p>
                  <p className="mt-0.5 text-xs text-[var(--yn-muted)]">{formatStrToDateTime(thread.created_at, "dd MMM yyyy · HH:mm")}</p>
                </div>
                {sourceLabel ? <span className="text-xs font-medium text-[var(--yn-accent-dark)]">{sourceLabel}</span> : null}
              </div>

              {thread.source_type ? <h2 className="mt-6 text-2xl font-semibold tracking-[-0.035em] text-[var(--yn-foreground)]">{thread.title}</h2> : null}
              <p className="mt-5 whitespace-pre-wrap text-[17px] leading-8 text-[var(--yn-foreground)]">{thread.body}</p>

              <div className="mt-7 flex items-center gap-4 text-sm">
                <button type="button" onClick={toggleReaction} className={`flex items-center gap-2 font-medium transition-colors ${thread.reacted ? "text-[var(--yn-accent-dark)]" : "text-[var(--yn-muted)] hover:text-[var(--yn-foreground)]"}`}><Heart className={`size-5 ${thread.reacted ? "fill-current" : ""}`} /> {thread.reaction_count}</button>
                <span className="text-[var(--yn-muted)]">{thread.comment_count} komentar</span>
                <div className="ml-auto">
                  {thread.is_mine ? <button type="button" onClick={removeThread} className="text-sm font-semibold text-red-700 underline underline-offset-4">Hapus</button> : <button type="button" onClick={() => user ? dialogRef.current?.showModal() : toast.info("Masuk dulu untuk melaporkan")} className="flex size-9 items-center justify-center text-[var(--yn-muted)] hover:bg-[var(--yn-surface-muted)]" aria-label="Laporkan kiriman"><MoreHorizontal className="size-5" /></button>}
                </div>
              </div>
            </article>

            <ThreadCommentList threadPublicId={thread.public_id} />
          </>
        )}

        <Dialog toggleDialog={() => {}} ref={dialogRef} title="Laporkan kiriman"><ReportDialog targetLabel="kiriman ini" isLoading={isLoading} onConfirm={submitReport} onCancel={() => dialogRef.current?.close()} /></Dialog>
      </main>
    </MainLayout>
  );
};

export default ThreadDetailPage;
