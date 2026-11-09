"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { admin_api } from "@/redux/api";
import { Copy, KeyRound, Power, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Status = { configured: boolean; enabled: boolean; updated_at?: string };

export default function EventVerifierManager({ eventId, slug }: { eventId: string; slug: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const verifierPath = `/verifikator/${slug}`;

  const load = () => admin_api.get(`/events/${eventId}/verifier`).then((response) => setStatus(response.data));

  useEffect(() => {
    load().catch(() => setStatus({ configured: false, enabled: false }));
  }, [eventId]);

  const save = async () => {
    if (password.trim().length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }
    setLoading(true);
    try {
      const response = await admin_api.put(`/events/${eventId}/verifier`, { password: password.trim() });
      setStatus(response.data);
      setPassword("");
      toast.success(status?.configured ? "Password diganti dan seluruh sesi lama dicabut" : "Akses verifikator diaktifkan");
    } finally {
      setLoading(false);
    }
  };

  const disable = async () => {
    setLoading(true);
    try {
      await admin_api.delete(`/events/${eventId}/verifier`);
      setStatus((current) => ({ configured: current?.configured ?? true, enabled: false }));
      toast.success("Akses verifikator dinonaktifkan");
    } finally {
      setLoading(false);
    }
  };

  const copyURL = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${verifierPath}`);
    toast.success("Link verifikator disalin");
  };

  return (
    <section className="my-10 rounded-sm border-2 border-black bg-white p-5 shadow-bottom dark:bg-boxdark sm:p-7">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"><KeyRound className="size-5 text-primary" /></span>
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white">Akses verifikator event</h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">Bagikan satu link dan password kepada panitia. Aksesnya hanya berlaku untuk registrasi event ini.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-md border border-stroke p-4 dark:border-strokedark">
          <p className="text-sm font-semibold text-black dark:text-white">Status</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${status?.enabled ? "bg-success" : "bg-danger"}`} />
            <span className="text-sm text-black dark:text-white">{status == null ? "Memuat…" : status.enabled ? "Aktif" : "Tidak aktif"}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-md bg-gray-2 p-3 dark:bg-meta-4">
            <code className="min-w-0 flex-1 truncate text-xs text-black dark:text-white">{verifierPath}</code>
            <Button type="button" variant="outline" size="sm" onClick={copyURL}><Copy className="mr-1 size-3.5" /> Salin</Button>
          </div>
        </div>

        <div className="rounded-md border border-stroke p-4 dark:border-strokedark">
          <label htmlFor="verifier-password" className="text-sm font-semibold text-black dark:text-white">{status?.configured ? "Ganti password bersama" : "Buat password bersama"}</label>
          <p className="mt-1 text-xs text-black/60 dark:text-white/60">Minimal 8 karakter. Mengganti password otomatis mengeluarkan seluruh panitia yang sedang login.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input id="verifier-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password verifikator" className="border-2 border-black" />
            <Button type="button" disabled={loading} onClick={save} className="bg-primary text-white"><RefreshCw className="mr-2 size-4" /> {status?.configured ? "Ganti" : "Aktifkan"}</Button>
          </div>
          {status?.enabled && <Button type="button" variant="outline" disabled={loading} onClick={disable} className="mt-3 border-danger text-danger hover:bg-danger/10"><Power className="mr-2 size-4" /> Nonaktifkan akses</Button>}
        </div>
      </div>
    </section>
  );
}
