"use client";
import ThreadCard from "@/components/Card/ThreadCard";
import FormThread from "@/components/Form/FormThread";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import { getThreads } from "@/redux/slices/threadSlice";
import { ThreadSort } from "@/types/thread";
import Link from "next/link";
import { useEffect, useState } from "react";

const CommunityPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const threads = useAppSelector((state) => state.thread.threads);
  const hasMore = useAppSelector((state) => state.thread.threadsHasMore);
  const isLoading = useAppSelector((state) => state.thread.loading);
  const error = useAppSelector((state) => state.thread.error);
  const [sort, setSort] = useState<ThreadSort>("terbaru");
  const [page, setPage] = useState(1);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    setPage(1);
    dispatch(getThreads({ sort, page: 1 }));
  }, [dispatch, sort]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    dispatch(getThreads({ sort, page: next }));
  };

  return (
    <MainLayout>
      <CommonHeader title="Komunitas" isShowBack={true} isShowTrailing={false} />
      <div className="yn-container bg-yellow-400 p-4">
        <div className="mb-4 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
          <h1 className="text-lg font-semibold text-black">
            Ruang diskusi komunitas
          </h1>
          <p className="mt-1 text-sm text-black">
            Kiriman di sini memakai alias komunitas, bukan nama akun. Kami tidak
            menampilkan id akun, email, atau nomor telepon siapa pun.
          </p>
          <ul className="mt-2 list-disc pl-5 text-xs text-black">
            <li>Jaga adab: tidak menyerang pribadi, tidak menyebar hoaks.</li>
            <li>
              Dilarang judi, pinjaman ilegal, pornografi, dan penipuan. Konten
              semacam itu disembunyikan dan akunnya bisa dibatasi.
            </li>
            <li>
              Aktivitas seperti donasi anonim dan profil privat tidak pernah
              dibagikan otomatis ke feed.
            </li>
          </ul>
          <p className="mt-2 text-xs text-black">
            Aturan lengkap dan pengaturan berbagi aktivitas ada di{" "}
            <Link href="/profile/privacy" className="font-bold underline">
              pengaturan privasi
            </Link>
            .
          </p>
        </div>

        {user ? (
          isComposing ? (
            <div className="mb-4">
              <FormThread />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsComposing(true)}
              className="mb-4 w-full rounded-xl border-2 border-black bg-primary py-3 font-bold text-white shadow-custom"
            >
              Tulis thread
            </button>
          )
        ) : (
          <Link
            href="/signin?redirectTo=/community"
            className="mb-4 block w-full rounded-xl border-2 border-black bg-primary py-3 text-center font-bold text-white shadow-custom"
          >
            Masuk untuk menulis thread
          </Link>
        )}

        <div className="mb-3 flex gap-2">
          {(["terbaru", "populer"] as ThreadSort[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSort(option)}
              className={`rounded-full border-2 border-black px-4 py-1 text-sm font-bold ${
                sort === option
                  ? "bg-primary text-white"
                  : "bg-white text-black"
              }`}
            >
              {option === "terbaru" ? "Terbaru" : "Populer"}
            </button>
          ))}
        </div>

        {error != null ? (
          <div className="mb-4 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger">
            {error}
          </div>
        ) : null}

        {threads == null && isLoading ? (
          <p className="text-black">Memuat thread…</p>
        ) : threads != null && threads.length === 0 ? (
          <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
            <p className="text-black">
              Belum ada thread. Mulai percakapan pertama.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {threads?.map((thread) => (
              <ThreadCard key={thread.public_id} thread={thread} />
            ))}
          </div>
        )}

        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="mt-3 w-full rounded-lg border-2 border-black bg-white py-2 text-sm font-bold text-black disabled:opacity-50"
          >
            {isLoading ? "Memuat…" : "Muat thread lain"}
          </button>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
