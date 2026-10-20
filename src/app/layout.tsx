import type { Metadata } from "next";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import "./landing.css";
import AppProviders from "@/components/AppProviders";

export const metadata: Metadata = {
  metadataBase: new URL("https://ynsolo.id"),
  title: {
    default: "YukNgaji Solo — Teman untuk Tumbuh dan Bahagia Bersama",
    template: "%s | YukNgaji Solo",
  },
  description:
    "Komunitas dakwah pemuda di Solo untuk bertemu, belajar, bergerak, dan bertumbuh bersama.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
