"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitGuestBook } from "@/services/sheets";
import { Loader2, MessageCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface GuestBookMessage {
  timestamp: string;
  name: string;
  message: string;
}

interface PaginatedResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  messages: GuestBookMessage[];
}

export default function GuestBookSection() {
  const [name, setName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<GuestBookMessage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const LIMIT = 10;

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await fetch(`/api/guestbook?page=${p}&limit=${LIMIT}`);
      if (!res.ok) throw new Error("Failed");
      const data: PaginatedResponse = await res.json();
      setMessages(data.messages);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setHasPrev(data.hasPrevious);
      setHasNext(data.hasNext);
    } catch {
      setFetchError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim()) {
      setError("Nama dan ucapan wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      await submitGuestBook(name, messageText);
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto"
      >
        <p className="text-center text-rose-gold tracking-[0.2em] text-sm mb-4">
          BUKU TAMU
        </p>
        <h2 className="text-center font-serif text-3xl text-charcoal mb-12">
          Ucapan & Doa
        </h2>

        {/* Messages with pagination */}
        <div className="mb-8 min-h-[320px]">
          {fetchError ? (
            <div className="text-center py-12">
              <p className="text-charcoal/50 text-sm mb-3">Tidak dapat memuat ucapan.</p>
              <button
                onClick={() => fetchPage(page)}
                className="inline-flex items-center gap-2 text-rose-gold text-sm hover:text-rose-gold-dark"
              >
                <RefreshCw size={14} /> Coba lagi
              </button>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-rose-gold/40" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal/50 text-sm">
                Jadilah yang pertama meninggalkan ucapan ❤️
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {messages.map((msg, i) => (
                  <div
                    key={`${page}-${i}`}
                    className="bg-white rounded-xl p-4 border border-rose-gold/10"
                  >
                    <p className="font-medium text-sm text-charcoal">{msg.name}</p>
                    <p className="text-sm text-charcoal/60 mt-1">{msg.message}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Pagination controls */}
        {total > LIMIT && !fetchError && !loading && (
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={() => fetchPage(page - 1)}
              disabled={!hasPrev}
              aria-label="Halaman sebelumnya"
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-rose-gold/20 text-rose-gold hover:bg-rose-gold/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm text-charcoal/60 min-w-[80px] text-center tabular-nums">
              <span className="md:hidden">{page} / {totalPages}</span>
              <span className="hidden md:inline">Halaman {page} dari {totalPages}</span>
            </span>

            <button
              onClick={() => fetchPage(page + 1)}
              disabled={!hasNext}
              aria-label="Halaman berikutnya"
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-rose-gold/20 text-rose-gold hover:bg-rose-gold/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Submit form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className="w-full px-4 py-3 rounded-xl border border-rose-gold/20 bg-white focus:outline-none focus:border-rose-gold/50 text-sm"
          />
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
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
