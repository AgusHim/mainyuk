import Hero from "../landing/Hero";
import TemanBahagia from "../landing/TemanBahagia";
import EventsShowcase from "../landing/EventsShowcase";
import Activities from "../landing/Activities";
import EventsSection from "../landing/EventsSection";
import Moments from "../landing/Moments";
import Support from "../landing/Support";
import FinalCTA from "../landing/FinalCTA";
import Footer from "../landing/Footer";

export default function IndexPage() {
  return (
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
  );
}
