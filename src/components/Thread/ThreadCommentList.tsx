"use client";
import Dialog from "@/components/common/Dialog/Dialog";
import ReportDialog from "@/components/common/Dialog/ReportDialog";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  createReport,
  createThreadComment,
  deleteThreadComment,
  getThreadComments,
  removeCommentFromList,
} from "@/redux/slices/threadSlice";
import { ReportReason, ThreadComment } from "@/types/thread";
import { formatStrToDateTime } from "@/utils/convert";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  threadPublicId: string;
  compact?: boolean;
};

const BODY_MAX = 1000;

/**
 * Daftar komentar satu tingkat beserta form balasannya.
 *
 * Komentar tidak bersarang: kedalaman satu sudah cukup dan menghapus seluruh
 * kelas masalah penomoran. Penulis dirender dari `comment.author` yang sudah
 * dianonimkan server.
 */
const ThreadCommentList = ({ threadPublicId, compact = false }: Props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const comments = useAppSelector((state) => state.thread.comments);
  const hasMore = useAppSelector((state) => state.thread.commentsHasMore);
  const isLoading = useAppSelector((state) => state.thread.loading);
  const [body, setBody] = useState("");
  const [page, setPage] = useState(1);
  const [reported, setReported] = useState<ThreadComment | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dispatch(getThreadComments({ publicId: threadPublicId, page: 1 }));
    setPage(1);
  }, [dispatch, threadPublicId]);

  const openReport = (comment: ThreadComment) => {
    setReported(comment);
    dialogRef.current?.showModal();
  };

  const submitReport = async (reason: ReportReason, note: string) => {
    if (!reported) {
      return;
    }
    if (!user) {
      toast.info("Masuk dulu untuk melaporkan");
      return;
    }
    try {
      await dispatch(
        createReport({
          target_type: "thread_comment",
          target_id: reported.public_id,
          reason,
          note: note.trim() === "" ? null : note,
        })
      ).unwrap();
      toast.success("Laporan diterima");
      setReported(null);
      dialogRef.current?.close();
    } catch {
      // Interceptor axios sudah menampilkan galatnya.
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Masuk dulu untuk berkomentar");
      return;
    }
    if (body.trim().length === 0) {
      toast.info("Komentar belum diisi");
      return;
    }
    try {
      await dispatch(
        createThreadComment({ publicId: threadPublicId, data: { body } })
      ).unwrap();
      setBody("");
    } catch {
      // Interceptor axios sudah menampilkan galatnya.
    }
  };

  const removeComment = async (comment: ThreadComment) => {
    try {
      await dispatch(
        deleteThreadComment({
          publicId: threadPublicId,
          commentPublicId: comment.public_id,
        })
      ).unwrap();
      dispatch(removeCommentFromList(comment.public_id));
      toast.success("Komentar dihapus");
    } catch {
      // Interceptor axios sudah menampilkan galatnya.
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    dispatch(getThreadComments({ publicId: threadPublicId, page: next }));
  };

  return (
    <section className={`${compact ? "border-t border-[var(--yn-border)] bg-[var(--yn-surface-muted)] px-5 py-5" : "border-t border-[var(--yn-border)] bg-[var(--yn-background)] px-5 py-7 sm:px-8"}`}>
      <h2 className="text-lg font-semibold tracking-[-0.025em] text-[var(--yn-foreground)]">
        Komentar ({comments.length})
      </h2>

      <form onSubmit={submitComment} className="mt-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={BODY_MAX}
          rows={3}
          placeholder="Tulis komentar…"
          className="w-full border border-[var(--yn-border)] bg-[var(--yn-surface)] px-4 py-3 text-sm text-[var(--yn-foreground)] outline-none transition focus:border-[var(--yn-accent)] focus:ring-1 focus:ring-[var(--yn-accent)]"
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-[var(--yn-muted)]">
            {body.length}/{BODY_MAX}
          </span>
          <button type="submit" disabled={isLoading} className="h-10 bg-[var(--yn-accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--yn-accent-dark)] disabled:opacity-50">
            Kirim
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="mt-5 text-sm text-[var(--yn-muted)]">
          {isLoading
            ? "Memuat komentar…"
            : "Belum ada komentar. Jadi yang pertama."}
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-[var(--yn-border)]">
          {comments.map((comment) => (
            <li
              key={comment.public_id}
              className="py-4"
            >
              <div className="flex items-center gap-3">
                {comment.author?.avatar_url ? (
                  <Image
                    src={comment.author.avatar_url}
                    alt={comment.author.alias}
                    width={28}
                    height={28}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--yn-surface-muted)] text-xs font-semibold text-[var(--yn-foreground)]">
                    {comment.author?.alias?.charAt(0)?.toUpperCase() ?? "A"}
                  </div>
                )}
                <div className="min-w-0"><div className="flex min-w-0 items-center gap-2"><p className="truncate text-sm font-semibold text-[var(--yn-foreground)]">{comment.author?.alias ?? "Anonim"}</p>{comment.author?.level ? <span className="shrink-0 text-xs font-medium text-[var(--yn-accent-dark)]">Lv. {comment.author.level}</span> : null}</div><p className="text-xs text-[var(--yn-muted)]">{comment.author?.level_name ? `${comment.author.level_name} · ` : ""}{formatStrToDateTime(comment.created_at, "dd MMM yyyy · HH:mm")}</p></div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--yn-foreground)]">
                {comment.body}
              </p>

              <div className="mt-3 flex gap-3">
                {comment.is_mine ? (
                  <button
                    type="button"
                    onClick={() => removeComment(comment)}
                    className="text-xs font-semibold text-red-700 underline underline-offset-4"
                  >
                    Hapus
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openReport(comment)}
                    className="text-xs font-semibold text-[var(--yn-muted)] underline underline-offset-4 hover:text-[var(--yn-foreground)]"
                  >
                    Laporkan
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {hasMore ? (
        <button
          type="button"
          onClick={loadMore}
          className="mt-5 bg-[var(--yn-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--yn-foreground)]"
        >
          Muat komentar lain
        </button>
      ) : null}

      <Dialog
        toggleDialog={() => setReported(null)}
        ref={dialogRef}
        title="Laporkan komentar"
      >
        <ReportDialog
          targetLabel="komentar"
          isLoading={isLoading}
          onConfirm={submitReport}
          onCancel={() => {
            setReported(null);
            dialogRef.current?.close();
          }}
        />
      </Dialog>
    </section>
  );
};

export default ThreadCommentList;
