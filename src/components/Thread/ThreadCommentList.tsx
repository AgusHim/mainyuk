"use client";
import Dialog from "@/components/common/Dialog/Dialog";
import ReportDialog from "@/components/common/Dialog/ReportDialog";
import { Button } from "@/components/ui/button";
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
};

const BODY_MAX = 1000;

/**
 * Daftar komentar satu tingkat beserta form balasannya.
 *
 * Komentar tidak bersarang: kedalaman satu sudah cukup dan menghapus seluruh
 * kelas masalah penomoran. Penulis dirender dari `comment.author` yang sudah
 * dianonimkan server.
 */
const ThreadCommentList = ({ threadPublicId }: Props) => {
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
    <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
      <h2 className="text-lg font-semibold text-black">
        Komentar ({comments.length})
      </h2>

      <form onSubmit={submitComment} className="mt-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={BODY_MAX}
          rows={3}
          placeholder="Tulis komentar…"
          className="w-full rounded-lg border-2 border-black bg-white px-4 py-3 font-medium text-black outline-none transition focus:border-4 focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-black/70">
            {body.length}/{BODY_MAX}
          </span>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-10 rounded-md border-2 border-black px-4 disabled:opacity-50"
            style={{ boxShadow: "5px 5px 0px 0px #000000" }}
          >
            Kirim
          </Button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="mt-4 text-sm text-black">
          {isLoading
            ? "Memuat komentar…"
            : "Belum ada komentar. Jadi yang pertama."}
        </p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {comments.map((comment) => (
            <li
              key={comment.public_id}
              className="rounded-lg border-2 border-black bg-white p-3"
            >
              <div className="flex items-center gap-2">
                {comment.author?.avatar_url ? (
                  <Image
                    src={comment.author.avatar_url}
                    alt={comment.author.alias}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full border-2 border-black object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-yellow-300 text-xs font-bold text-black">
                    {comment.author?.alias?.charAt(0)?.toUpperCase() ?? "A"}
                  </div>
                )}
                <p className="text-sm font-bold text-black">
                  {comment.author?.alias ?? "Anonim"}
                </p>
                <p className="text-xs text-black/70">
                  {formatStrToDateTime(comment.created_at, "dd MMM yyyy HH:mm")}
                </p>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm text-black">
                {comment.body}
              </p>

              <div className="mt-2 flex gap-3">
                {comment.is_mine ? (
                  <button
                    type="button"
                    onClick={() => removeComment(comment)}
                    className="text-xs font-bold text-danger underline"
                  >
                    Hapus
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openReport(comment)}
                    className="text-xs font-bold text-black underline"
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
          className="mt-3 w-full rounded-lg border-2 border-black bg-white py-2 text-sm font-bold text-black"
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
    </div>
  );
};

export default ThreadCommentList;
