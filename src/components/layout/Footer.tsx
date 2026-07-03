"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WEDDING_DATA } from "@/constants/wedding";
import { Heart } from "lucide-react";

function CurrentYear() {
  // `new Date().getFullYear()` is deterministic and fast — safe to call during render.
  // The hydration risk is negligible (only on Dec 31 23:59:59).
  const [year] = useState(() => new Date().getFullYear());
  return <>{year}</>;
}

export default function Footer() {
  const { couple } = WEDDING_DATA;

  return (
    <footer className="py-16 px-6 bg-charcoal text-white/80">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-white/20" />
          <Heart size={16} className="text-rose-gold-light fill-rose-gold-light" />
          <div className="h-px w-12 bg-white/20" />
        </div>

        <h3 className="font-serif text-2xl text-white mb-2">
          {couple.bride.nickname} & {couple.groom.nickname}
        </h3>
        <p className="text-white/50 text-sm mb-8">
          Terima kasih atas doa dan kehadiran Anda.
        </p>

        <p className="text-white/30 text-xs">
          &copy; <CurrentYear /> — Dibuat dengan cinta ❤️
        </p>
      </motion.div>
    </footer>
  );
}
