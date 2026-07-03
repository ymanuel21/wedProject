import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import InvitationSection from "@/components/sections/InvitationSection";
import EventSection from "@/components/sections/EventSection";
import LoveStorySection from "@/components/sections/LoveStorySection";
import GallerySection from "@/components/sections/GallerySection";
import RSVPSection from "@/components/sections/RSVPSection";
import GuestBookSection from "@/components/sections/GuestBookSection";
import GiftSection from "@/components/sections/GiftSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <Suspense fallback={<div className="py-24 text-center text-charcoal/50">Memuat undangan...</div>}>
          <InvitationSection />
        </Suspense>
        <EventSection />
        <LoveStorySection />
        <GallerySection />
        <RSVPSection />
        <GuestBookSection />
        <GiftSection />
      </main>
      <Footer />
    </>
  );
}
