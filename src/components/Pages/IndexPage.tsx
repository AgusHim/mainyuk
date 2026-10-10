import Hero from "../landing/Hero";
import TemanBahagia from "../landing/TemanBahagia";
import EventsShowcase from "../landing/EventsShowcase";
import Activities from "../landing/Activities";
import EventsSection from "../landing/EventsSection";
import Moments from "../landing/Moments";
import Support from "../landing/Support";
import FinalCTA from "../landing/FinalCTA";
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
          <Activities />
          <EventsSection />
          <Moments />
          <Support />
          <FinalCTA />
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
