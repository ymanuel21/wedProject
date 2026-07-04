"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { WEDDING_DATA } from "@/constants/wedding";
import { useCountdown } from "@/hooks/useCountdown";
import { Heart } from "lucide-react";
export default function HeroSection() {
  const { couple, date, heroImage } = WEDDING_DATA;
  const { days, hours, minutes, seconds, isExpired } = useCountdown(date);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-gold/5 to-cream" />
      <Image
        src={heroImage}
        alt="Wedding venue with elegant floral decorations"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-20"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-rose-gold tracking-[0.3em] text-sm mb-6"
        >
          WEDDING INVITATION
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="font-serif text-5xl md:text-7xl text-charcoal mb-4 leading-tight"
        >
          {couple.bride.nickname}{" "}
          <span className="text-rose-gold">&</span>{" "}
          {couple.groom.nickname}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="flex items-center justify-center gap-6 mb-8"
        >
          <div className="h-px w-12 bg-rose-gold/40" />
          <Heart size={18} className="text-rose-gold fill-rose-gold" />
          <div className="h-px w-12 bg-rose-gold/40" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-charcoal/60 text-lg mb-10"
        >
          14 Maret 2027
        </motion.p>

        {!isExpired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex justify-center gap-4 md:gap-6 mb-10"
          >
            {[
              { value: days, label: "Hari" },
              { value: hours, label: "Jam" },
              { value: minutes, label: "Menit" },
              { value: seconds, label: "Detik" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] shadow-sm border border-rose-gold/10"
              >
                <div className="font-serif text-2xl md:text-3xl text-rose-gold tabular-nums">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-xs text-charcoal/50 mt-1 tracking-wide">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <a
            href="#invitation"
            className="inline-flex items-center gap-2 bg-rose-gold hover:bg-rose-gold-dark text-white px-8 py-3 rounded-full text-sm tracking-wide transition-all hover:shadow-lg hover:shadow-rose-gold/25"
          >
            Buka Undangan
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 border-2 border-rose-gold/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-rose-gold/40 rounded-full animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
