"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SURAKARTA_TIME_ZONE = "Asia/Jakarta";

const PRAYERS = [
  { key: "fajr", label: "Subuh" },
  { key: "dhuhr", label: "Zuhur" },
  { key: "asr", label: "Asar" },
  { key: "maghrib", label: "Magrib" },
  { key: "isha", label: "Isya" },
] as const;

type PrayerKey = (typeof PRAYERS)[number]["key"];
type PrayerTimes = Record<PrayerKey, string>;

function getSurakartaMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SURAKARTA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return value("hour") * 60 + value("minute");
}

function getMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerTimesUnavailable, setPrayerTimesUnavailable] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const clock = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    async function loadPrayerTimes() {
      try {
        const response = await fetch("/api/prayer-times", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Prayer times are unavailable");
        }

        const data = (await response.json()) as { timings: PrayerTimes };
        setPrayerTimes(data.timings);
        setPrayerTimesUnavailable(false);
      } catch {
        setPrayerTimesUnavailable(true);
      }
    }

    void loadPrayerTimes();
    const refresh = window.setInterval(loadPrayerTimes, 30 * 60 * 1000);

    return () => window.clearInterval(refresh);
  }, []);

  const clockLabel = useMemo(
    () =>
      now
        ? new Intl.DateTimeFormat("id-ID", {
            timeZone: SURAKARTA_TIME_ZONE,
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
          }).format(now)
        : "--:--",
    [now],
  );

  const nextPrayer = useMemo(() => {
    if (!prayerTimes || !now) return null;

    const currentMinutes = getSurakartaMinutes(now);
    return (
      PRAYERS.find(({ key }) => getMinutes(prayerTimes[key]) > currentMinutes) ?? null
    );
  }, [now, prayerTimes]);

  async function sharePage() {
    const data = { title: "Yuk Ngaji Solo", url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Closing the native share sheet needs no UI response.
    }
  }

  return (
    <section className="yn-hero" aria-labelledby="yn-hero-title">
      <div className="yn-hero-announcement">
        <span className="yn-hero-clock">{clockLabel}</span>
        <span className="yn-hero-prayer" aria-live="polite">
          {nextPrayer && prayerTimes ? (
            <>
              Salat berikutnya di Surakarta <strong>{`${nextPrayer.label} ${prayerTimes[nextPrayer.key]} WIB`}</strong>
            </>
          ) : prayerTimes ? (
            <>Jadwal salat Surakarta hari ini telah selesai</>
          ) : prayerTimesUnavailable ? (
            <>Jadwal salat Surakarta belum tersedia</>
          ) : (
            <>Memuat jadwal salat Surakarta…</>
          )}
        </span>
        <button className="yn-hero-share" type="button" onClick={sharePage}>
          {copied ? "Copied!" : "Share"}
        </button>
      </div>

      <div className="yn-hero-photo">
        <div className="yn-hero-shade" aria-hidden="true" />
        <Link className="yn-hero-brand" href="/" aria-label="Yuk Ngaji Solo, halaman utama">
          <img src="/images/logo/yn_logo_w.png" alt="" />
        </Link>

        <div className="yn-hero-heading">
          <h1 id="yn-hero-title">Yuk Ngaji Solo</h1>
          <div className="yn-hero-actions">
            <a
              className="yn-hero-action yn-hero-action-whatsapp"
              href="https://api.whatsapp.com/send/?phone=%2B6281241000056&text=Assalamu'alaikum%2C%20saya%20ingin%20bergabung%20dengan%20Komunitas%20YN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={20} strokeWidth={1.8} aria-hidden="true" />
              Join Komunitas YN
            </a>
            <Link className="yn-hero-action yn-hero-action-circle" href="/events">
              Join Circle YN
            </Link>
          </div>
        </div>

        <p className="yn-hero-description">
          Komunitas ngaji terbesar di Solo. Jadwal kajian, event islami, dan silaturahmi.
        </p>

        {/* <Link className="yn-hero-donation" href="/donations" aria-label="Donasi Dakwah">
          <QRCodeSVG value="https://ynsolo.id/donations" size={112} />
          <span>Donasi Dakwah</span>
        </Link> */}
      </div>
    </section>
  );
}
