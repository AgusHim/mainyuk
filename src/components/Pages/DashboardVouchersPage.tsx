"use client";

import { admin_api } from "@/redux/api";
import { formatRupiah } from "@/utils/currency";
import { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

type Voucher = {
  id: string; target_type: "event" | "shop"; target_id: string; code: string;
  discount_type: "fixed" | "percentage"; discount_value: number; max_discount: number;
  min_order_amount: number; usage_limit: number; usage_per_user: number; used_count: number;
  starts_at?: string | null; ends_at?: string | null; is_active: boolean;
};
type Form = Omit<Voucher, "id" | "used_count">;
const blank: Form = { target_type: "event", target_id: "", code: "", discount_type: "fixed", discount_value: 0, max_discount: 0, min_order_amount: 0, usage_limit: 0, usage_per_user: 1, starts_at: null, ends_at: null, is_active: true };
const toLocal = (value?: string | null) => value ? new Date(value).toISOString().slice(0, 16) : "";
const amount = (value: number) => new Intl.NumberFormat("id-ID").format(value || 0);

export default function DashboardVouchersPage() {
  const [items, setItems] = useState<Voucher[]>([]);
  const [form, setForm] = useState<Form>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = async () => { try { setLoading(true); const { data } = await admin_api.get("/vouchers"); setItems(data); } catch (e: any) { setError(e.response?.data?.error || "Voucher tidak dapat dimuat."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const set = (key: keyof Form, value: string | number | boolean | null) => setForm((current) => ({ ...current, [key]: value }));
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setError(null);
    const payload = { ...form, code: form.code.trim().toUpperCase(), starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null, ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null };
    try { editing ? await admin_api.put(`/vouchers/${editing}`, payload) : await admin_api.post("/vouchers", payload); setForm(blank); setEditing(null); await load(); }
    catch (e: any) { setError(e.response?.data?.error || "Voucher tidak dapat disimpan."); }
  };
  const edit = (v: Voucher) => { setEditing(v.id); setForm({ ...v, starts_at: toLocal(v.starts_at), ends_at: toLocal(v.ends_at) }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async (id: string) => { if (!window.confirm("Hapus voucher ini?")) return; try { await admin_api.delete(`/vouchers/${id}`); await load(); } catch (e: any) { setError(e.response?.data?.error || "Voucher tidak dapat dihapus."); } };
  return <>
    <Breadcrumb pageName="Voucher" />
    {error && <div role="alert" className="mb-5 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom">{error}</div>}
    <section className="mb-8 rounded-xl border-2 border-black bg-white p-5 shadow-bottom dark:bg-boxdark">
      <div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold text-black dark:text-white">{editing ? "Ubah voucher" : "Buat voucher"}</h3><p className="text-sm text-body dark:text-bodydark">Voucher bersifat generik: bisa untuk event sekarang dan shop nanti.</p></div>{editing && <button onClick={() => { setEditing(null); setForm(blank); }} className="text-sm font-medium underline">Batal ubah</button>}</div>
      <form onSubmit={save} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium">Kode<input required value={form.code} onChange={e => set("code", e.target.value)} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 uppercase dark:border-strokedark" placeholder="HEMAT10" /></label>
        <label className="text-sm font-medium">Target<select value={form.target_type} onChange={e => set("target_type", e.target.value)} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark"><option value="event">Event</option><option value="shop">Shop</option></select></label>
        <label className="text-sm font-medium">ID {form.target_type}<input required value={form.target_id} onChange={e => set("target_id", e.target.value)} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark" placeholder="ID event / shop" /></label>
        <label className="text-sm font-medium">Tipe diskon<select value={form.discount_type} onChange={e => set("discount_type", e.target.value)} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark"><option value="fixed">Nominal tetap</option><option value="percentage">Persentase</option></select></label>
        <label className="text-sm font-medium">Nilai {form.discount_type === "percentage" ? "(%)" : "(Rp)"}<input required min="1" type="number" value={form.discount_value} onChange={e => set("discount_value", Number(e.target.value))} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark" /></label>
        <label className="text-sm font-medium">Maks. potongan (Rp)<input min="0" type="number" value={form.max_discount} onChange={e => set("max_discount", Number(e.target.value))} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark" /></label>
        <label className="text-sm font-medium">Min. transaksi (Rp)<input min="0" type="number" value={form.min_order_amount} onChange={e => set("min_order_amount", Number(e.target.value))} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark" /></label>
        <label className="text-sm font-medium">Kuota total (0 = tanpa batas)<input min="0" type="number" value={form.usage_limit} onChange={e => set("usage_limit", Number(e.target.value))} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark" /></label>
        <label className="text-sm font-medium">Batas per pengguna (0 = tanpa batas)<input min="0" type="number" value={form.usage_per_user} onChange={e => set("usage_per_user", Number(e.target.value))} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark" /></label>
        <label className="text-sm font-medium">Mulai<input type="datetime-local" value={toLocal(form.starts_at)} onChange={e => set("starts_at", e.target.value || null)} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark" /></label>
        <label className="text-sm font-medium">Berakhir<input type="datetime-local" value={toLocal(form.ends_at)} onChange={e => set("ends_at", e.target.value || null)} className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 dark:border-strokedark" /></label>
        <label className="flex items-end gap-2 pb-2 text-sm font-medium"><input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} /> Aktifkan voucher</label>
        <div className="xl:col-span-4"><button className="rounded-lg border-2 border-black bg-primary px-5 py-2.5 font-medium text-white shadow-bottom">{editing ? "Simpan perubahan" : "Buat voucher"}</button></div>
      </form>
    </section>
    <section className="overflow-hidden rounded-xl border-2 border-black bg-white shadow-bottom dark:bg-boxdark"><div className="border-b border-stroke px-5 py-4 dark:border-strokedark"><h3 className="font-semibold text-black dark:text-white">Daftar voucher</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-gray-2 dark:bg-meta-4"><tr><th className="px-5 py-3">Kode</th><th>Target</th><th>Diskon</th><th>Ketentuan</th><th>Penggunaan</th><th>Status</th><th className="px-5">Aksi</th></tr></thead><tbody>{loading ? <tr><td className="px-5 py-6" colSpan={7}>Memuat voucher…</td></tr> : items.length === 0 ? <tr><td className="px-5 py-6 text-body" colSpan={7}>Belum ada voucher.</td></tr> : items.map(v => <tr className="border-t border-stroke dark:border-strokedark" key={v.id}><td className="px-5 py-4 font-semibold">{v.code}</td><td>{v.target_type}<span className="block max-w-35 truncate text-xs text-body">{v.target_id}</span></td><td>{v.discount_type === "percentage" ? `${v.discount_value}%` : formatRupiah(v.discount_value)}{v.max_discount > 0 && <span className="block text-xs text-body">maks. {formatRupiah(v.max_discount)}</span>}</td><td>min. {formatRupiah(v.min_order_amount)}<span className="block text-xs text-body">s/d {v.ends_at ? new Date(v.ends_at).toLocaleDateString("id-ID") : "tanpa akhir"}</span></td><td>{v.used_count} / {v.usage_limit || "∞"}</td><td><span className={v.is_active ? "text-success" : "text-danger"}>{v.is_active ? "Aktif" : "Nonaktif"}</span></td><td className="px-5"><div className="flex gap-3"><button onClick={() => edit(v)} className="font-medium text-primary">Ubah</button><button onClick={() => remove(v.id)} className="font-medium text-danger">Hapus</button></div></td></tr>)}</tbody></table></div></section>
  </>;
}
