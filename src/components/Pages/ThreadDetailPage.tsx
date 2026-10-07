"use client";
import Dialog from "@/components/common/Dialog/Dialog";
import ReportDialog from "@/components/common/Dialog/ReportDialog";
import { CommonHeader } from "@/components/Header/CommonHeader";
import ThreadCommentList from "@/components/Thread/ThreadCommentList";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import {
  applyReaction,
  applyUnreact,
  createReport,
  deleteThread,
  getThreadDetail,
  reactToThread,
  removeThreadFromList,
  unreactToThread,
} from "@/redux/slices/threadSlice";
import { ReportReason, threadSourceLabel } from "@/types/thread";
import { formatStrToDateTime } from "@/utils/convert";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = {
  publicId: string;
};

const ThreadDetailPage = ({ publicId }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const thread = useAppSelector((state) => state.thread.thread);
  const isLoading = useAppSelector((state) => state.thread.loading);
  const error = useAppSelector((state) => state.thread.error);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dispatch(getThreadDetail(publicId));
  }, [dispatch, publicId]);

  const toggleReaction = async () => {
    if (!thread) {
      return;
    }
    if (!user) {
      toast.info("Masuk dulu untuk memberi reaksi");
      return;
    }
    if (thread.reacted) {
      dispatch(applyUnreact(thread.public_id));
      try {
        await dispatch(unreactToThread(thread.public_id)).unwrap();
      } catch {
        // Interceptor axios sudah menampilkan galatnya; muat ulang halaman
        // mengembalikan angka sebenarnya.
      }
      return;
    }
    dispatch(applyReaction(thread.public_id));
    try {
      await dispatch(reactToThread(thread.public_id)).unwrap();
    } catch {
      // Sama seperti di atas.
    }
  };

  const submitReport = async (reason: ReportReason, note: string) => {
    if (!thread) {
      return;
    }
    if (!user) {
      toast.info("Masuk dulu untuk melaporkan");
      return;
    }
    try {
      await dispatch(
        createReport({
          target_type: "thread",
          target_id: thread.public_id,
          reason,
          note: note.trim() === "" ? null : note,
        })
      ).unwrap();
      toast.success("Laporan diterima");
      dialogRef.current?.close();
    } catch {
      // Interceptor axios sudah menampilkan galatnya.
    }
  };

  const removeThread = async () => {
    if (!thread) {
      return;
    }
    try {
      await dispatch(deleteThread(thread.public_id)).unwrap();
      dispatch(removeThreadFromList(thread.public_id));
      toast.success("Thread dihapus");
      router.push("/community");
    } catch {
      // Interceptor axios sudah menampilkan galatnya.
    }
  };

  const sourceLabel = threadSourceLabel(thread?.source_type);

  return (
    <MainLayout>
      <CommonHeader
        title="Thread"
        isShowBack={true}
        isShowTrailing={false}
      />
      <div className="yn-container bg-yellow-400 p-4">
        {error != null && thread == null ? (
          <div
            role="alert"
            className="rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
          >
            {error}
          </div>
        ) : null}

        {thread == null ? (
          isLoading ? (
            <p className="text-black">Memuat thread…</p>
          ) : error == null ? (
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-6 shadow-custom">
              <p className="text-sm text-black">
                Thread tidak ditemukan atau sudah dihapus.
              </p>
            </div>
          ) : null
        ) : (
          <>
            <article className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <div className="flex items-center gap-2">
                {thread.author?.avatar_url ? (
                  <Image
                    src={thread.author.avatar_url}
                    alt={thread.author.alias}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border-2 border-black object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-sm font-bold text-black">
                    {thread.author?.alias?.charAt(0)?.toUpperCase() ?? "A"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-black">
                    {thread.author?.alias ?? "Anonim"}
                  </p>
                  <p className="text-xs text-black/70">
                    {formatStrToDateTime(thread.created_at, "dd MMM yyyy HH:mm")}
                  </p>
                </div>
                {sourceLabel ? (
                  <span className="ml-auto rounded-full border-2 border-black bg-white px-2 py-0.5 text-xs font-bold text-black">
                    {sourceLabel}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-3 text-xl font-semibold text-black">
                {thread.title}
              </h1>
              <p className="mt-2 whitespace-pre-wrap text-sm text-black">
                {thread.body}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={toggleReaction}
                  className={`h-10 rounded-md border-2 border-black px-4 ${
                    thread.reacted ? "bg-primary text-white" : "bg-white text-black"
                  }`}
                  style={{ boxShadow: "5px 5px 0px 0px #000000" }}
                >
                  {thread.reacted ? "Batal suka" : "Suka"} ·{" "}
                  {thread.reaction_count}
                </Button>

                {thread.is_mine ? (
                  <button
                    type="button"
                    onClick={removeThread}
                    className="text-sm font-bold text-danger underline"
                  >
                    Hapus thread
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        toast.info("Masuk dulu untuk melaporkan");
                        return;
                      }
                      dialogRef.current?.showModal();
                    }}
                    className="text-sm font-bold text-black underline"
                  >
                    Laporkan
                  </button>
                )}

                <Link
                  href="/community"
                  className="ml-auto text-sm font-bold text-black underline"
                >
                  Kembali ke feed
                </Link>
              </div>
            </article>

            <div className="mt-4">
              <ThreadCommentList threadPublicId={thread.public_id} />
            </div>
          </>
        )}

        <Dialog
          toggleDialog={() => {}}
          ref={dialogRef}
          title="Laporkan thread"
        >
          <ReportDialog
            targetLabel="thread ini"
            isLoading={isLoading}
            onConfirm={submitReport}
            onCancel={() => {
              dialogRef.current?.close();
            }}
          />
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ThreadDetailPage;
