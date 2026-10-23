"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { createThread } from "@/redux/slices/threadSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Batas yang sama dengan yang ditegakkan server; di sini hanya supaya anggota
// tahu batasnya sebelum menekan kirim, bukan sebagai pengganti validasi server.
const BODY_MAX = 5000;

/**
 * Form penulisan thread baru.
 *
 * Identitas penulis tidak pernah dikirim dari sini: server mengambilnya dari
 * token. Karena itu form ini hanya punya judul dan isi.
 */
type Props = {
  onCancel?: () => void;
};

const FormThread = ({ onCancel }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.thread.loading);
  const [body, setBody] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Masuk dulu untuk menulis thread");
      return;
    }
    if (body.trim().length === 0) {
      toast.info("Kiriman belum diisi");
      return;
    }

    try {
      const created = await dispatch(createThread({ title: "", body })).unwrap();
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
      className="bg-[var(--yn-surface-muted)] p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.025em] text-[var(--yn-foreground)]">Tulis thread</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--yn-muted)]">
        Namamu tampil sebagai alias komunitas, bukan nama akun. Bila belum
        punya alias, kirimanmu tampil sebagai &ldquo;Anonim&rdquo;.
          </p>
        </div>
        {onCancel ? <button type="button" onClick={onCancel} className="text-sm font-semibold text-[var(--yn-muted)] underline underline-offset-4 hover:text-[var(--yn-foreground)]">Batal</button> : null}
      </div>

      <Label htmlFor="thread-body" className="mt-5 block text-[var(--yn-foreground)]">
        Kiriman
      </Label>
      <textarea
        id="thread-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={BODY_MAX}
        rows={5}
        placeholder="Tulis isi thread…"
        className="mt-1 w-full rounded-none border border-[var(--yn-border)] bg-[var(--yn-surface)] px-4 py-3 font-medium text-[var(--yn-foreground)] outline-none transition focus:border-[var(--yn-accent)] focus:ring-1 focus:ring-[var(--yn-accent)]"
      />
      <p className="mt-1 text-right text-xs text-[var(--yn-muted)]">
        {body.length}/{BODY_MAX}
      </p>

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-5 h-11 w-full rounded-none bg-[var(--yn-accent)] p-2 text-white hover:bg-[var(--yn-accent-dark)] disabled:opacity-50"
      >
        {isLoading ? "Mengirim…" : "Terbitkan"}
      </Button>
    </form>
  );
};

export default FormThread;
