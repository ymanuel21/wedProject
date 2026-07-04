"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { WEDDING_DATA } from "@/constants/wedding";
import { Heart } from "lucide-react";

export default function LoveStorySection() {
  const { loveStory } = WEDDING_DATA;

  return (
    <section id="story" className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <p className="text-center text-rose-gold tracking-[0.2em] text-sm mb-4">
          KISAH KAMI
        </p>
        <h2 className="text-center font-serif text-3xl md:text-4xl text-charcoal mb-16">
          Perjalanan Cinta
        </h2>

        <div className="relative">
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-rose-gold/20 md:-translate-x-px" />

          {loveStory.map((story, index) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`relative flex items-start gap-6 mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="absolute left-[14px] md:left-1/2 w-[11px] h-[11px] bg-rose-gold rounded-full -translate-x-[5.5px] mt-2 ring-4 ring-cream z-10" />

              <div
                className={`flex-1 md:w-1/2 ${
                  index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                }`}
              >
                <div className="bg-white rounded-2xl p-6 border border-rose-gold/10 shadow-sm ml-10 md:ml-0 overflow-hidden">
                  <div className="relative aspect-[4/3] mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-rose-gold">
                    <Heart size={12} className="fill-rose-gold" />
                    <span className="text-xs tracking-wide">{story.date}</span>
                  </div>
                  <h3 className="font-serif text-lg text-charcoal mb-2">
                    {story.title}
                  </h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed">
                    {story.description}
                  </p>
                </div>
              </div>

              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
