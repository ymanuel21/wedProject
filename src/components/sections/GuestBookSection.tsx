"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { submitGuestBook, fetchGuestBook } from "@/services/sheets";
import type { GuestBookEntry } from "@/types";
import { Loader2, MessageCircle } from "lucide-react";

export default function GuestBookSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState<GuestBookEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGuestBook().then((data) => {
      if (data.success) setMessages(data.messages);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Nama dan ucapan wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      await submitGuestBook(name, message);
      setSubmitted(true);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <section className="py-24 px-6 bg-white">
        <div className="max-w-md mx-auto text-center">
          <MessageCircle size={40} className="text-rose-gold mx-auto mb-4" />
          <p className="font-serif text-xl text-charcoal">
            Terima kasih atas ucapan dan doanya!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto"
      >
        <p className="text-center text-rose-gold tracking-[0.2em] text-sm mb-4">
          BUKU TAMU
        </p>
        <h2 className="text-center font-serif text-3xl text-charcoal mb-12">
          Ucapan & Doa
        </h2>

        {messages.length > 0 && (
          <div className="mb-12 space-y-4 max-h-80 overflow-y-auto pr-2">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-4 border border-rose-gold/10"
              >
                <p className="font-medium text-sm text-charcoal">{msg.name}</p>
                <p className="text-sm text-charcoal/60 mt-1">{msg.message}</p>
              </motion.div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className="w-full px-4 py-3 rounded-xl border border-rose-gold/20 bg-white focus:outline-none focus:border-rose-gold/50 text-sm"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis ucapan dan doa..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl border border-rose-gold/20 bg-white focus:outline-none focus:border-rose-gold/50 text-sm resize-none"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-rose-gold hover:bg-rose-gold-dark text-white rounded-xl text-sm tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Kirim Ucapan
          </button>
        </form>
      </motion.div>
    </section>
  );
}
