"use client";

import { motion } from "framer-motion";
import { useGuestName } from "@/hooks/useGuestName";
import { WEDDING_DATA } from "@/constants/wedding";
import { Heart } from "lucide-react";

export default function InvitationSection() {
  const guest = useGuestName();
  const { couple } = WEDDING_DATA;

  return (
    <section id="invitation" className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <p className="text-rose-gold tracking-[0.2em] text-sm mb-4">DEAR</p>
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
          {guest.display}
        </h2>

        <div className="flex items-center justify-center gap-6 my-8">
          <div className="h-px flex-1 bg-rose-gold/20" />
          <Heart size={16} className="text-rose-gold fill-rose-gold shrink-0" />
          <div className="h-px flex-1 bg-rose-gold/20" />
        </div>

        <p className="text-charcoal/70 leading-relaxed text-lg mb-4">
          Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk
          menghadiri pernikahan kami:
        </p>

        <h3 className="font-serif text-2xl md:text-3xl text-charcoal mt-8 mb-2">
          {couple.bride.fullName}
        </h3>
        <p className="text-charcoal/50 text-sm mb-1">Putri dari Bpk. Ahmad & Ibu Siti</p>

        <p className="font-serif text-3xl text-rose-gold my-4">&</p>

        <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">
          {couple.groom.fullName}
        </h3>
        <p className="text-charcoal/50 text-sm">
          Putra dari Bpk. Manuel & Ibu Maria
        </p>
      </motion.div>
    </section>
  );
}
