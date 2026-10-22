"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import Link from "next/link";
import { useState } from "react";
import {
  loginUser,
  postRequestOTP,
  postVerifyOTP,
  setEmail,
} from "@/redux/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { VerifyOTP } from "@/types/user";
import ButtonLoginGoogle from "../common/Button/ButtonLoginGoogle";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function SignOTPPage() {
  const router = useRouter();
  const query = useSearchParams();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);
  const loadingGoogle = useAppSelector((state) => state.auth.loadingGoogle);
  const loading = useAppSelector((state) => state.auth.loading);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  }); // Default to rear camera

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeEmail = async (event: any) => {
    event.preventDefault();
    dispatch(setEmail(null));
  };

  const handleRequestOTP = async (event: any) => {
    event.preventDefault();
    if (isValidEmail(formData.email) == false) {
      toast.info("Mohon masukan email yang valid");
      return;
    }
    var data = {
      email: formData.email,
    } as VerifyOTP;
    dispatch(postRequestOTP(data))
      .unwrap()
      .then((res: any) => {
        if (res != null) {
          if (res.success != null && res.success == true) {
            dispatch(setEmail(formData.email));
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleLoginOTP = async (event: any) => {
    event.preventDefault();
    var data = {
      email: formData.email,
      code: formData.otp,
    } as VerifyOTP;
    dispatch(postVerifyOTP(data))
      .unwrap()
      .then((res) => {
        if (res != null) {
          var redirectTo = query.get("redirectTo");
          if (redirectTo != null && redirectTo != undefined) {
            router.replace(redirectTo!);
            return;
          } else {
            router.replace("/events");
            return;
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <MainLayout nav={false}>
      <CommonHeader title="" brandLogo isShowBack={false} isShowTrailing={false} />
      <main className="min-h-[calc(100svh-4rem)] bg-[var(--yn-background)] py-8 sm:py-14">
        <div className="yn-container grid max-w-5xl overflow-hidden rounded-3xl border border-[var(--yn-border)] bg-[var(--yn-surface)] md:grid-cols-[0.9fr_1.1fr]">
          <aside className="hidden flex-col justify-between bg-[var(--yn-accent)] p-10 text-white md:flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">YukNgaji Solo</p>
              <h1 className="mt-5 max-w-sm text-4xl font-semibold leading-tight tracking-tight">Teman untuk tumbuh dan bahagia bersama.</h1>
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/80">Masuk untuk ikut event, berdiskusi, dan terhubung dengan teman-teman YukNgaji Solo.</p>
          </aside>
          <section className="p-6 sm:p-10 md:p-12">
            {email == null ? (
              <form onSubmit={handleRequestOTP} noValidate>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent)]">Selamat datang</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--yn-foreground)]">Masuk ke akunmu</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--yn-muted)]">Kami akan mengirim kode sekali pakai ke emailmu. Tidak perlu mengingat password.</p>

                <label htmlFor="email" className="mt-8 block text-sm font-semibold text-[var(--yn-foreground)]">Email</label>
                <input
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="nama@email.com"
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--yn-border)] bg-[var(--yn-surface)] px-4 text-[var(--yn-foreground)] outline-none transition placeholder:text-[var(--yn-muted)] focus:border-[var(--yn-accent)] focus:ring-2 focus:ring-[var(--yn-accent-soft)]"
                  required
                />
                <Button type="submit" disabled={loading} className="mt-5 h-12 w-full rounded-full bg-[var(--yn-accent)] text-white hover:bg-[var(--yn-accent-dark)] disabled:cursor-wait">
                  {loading ? "Mengirim kode…" : "Lanjut dengan email"}
                </Button>

                {!isWebView() ? <>
                  <div className="my-6 flex items-center gap-3" aria-hidden="true"><div className="h-px flex-1 bg-[var(--yn-border)]" /><span className="text-xs font-medium uppercase tracking-widest text-[var(--yn-muted)]">atau</span><div className="h-px flex-1 bg-[var(--yn-border)]" /></div>
                  {loadingGoogle ? <div className="mx-auto size-6 animate-spin rounded-full border-2 border-[var(--yn-accent)] border-t-transparent" aria-label="Memuat" /> : <ButtonLoginGoogle />}
                </> : null}
                <p className="mt-7 text-center text-xs leading-5 text-[var(--yn-muted)]">Dengan melanjutkan, kamu menyetujui penggunaan akun untuk aktivitas YukNgaji Solo.</p>
              </form>
            ) : (
              <form onSubmit={handleLoginOTP} noValidate>
                <button type="button" onClick={handleChangeEmail} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--yn-accent)] hover:underline">← Ganti email</button>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--yn-accent)]">Verifikasi email</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--yn-foreground)]">Masukkan kode OTP</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--yn-muted)]">Kami mengirim kode ke <span className="font-semibold text-[var(--yn-foreground)]">{email}</span>.</p>
                <label htmlFor="otp" className="mt-8 block text-sm font-semibold text-[var(--yn-foreground)]">Kode OTP</label>
                <input
                  id="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={8}
                  placeholder="Masukkan kode"
                  className="mt-2 h-14 w-full rounded-xl border border-[var(--yn-border)] bg-[var(--yn-surface)] px-4 text-center text-xl font-semibold tracking-[0.35em] text-[var(--yn-foreground)] outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-[var(--yn-muted)] focus:border-[var(--yn-accent)] focus:ring-2 focus:ring-[var(--yn-accent-soft)]"
                  required
                />
                <Button type="submit" disabled={loading} className="mt-5 h-12 w-full rounded-full bg-[var(--yn-accent)] text-white hover:bg-[var(--yn-accent-dark)] disabled:cursor-wait">
                  {loading ? "Memverifikasi…" : "Masuk"}
                </Button>
                <p className="mt-6 text-center text-sm text-[var(--yn-muted)]">Belum menerima kode? Periksa folder spam atau gunakan email lain.</p>
              </form>
            )}
            <Link href="/" className="mt-8 block text-center text-sm font-semibold text-[var(--yn-accent)] hover:underline">Kembali ke beranda</Link>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}

const isWebView = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();

  // Detect common blocked user agents for Google OAuth
  // Webviews and certain browsers that Google blocks
  const blockedAgents = [
    /fbav/i,         // Facebook app
    /instagram/i,    // Instagram in-app browser
    /line/i,         // LINE app browser
    /snapchat/i,     // Snapchat in-app browser
    /telegram/i,     // Telegram in-app browser
    /whatsapp/i,     // WhatsApp in-app browser
  ];

  return blockedAgents.some(agent => agent.test(userAgent));
};
