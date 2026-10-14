"use client";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getAdminInstagramPosts,
  setAdminPost,
  syncInstagramPosts,
} from "@/redux/slices/instagramSlice";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import FormInstagram from "../Form/FormInstagram";
import TableInstagram from "../Tables/TableInstagram";
import Dialog from "../common/Dialog/Dialog";
import DashboardLoader from "../common/Loader/DashboardLoader";

export default function DashboardInstagramPage() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.instagram.adminPosts);
  const isLoading = useAppSelector((state) => state.instagram.loading);
  const error = useAppSelector((state) => state.instagram.error);

  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [syncing, setSyncing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleOnDialog() {
    if (!dialogRef.current) {
      return;
    }
    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close();
      setDialogContent(null);
    } else {
      dialogRef.current.showModal();
    }
  }

  useEffect(() => {
    if (posts == null && !isLoading) {
      dispatch(getAdminInstagramPosts());
    }
  }, []);

  // Tanpa INSTAGRAM_ACCESS_TOKEN server menjawab 400 dan interceptor API sudah
  // menampilkan pesannya, jadi di sini cukup menandai tombolnya berhenti
  // berputar tanpa menambah toast kedua.
  const submitSync = () => {
    setSyncing(true);
    dispatch(syncInstagramPosts())
      .unwrap()
      .then((result) => {
        toast.success(
          `Sinkronisasi selesai: ${result.created} baru, ${result.updated} diperbarui, ${result.skipped} dilewati.`
        );
        dispatch(getAdminInstagramPosts());
      })
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      })
      .finally(() => setSyncing(false));
  };

  if (posts == null && isLoading) {
    return <DashboardLoader />;
  }

  return (
    <>
      {error != null ? (
        <div
          role="alert"
          className="mb-5 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
        >
          <span>{error}</span>
        </div>
      ) : (
        <div></div>
      )}
      <Breadcrumb pageName="Instagram" />

      <p className="mb-5 max-w-[640px] text-sm text-bodydark">
        Dinding komunitas di landing page. Postingan yang belum diterbitkan
        tidak tampil di sana. Sinkronisasi menarik postingan terbaru dari akun
        Instagram resmi; ia butuh token yang diisi di server — lihat{" "}
        <span className="font-medium text-black dark:text-white">
          docs/instagram-graph-api.md
        </span>
        .
      </p>

      <div className="mb-3 flex w-full flex-col justify-end gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={submitSync}
          disabled={syncing}
          className="inline-flex h-auto w-full items-center justify-center gap-2.5 rounded-lg border-2 border-black bg-meta-1 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-60 sm:w-50"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          {syncing ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-2.6-6.4" />
              <path d="M21 3v6h-6" />
            </svg>
          )}
          {syncing ? "Menyinkronkan…" : "Sync sekarang"}
        </Button>
        <button
          onClick={() => {
            dispatch(setAdminPost(null));
            setDialogContent(<FormInstagram toggleDialog={toggleOnDialog} />);
            toggleOnDialog();
          }}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-black bg-meta-3 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 sm:w-50"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          Tambah Postingan
        </button>
      </div>

      <div className="flex flex-col gap-10">
        <TableInstagram
          toggleDialog={toggleOnDialog}
          setDialogContent={() => {
            setDialogContent(<FormInstagram toggleDialog={toggleOnDialog} />);
          }}
        />
      </div>
      <Dialog toggleDialog={toggleOnDialog} ref={dialogRef}>
        {dialogContent}
      </Dialog>
    </>
  );
}
