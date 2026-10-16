import { NextResponse } from "next/server";

const SURAKARTA_TIME_ZONE = "Asia/Jakarta";

function getSurakartaDate() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SURAKARTA_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date());

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("day")}-${value("month")}-${value("year")}`;
}

function cleanTime(value: string) {
  return value.match(/^\d{2}:\d{2}/)?.[0] ?? value;
}

export async function GET() {
  const date = getSurakartaDate();
  const url = new URL(`https://api.aladhan.com/v1/timingsByCity/${date}`);

  url.searchParams.set("city", "Surakarta");
  url.searchParams.set("country", "Indonesia");
  url.searchParams.set("method", "20");
  url.searchParams.set("school", "0");
  url.searchParams.set("timezonestring", SURAKARTA_TIME_ZONE);

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 60 } });

    if (!response.ok) {
      throw new Error(`Prayer time service responded with ${response.status}`);
    }

    const payload = (await response.json()) as {
      data?: { timings?: Record<string, string> };
    };
    const timings = payload.data?.timings;

    if (!timings?.Fajr || !timings.Dhuhr || !timings.Asr || !timings.Maghrib || !timings.Isha) {
      throw new Error("Prayer time response is incomplete");
    }

    return NextResponse.json(
      {
        location: "Surakarta, Jawa Tengah",
        date,
        timings: {
          fajr: cleanTime(timings.Fajr),
          dhuhr: cleanTime(timings.Dhuhr),
          asr: cleanTime(timings.Asr),
          maghrib: cleanTime(timings.Maghrib),
          isha: cleanTime(timings.Isha),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Unable to retrieve Surakarta prayer times", error);

    return NextResponse.json(
      { error: "Jadwal salat Surakarta belum tersedia." },
      { status: 502 },
    );
  }
}
