"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { WEDDING_DATA } from "@/constants/wedding";
import { MapPin, Clock, Calendar } from "lucide-react";

export default function EventSection() {
  const { events } = WEDDING_DATA;

  return (
    <section id="events" className="py-24 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <p className="text-center text-rose-gold tracking-[0.2em] text-sm mb-4">
          ACARA
        </p>
        <h2 className="text-center font-serif text-3xl md:text-4xl text-charcoal mb-16">
          Rangkaian Acara
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[events.ceremony, events.reception].map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-cream rounded-2xl p-8 border border-rose-gold/10 hover:border-rose-gold/20 transition-colors overflow-hidden"
            >
              <div className="relative aspect-[4/3] mb-6 rounded-xl overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.venue}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <h3 className="font-serif text-xl text-rose-gold mb-6">
                {event.title}
              </h3>

              <div className="space-y-4 text-sm text-charcoal/70">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-rose-gold mt-0.5 shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-rose-gold mt-0.5 shrink-0" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-rose-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-charcoal">{event.venue}</div>
                    <div>{event.address}</div>
                  </div>
                </div>
              </div>

              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm text-rose-gold hover:text-rose-gold-dark transition-colors"
              >
                <MapPin size={14} /> Buka di Google Maps
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
