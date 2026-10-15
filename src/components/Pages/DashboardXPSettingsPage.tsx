"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getXPRules, updateXPRule } from "@/redux/slices/gamificationSlice";
import { XPRule } from "@/types/gamification";
import { Award, CheckCircle2, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type RuleDraft = {
  xp: string;
  description: string;
  monthlyCap: string;
};

const ruleLabel: Record<string, string> = {
  profile_complete: "Profil lengkap",
  checkin: "Check-in event",
  donation: "Donasi terkonfirmasi",
  shop_order: "Pesanan shop terkonfirmasi",
};

const ruleHint: Record<string, string> = {
  profile_complete: "Diberikan sekali setelah data profil anggota lengkap.",
  checkin: "Diberikan sekali kepada peserta terverifikasi pada setiap event.",
  donation: "Diberikan ketika donasi selesai diverifikasi.",
  shop_order: "Diberikan ketika pembayaran pesanan merchandise dikonfirmasi.",
};

const toDraft = (rule: XPRule): RuleDraft => ({
  xp: String(rule.xp),
  description: rule.description ?? "",
  monthlyCap: rule.monthly_cap == null ? "" : String(rule.monthly_cap),
});

export default function DashboardXPSettingsPage() {
  const dispatch = useAppDispatch();
  const rules = useAppSelector((state) => state.gamification.xpRules);
  const isLoading = useAppSelector((state) => state.gamification.loading);
  const error = useAppSelector((state) => state.gamification.error);
  const [drafts, setDrafts] = useState<Record<string, RuleDraft>>({});
  const [savingSource, setSavingSource] = useState<string | null>(null);

  useEffect(() => {
    if (rules == null) void dispatch(getXPRules());
  }, [dispatch, rules]);

  useEffect(() => {
    if (!rules) return;
    setDrafts(Object.fromEntries(rules.map((rule) => [rule.source_type, toDraft(rule)])));
  }, [rules]);

  const updateDraft = (
    sourceType: string,
    field: keyof RuleDraft,
    value: string
  ) => {
    setDrafts((current) => ({
      ...current,
      [sourceType]: {
        ...(current[sourceType] ?? { xp: "", description: "", monthlyCap: "" }),
        [field]: value,
      },
    }));
  };

  const saveRule = async (rule: XPRule) => {
    const draft = drafts[rule.source_type] ?? toDraft(rule);
    const xp = Number(draft.xp);
    const monthlyCap = draft.monthlyCap.trim() === "" ? null : Number(draft.monthlyCap);

    if (!Number.isInteger(xp) || xp <= 0) {
      toast.error("XP harus berupa bilangan bulat lebih dari 0.");
      return;
    }
    if (monthlyCap != null && (!Number.isInteger(monthlyCap) || monthlyCap <= 0)) {
      toast.error("Batas bulanan harus berupa bilangan bulat lebih dari 0.");
      return;
    }

    setSavingSource(rule.source_type);
    try {
      await dispatch(
        updateXPRule({
          source_type: rule.source_type,
          data: {
            xp,
            description: draft.description.trim() || null,
            monthly_cap: monthlyCap,
          },
        })
      ).unwrap();
      toast.success(`Aturan ${ruleLabel[rule.source_type] ?? rule.source_type} diperbarui.`);
    } catch {
      toast.error("Aturan XP belum berhasil disimpan.");
    } finally {
      setSavingSource(null);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Pengaturan XP" />

      <section className="mb-6 rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 text-[var(--yn-foreground)] shadow-sm sm:p-7">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--yn-accent-soft)] text-[var(--yn-accent-dark)]">
            <Award aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--yn-accent-dark)]">
              Gamification
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Aturan reward XP</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--yn-muted)]">
              Tentukan XP untuk aktivitas yang telah diverifikasi. Perubahan berlaku untuk reward berikutnya dan tidak mengubah riwayat XP yang sudah tercatat.
            </p>
          </div>
        </div>
      </section>

      {error && rules == null ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>Aturan XP belum dapat dimuat.</p>
          <button type="button" onClick={() => dispatch(getXPRules())} className="mt-3 inline-flex items-center gap-2 font-semibold underline">
            <RefreshCw aria-hidden="true" className="size-4" />
            Coba lagi
          </button>
        </div>
      ) : rules == null ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl bg-[var(--yn-surface-muted)]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {rules.map((rule) => {
            const draft = drafts[rule.source_type] ?? toDraft(rule);
            const isSaving = savingSource === rule.source_type;
            const isMission = rule.source_type === "mission";
            return (
              <article key={rule.id} className="rounded-2xl border border-[var(--yn-border)] bg-[var(--yn-surface)] p-5 text-[var(--yn-foreground)] shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {ruleLabel[rule.source_type] ?? rule.source_type}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-[var(--yn-muted)]">
                      {ruleHint[rule.source_type] ?? "Reward diberikan setelah aktivitas tervalidasi."}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--yn-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--yn-accent-dark)]">
                    <CheckCircle2 aria-hidden="true" className="size-3.5" />
                    Aktif
                  </span>
                </div>

                {isMission ? (
                  <p className="mt-5 rounded-xl bg-[var(--yn-surface-muted)] p-4 text-sm leading-6 text-[var(--yn-muted)]">
                    Reward misi diatur pada setiap misi secara terpisah.
                  </p>
                ) : (
                  <div className="mt-5 grid gap-4">
                    <label className="text-sm font-medium">
                      Reward XP
                      <input
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        value={draft.xp}
                        onChange={(event) => updateDraft(rule.source_type, "xp", event.target.value)}
                        className="mt-2 h-11 w-full rounded-xl border border-[var(--yn-border)] bg-[var(--yn-background)] px-3 text-[var(--yn-foreground)] outline-none transition focus:border-[var(--yn-accent)] focus:ring-2 focus:ring-[var(--yn-accent-soft)]"
                      />
                    </label>

                    <label className="text-sm font-medium">
                      Deskripsi untuk pengurus
                      <input
                        type="text"
                        value={draft.description}
                        onChange={(event) => updateDraft(rule.source_type, "description", event.target.value)}
                        maxLength={250}
                        className="mt-2 h-11 w-full rounded-xl border border-[var(--yn-border)] bg-[var(--yn-background)] px-3 text-[var(--yn-foreground)] outline-none transition focus:border-[var(--yn-accent)] focus:ring-2 focus:ring-[var(--yn-accent-soft)]"
                      />
                    </label>

                    <label className="text-sm font-medium">
                      Batas reward per bulan
                      <input
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        value={draft.monthlyCap}
                        onChange={(event) => updateDraft(rule.source_type, "monthlyCap", event.target.value)}
                        placeholder="Tanpa batas"
                        className="mt-2 h-11 w-full rounded-xl border border-[var(--yn-border)] bg-[var(--yn-background)] px-3 text-[var(--yn-foreground)] outline-none transition placeholder:text-[var(--yn-muted)] focus:border-[var(--yn-accent)] focus:ring-2 focus:ring-[var(--yn-accent-soft)]"
                      />
                      <span className="mt-1.5 block text-xs font-normal leading-5 text-[var(--yn-muted)]">
                        Kosongkan untuk tanpa batas. Batas dihitung sebagai jumlah reward, bukan total XP.
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => void saveRule(rule)}
                      disabled={isSaving || isLoading}
                      className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-[var(--yn-accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--yn-accent-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? <RefreshCw aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" className="size-4" />}
                      {isSaving ? "Menyimpan…" : "Simpan aturan"}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 rounded-2xl bg-[var(--yn-accent-soft)] p-4 text-sm leading-6 text-[var(--yn-accent-dark)]">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        Check-in hanya memberi reward sekali untuk akun peserta terverifikasi pada satu event. Pemindaian ulang tidak menambah XP.
      </p>
    </>
  );
}
