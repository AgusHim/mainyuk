import Header from "../landing/Header";
import Hero from "../landing/Hero";
import TemanBahagia from "../landing/TemanBahagia";
import CommunityIntro from "../landing/CommunityIntro";
import Activities from "../landing/Activities";
import EventsSection from "../landing/EventsSection";
import Moments from "../landing/Moments";
import Support from "../landing/Support";
import FinalCTA from "../landing/FinalCTA";
import Footer from "../landing/Footer";
import { FloatingNavBar } from "../FloatingNavBar/FloatingNavBar";

export default function IndexPage() {
  return (
    <div className="yn-landing min-h-screen w-full overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <TemanBahagia />
        <CommunityIntro />
        <Activities />
        <EventsSection />
        <Moments />
        <Support />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingNavBar />
    </div>
  );
}
