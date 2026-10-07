"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { createThread } from "@/redux/slices/threadSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Batas yang sama dengan yang ditegakkan server; di sini hanya supaya anggota
// tahu batasnya sebelum menekan kirim, bukan sebagai pengganti validasi server.
const TITLE_MAX = 140;
const BODY_MAX = 5000;

/**
 * Form penulisan thread baru.
 *
 * Identitas penulis tidak pernah dikirim dari sini: server mengambilnya dari
 * token. Karena itu form ini hanya punya judul dan isi.
 */
const FormThread = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.thread.loading);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Masuk dulu untuk menulis thread");
      return;
    }
    if (title.trim().length < 3) {
      toast.info("Judul minimal 3 karakter");
      return;
    }
    if (body.trim().length === 0) {
      toast.info("Isi thread belum diisi");
      return;
    }

    try {
      const created = await dispatch(createThread({ title, body })).unwrap();
      setTitle("");
      setBody("");
      toast.success("Thread terbit");
      router.push(`/community/${created.public_id}`);
    } catch {
      // Galat sudah ditampilkan interceptor axios; form sengaja tidak
      // dikosongkan supaya isinya tidak hilang.
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom"
    >
      <h2 className="text-lg font-semibold text-black">Tulis thread</h2>
      <p className="mt-1 text-xs text-black">
        Namamu tampil sebagai alias komunitas, bukan nama akun. Bila belum
        punya alias, kirimanmu tampil sebagai &ldquo;Anonim&rdquo;.
      </p>

      <Label htmlFor="thread-title" className="mt-3 block text-black">
        Judul
      </Label>
      <Input
        id="thread-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={TITLE_MAX}
        placeholder="Judul thread"
        className="mt-1 h-11 rounded-lg border-2 border-black bg-white px-4 font-medium text-black dark:border-strokedark dark:bg-boxdark dark:text-white"
      />
      <p className="mt-1 text-right text-xs text-black/70">
        {title.length}/{TITLE_MAX}
      </p>

      <Label htmlFor="thread-body" className="mt-2 block text-black">
        Isi thread
      </Label>
      <textarea
        id="thread-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={BODY_MAX}
        rows={5}
        placeholder="Tulis isi thread…"
        className="mt-1 w-full rounded-lg border-2 border-black bg-white px-4 py-3 font-medium text-black outline-none transition focus:border-4 focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
      />
      <p className="mt-1 text-right text-xs text-black/70">
        {body.length}/{BODY_MAX}
      </p>

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-3 h-11 w-full rounded-md border-2 border-black p-2 disabled:opacity-50"
        style={{ boxShadow: "5px 5px 0px 0px #000000" }}
      >
        {isLoading ? "Mengirim…" : "Terbitkan"}
      </Button>
    </form>
  );
};

export default FormThread;
