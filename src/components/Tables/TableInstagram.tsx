"use client";
import DashboardLoader from "../common/Loader/DashboardLoader";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  deleteInstagramPost,
  getAdminInstagramPosts,
  setAdminPost,
} from "@/redux/slices/instagramSlice";
import { mediaTypeLabel, sourceLabel } from "@/types/instagram";
import { formatStrToDateTime } from "@/utils/convert";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog/Dialog";

type Props = {
  toggleDialog: () => void;
  setDialogContent: () => void;
};

const TableInstagram: React.FC<Props> = ({ toggleDialog, setDialogContent }) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.instagram.adminPosts);
  const isLoading = useAppSelector((state) => state.instagram.loading);
  const error = useAppSelector((state) => state.instagram.error);

  const [dialogContent, setConfirmDialog] = useState<React.ReactNode>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleConfirmDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  const submitDelete = (id: string) => {
    dispatch(deleteInstagramPost(id))
      .unwrap()
      .then(() => toast.success("Postingan dihapus"))
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  if (posts == null && isLoading) {
    return <DashboardLoader />;
  }

  if (error != null) {
    return (
      <div
        role="alert"
        className="flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
      >
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mb-3">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[260px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Postingan
              </th>
              <th className="min-w-[110px] py-4 px-4 font-medium text-black dark:text-white">
                Sumber
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Jenis
              </th>
              <th className="min-w-[140px] py-4 px-4 font-medium text-black dark:text-white">
                Like / Komentar
              </th>
              <th className="min-w-[130px] py-4 px-4 font-medium text-black dark:text-white">
                Tanggal
              </th>
              <th className="min-w-[110px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && posts == null ? (
              <tr>
                <td
                  colSpan={7}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  Memuat…
                </td>
              </tr>
            ) : null}
            {!isLoading && posts != null && posts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  Belum ada postingan. Tambahkan manual, atau jalankan sinkronisasi.
                </td>
              </tr>
            ) : null}
            {posts?.map((post) => (
              <tr key={post.id}>
                <td className="border-b border-black py-3 px-2 pl-9 xl:pl-11">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-2 dark:bg-meta-4">
                      {post.media_url ? (
                        <Image
                          src={
                            post.media_type === "VIDEO"
                              ? post.thumbnail_url ?? post.media_url
                              : post.media_url
                          }
                          alt={`Postingan ${post.username}`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-medium text-black dark:text-white">
                        @{post.username}
                      </h5>
                      <p className="line-clamp-1 max-w-[220px] text-xs text-bodydark">
                        {post.caption ?? "Tanpa keterangan"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="badge badge-outline badge-primary font-bold">
                    {sourceLabel(post.source).toUpperCase()}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="text-black dark:text-white">
                    {mediaTypeLabel(post.media_type)}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  {/* Angka null berarti "tidak diketahui", bukan nol — jadi
                      ditampilkan sebagai tanda pisah, bukan 0. */}
                  <p className="text-black dark:text-white">
                    {post.like_count ?? "—"} / {post.comments_count ?? "—"}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="text-black dark:text-white">
                    {post.posted_at
                      ? formatStrToDateTime(post.posted_at, "dd MMM yyyy")
                      : "—"}
                  </p>
                  <p className="text-xs text-bodydark">
                    urutan {post.sort_order}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p
                    className={`font-bold ${
                      post.is_published ? "text-meta-3" : "text-bodydark"
                    }`}
                  >
                    {post.is_published ? "Terbit" : "Draf"}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <div className="flex items-center space-x-3.5">
                    <button
                      className="text-success"
                      onClick={() => {
                        dispatch(setAdminPost(post));
                        setDialogContent();
                        toggleDialog();
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} className="fill-black" />
                    </button>
                    <button
                      className="text-danger"
                      onClick={() => {
                        setConfirmDialog(
                          <ConfirmDialog
                            title={`@${post.username}`}
                            onConfirm={() => {
                              toggleConfirmDialog();
                              submitDelete(post.id);
                            }}
                            onCancel={toggleConfirmDialog}
                          />
                        );
                        toggleConfirmDialog();
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="fill-black" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog toggleDialog={toggleConfirmDialog} ref={dialogRef}>
          {dialogContent}
        </Dialog>
      </div>
    </div>
  );
};

interface ConfirmProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmProps> = ({
  title,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <h3 className="font-bold text-lg text-black dark:text-white">
        Konfirmasi hapus postingan
      </h3>
      <p className="py-4 text-black dark:text-white">
        Kamu yakin ingin menghapus postingan{" "}
        <span className="font-bold text-lg text-primary">{title}</span>? Tindakan
        ini tidak menghapus apa pun di Instagram, hanya dari dinding komunitas.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          onClick={onConfirm}
          className="h-10 border-2 border-black bg-danger text-white hover:bg-danger/80"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Hapus
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="h-10 border-2 border-black bg-success text-white hover:bg-success/80"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Batal
        </Button>
      </div>
    </>
  );
};

export default TableInstagram;
