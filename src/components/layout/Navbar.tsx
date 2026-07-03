"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";

const links = [
  { label: "Undangan", href: "#invitation" },
  { label: "Acara", href: "#events" },
  { label: "Cerita", href: "#story" },
  { label: "Galeri", href: "#gallery" },
  { label: "RSVP", href: "#rsvp" },
  { label: "Hadiah", href: "#gift" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [0, 0.95]);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => setScrolled(v > 50));
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      style={{ backgroundColor: bgOpacity }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-colors ${
        scrolled ? "border-b border-rose-gold/20 shadow-sm" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-serif text-rose-gold text-lg">
          <Heart size={16} className="fill-rose-gold" /> D & B
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-charcoal/70 hover:text-rose-gold transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden p-2 text-charcoal"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-cream border-t border-rose-gold/20"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-3 text-sm text-charcoal/70 hover:text-rose-gold hover:bg-rose-gold/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
