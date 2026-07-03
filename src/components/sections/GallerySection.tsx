"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING_DATA } from "@/constants/wedding";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function GallerySection() {
  const { gallery } = WEDDING_DATA;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      setActiveIndex((prev) => {
        if (direction === "prev") return prev === 0 ? gallery.length - 1 : prev - 1;
        return prev === gallery.length - 1 ? 0 : prev + 1;
      });
    },
    [gallery.length]
  );

  return (
    <>
      <section id="gallery" className="py-24 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <p className="text-center text-rose-gold tracking-[0.2em] text-sm mb-4">
            GALERI
          </p>
          <h2 className="text-center font-serif text-3xl md:text-4xl text-charcoal mb-16">
            Momen Kami
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((photo, index) => (
              <motion.div
                key={photo.alt}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-[4/3] bg-rose-gold/10 relative">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white z-10"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>

            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 p-2"
              onClick={(e) => {
                e.stopPropagation();
                navigate("prev");
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>

            <div
              className="relative w-full max-w-4xl aspect-[4/3] mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery[activeIndex].src}
                alt={gallery[activeIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 p-2"
              onClick={(e) => {
                e.stopPropagation();
                navigate("next");
              }}
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-6 text-white/60 text-sm">
              {activeIndex + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
