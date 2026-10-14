import Hero from "../landing/Hero";
import TemanBahagia from "../landing/TemanBahagia";
import EventsShowcase from "../landing/EventsShowcase";
import KegiatanBersama from "../landing/KegiatanBersama";
import LimitedMerch from "../landing/LimitedMerch";
import InvestasiAkhirat from "../landing/InvestasiAkhirat";
import Footer from "../landing/Footer";
import { FloatingNavBar } from "../FloatingNavBar/FloatingNavBar";

export default function IndexPage() {
  return (
    <>
      <div className="yn-landing min-h-screen w-full overflow-x-hidden">
        <main>
          <Hero />
          <TemanBahagia />
          <EventsShowcase />
          <KegiatanBersama />
          <LimitedMerch />
          <InvestasiAkhirat />
        </main>
        <Footer />
      </div>
      {/* Nav mengambang untuk seluruh halaman. Ditaruh di luar wrapper
          overflow-x-hidden supaya tidak ikut terpotong. Ruang bawah footer
          sudah disiapkan lewat pb-32. */}
      <FloatingNavBar />
    </>
  );
}
