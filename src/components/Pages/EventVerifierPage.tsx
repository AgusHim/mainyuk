"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifier_api } from "@/redux/api";
import { ResScanTicket } from "@/types/presence";
import { Scanner } from "@yudiel/react-qr-scanner";
import { CheckCircle2, LogOut, QrCode, Search, ShieldCheck, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type SessionInfo = { event_id: string; event_slug: string; event_name: string; expires_at: string };
type TicketRow = { public_id: string; name: string; email: string; phone: string; gender: string; ticket_name: string; checked_in: boolean; last_check_in_at?: string | null };
type TicketOption = { id: string; name: string };

const tokenKey = (slug: string) => `event-verifier:${slug}`;

const errorMessage = (error: any): string => error?.response?.data?.error ?? "Permintaan gagal. Silakan coba lagi.";

export default function EventVerifierPage({ slug }: { slug: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [search, setSearch] = useState("");
  const [ticketID, setTicketID] = useState("");
  const [ticketOptions, setTicketOptions] = useState<TicketOption[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [result, setResult] = useState<ResScanTicket | null>(null);
  const scanning = useRef(false);

  const headers = useCallback((value = token) => ({ Authorization: `Bearer ${value ?? ""}` }), [token]);

  useEffect(() => {
    const saved = sessionStorage.getItem(tokenKey(slug));
    if (!saved) {
      setLoading(false);
      return;
    }
    verifier_api.get(`/events/${slug}/session`, { headers: { Authorization: `Bearer ${saved}` } })
      .then((response) => {
        setToken(saved);
        setSession(response.data);
      })
      .catch(() => sessionStorage.removeItem(tokenKey(slug)))
      .finally(() => setLoading(false));
  }, [slug]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await verifier_api.post(`/events/${slug}/login`, { password });
      const nextToken = response.data.token as string;
      sessionStorage.setItem(tokenKey(slug), nextToken);
      setToken(nextToken);
      setSession(response.data);
      setPassword("");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(tokenKey(slug));
    setToken(null);
    setSession(null);
    setTickets([]);
    setResult(null);
  };

  const loadTickets = useCallback(async (query = search, selectedTicketID = ticketID) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await verifier_api.get(`/events/${slug}/tickets`, { params: { search: query, ticket_id: selectedTicketID || undefined }, headers: headers() });
      setTickets(response.data as TicketRow[]);
    } catch (error: any) {
      if (error?.response?.status === 401) logout();
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [headers, search, slug, ticketID, token]);

  const loadTicketOptions = useCallback(async () => {
    if (!token) return;
    try {
      const response = await verifier_api.get(`/events/${slug}/ticket-options`, { headers: headers() });
      setTicketOptions(response.data as TicketOption[]);
    } catch (error: any) {
      if (error?.response?.status === 401) logout();
      toast.error(errorMessage(error));
    }
  }, [headers, slug, token]);

  useEffect(() => {
    if (mode === "manual" && token) {
      loadTicketOptions();
      loadTickets("");
    }
  }, [mode, token]);

  const checkIn = async (publicID: string) => {
    if (!token || scanning.current) return;
    scanning.current = true;
    setLoading(true);
    try {
      const response = await verifier_api.post(`/events/${slug}/check-in`, { public_id: publicID }, { headers: headers() });
      const data = response.data as ResScanTicket;
      setResult(data);
      setTickets((current) => current.map((ticket) => ticket.public_id === publicID ? { ...ticket, checked_in: true } : ticket));
      toast.success(data.already_checked_in ? "Tiket sudah check-in hari ini" : "Check-in berhasil");
    } catch (error: any) {
      if (error?.response?.status === 401) logout();
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
      window.setTimeout(() => { scanning.current = false; }, 1200);
    }
  };

  if (loading && session == null && token == null) {
    return <main className="flex min-h-screen items-center justify-center bg-[var(--yn-background)]"><div className="size-10 animate-spin rounded-full border-4 border-[var(--yn-accent)] border-t-transparent" /></main>;
  }

  if (!token || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--yn-background)] px-5 py-12">
        <form onSubmit={login} className="w-full max-w-md rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-7 shadow-xl">
          <span className="flex size-12 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]"><ShieldCheck className="size-6" /></span>
          <h1 className="mt-5 text-2xl font-semibold text-[var(--yn-foreground)]">Login Verifikator Event</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--yn-muted)]">Masukkan password yang diberikan koordinator event. Akses ini tidak membutuhkan akun YukNgaji.</p>
          <label htmlFor="event-password" className="mt-6 block text-sm font-semibold text-[var(--yn-foreground)]">Password event</label>
          <Input id="event-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12" required minLength={8} />
          <Button type="submit" disabled={loading} className="mt-5 h-12 w-full rounded-full bg-[var(--yn-accent)] text-white">{loading ? "Memeriksa…" : "Masuk sebagai verifikator"}</Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--yn-background)] pb-20">
      <header className="border-b border-[var(--yn-border)] bg-[var(--yn-surface)]">
        <div className="yn-container flex items-center justify-between gap-4 py-4">
          <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-widest text-[var(--yn-accent)]">Verifikator</p><h1 className="truncate text-lg font-semibold text-[var(--yn-foreground)]">{session.event_name}</h1></div>
          <Button type="button" variant="outline" onClick={logout} className="shrink-0 rounded-full"><LogOut className="mr-2 size-4" /> Keluar</Button>
        </div>
      </header>

      <div className="yn-container max-w-4xl py-7">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--yn-surface-muted)] p-1.5">
          <button type="button" onClick={() => setMode("scan")} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${mode === "scan" ? "bg-[var(--yn-surface)] text-[var(--yn-foreground)] shadow-sm" : "text-[var(--yn-muted)]"}`}><QrCode className="size-4" /> Scan QR</button>
          <button type="button" onClick={() => setMode("manual")} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${mode === "manual" ? "bg-[var(--yn-surface)] text-[var(--yn-foreground)] shadow-sm" : "text-[var(--yn-muted)]"}`}><Users className="size-4" /> Verifikasi manual</button>
        </div>

        {mode === "scan" ? (
          <section className="mt-5 overflow-hidden rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-4 sm:p-6">
            <h2 className="font-semibold text-[var(--yn-foreground)]">Arahkan kamera ke QR tiket</h2>
            <p className="mt-1 text-sm text-[var(--yn-muted)]">Hanya tiket paid untuk event ini yang dapat diproses.</p>
            <div className="mt-4 max-h-[520px] overflow-hidden rounded-2xl bg-black">
              <Scanner scanDelay={1200} allowMultiple onScan={(values) => { if (values[0]?.rawValue) checkIn(values[0].rawValue); }} constraints={{ facingMode: "environment" }} />
            </div>
          </section>
        ) : (
          <section className="mt-5 rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-4 sm:p-6">
            <form onSubmit={(event) => { event.preventDefault(); loadTickets(search); }} className="flex flex-col gap-2 sm:flex-row">
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nama, email, no. HP, atau kode tiket" className="h-11 flex-1" />
              <select
                aria-label="Filter jenis tiket"
                value={ticketID}
                onChange={(event) => {
                  const nextTicketID = event.target.value;
                  setTicketID(nextTicketID);
                  loadTickets(search, nextTicketID);
                }}
                className="h-11 rounded-md border border-[var(--yn-border)] bg-[var(--yn-surface)] px-3 text-sm text-[var(--yn-foreground)] sm:w-52"
              >
                <option value="">Semua tiket</option>
                {ticketOptions.map((ticket) => <option key={ticket.id} value={ticket.id}>{ticket.name}</option>)}
              </select>
              <Button type="submit" disabled={loading} className="h-11 bg-[var(--yn-accent)] text-white"><Search className="mr-2 size-4" /> Cari peserta</Button>
            </form>
            <p className="mt-2 text-xs text-[var(--yn-muted)]">Maksimal 100 tiket paid ditampilkan.</p>
            <div className="mt-5 space-y-3">
              {tickets.map((ticket) => (
                <article key={ticket.public_id} className="flex flex-col gap-4 rounded-2xl border border-[var(--yn-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-[var(--yn-foreground)]">{ticket.name}</p>{ticket.checked_in && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Sudah check-in</span>}</div><p className="mt-1 truncate text-sm text-[var(--yn-muted)]">{ticket.ticket_name} · {ticket.public_id}</p><p className="mt-1 text-xs text-[var(--yn-muted)]">{ticket.email}{ticket.phone ? ` · ${ticket.phone}` : ""}</p></div>
                  <Button type="button" disabled={loading} onClick={() => checkIn(ticket.public_id)} className={ticket.checked_in ? "shrink-0 bg-[var(--yn-surface-muted)] text-[var(--yn-foreground)]" : "shrink-0 bg-[var(--yn-accent)] text-white"}>{ticket.checked_in ? "Lihat status" : "Check-in manual"}</Button>
                </article>
              ))}
              {!loading && tickets.length === 0 && <p className="py-8 text-center text-sm text-[var(--yn-muted)]">Tidak ada tiket paid yang cocok.</p>}
            </div>
          </section>
        )}

        {result && (
          <section className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-5 text-green-950">
            <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-6 shrink-0 text-green-600" /><div><h2 className="font-semibold">{result.already_checked_in ? "Sudah check-in hari ini" : "Check-in berhasil"}</h2><p className="mt-1 text-sm">{result.user_ticket.user_name} · {result.user_ticket.ticket?.name}</p><p className="mt-1 text-xs">Kode tiket: {result.user_ticket.public_id}</p></div></div>
          </section>
        )}
      </div>
    </main>
  );
}
