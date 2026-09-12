import IndexPage from "@/components/Pages/IndexPage";
import { Metadata } from "next";
import "./landing.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ynsolo.id"),
  title: "YukNgaji Solo — Teman untuk Tumbuh dan Bahagia Bersama",
  description:
    "YukNgaji Solo adalah komunitas dakwah pemuda di Surakarta / Solo dan sekitarnya. Ruang bertemu, belajar, bergerak, dan bertumbuh bersama. #TemanBahagia",
  openGraph: {
    title: "YukNgaji Solo — Teman untuk Tumbuh dan Bahagia Bersama",
    description:
      "Komunitas dakwah pemuda Surakarta / Solo. Ruang bertemu, belajar, bergerak, dan bertumbuh bersama.",
    url: "https://ynsolo.id",
    siteName: "YukNgaji Solo",
    images: [
      {
        url: "https://i.ibb.co.com/dtcz1tw/teori-of-life-1.png",
        width: 1200,
        height: 630,
        alt: "Komunitas YukNgaji Solo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YukNgaji Solo — Teman untuk Tumbuh dan Bahagia Bersama",
    description:
      "Komunitas dakwah pemuda Surakarta / Solo. #TemanBahagia",
  },
};

export default function Index() {
  return <IndexPage />;
}
