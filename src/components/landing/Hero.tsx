"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { FloatingNavBar } from "../FloatingNavBar/FloatingNavBar";

export default function Hero() {
  const [copied, setCopied] = useState(false);

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
        <span className="yn-hero-clock">01:35</span>
        <span className="yn-hero-prayer">
          Jadwal sholat dzuhur kota solo <strong>11:35</strong>
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
            <Link className="yn-hero-action yn-hero-action-circle" href="/community">
              Join Circle YN
            </Link>
          </div>
        </div>

        <p className="yn-hero-description">
          Komunitas ngaji terbesar di Solo. Jadwal kajian, event islami, dan silaturahmi.
        </p>

        <FloatingNavBar placement="hero" />

        <Link className="yn-hero-donation" href="/donations" aria-label="Donasi Dakwah">
          <QRCodeSVG value="https://ynsolo.id/donations" size={112} />
          <span>Donasi Dakwah</span>
        </Link>
      </div>
    </section>
  );
}
