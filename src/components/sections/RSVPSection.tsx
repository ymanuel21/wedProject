"use client";

import { useState, type FormEvent, useCallback } from "react";
import { motion } from "framer-motion";
import { submitRSVP } from "@/services/sheets";
import type { RSVPFormData } from "@/types";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { validatePhone, sanitizePhone } from "@/lib/phone-validation";

const initialForm: RSVPFormData = {
  name: "",
  phone: "",
  attendance: "hadir",
  guestCount: 1,
  message: "",
};

export default function RSVPSection() {
  const [form, setForm] = useState<RSVPFormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const handlePhoneChange = useCallback((raw: string) => {
    // Allow typing: strip non-digits but keep cursor-friendly chars
    const filtered = raw.replace(/[^\d\s\-+]/g, "");
    updateField("phone", filtered);

    if (phoneTouched || filtered.length >= 10) {
      const result = validatePhone(filtered);
      setPhoneError(result.valid ? "" : result.message);
    }
  }, [phoneTouched]);

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    const result = validatePhone(form.phone);
    setPhoneError(result.valid ? "" : result.message);
  };

  const isFormValid = form.name.trim().length > 0 && !phoneError && form.phone.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const phoneResult = validatePhone(form.phone);
    if (!phoneResult.valid) {
      setPhoneError(phoneResult.message);
      return;
    }

    if (!form.name.trim()) {
      setStatus("error");
      setErrorMessage("Nama wajib diisi.");
      return;
    }

    setStatus("loading");
    try {
      await submitRSVP({ ...form, phone: phoneResult.sanitized });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Gagal mengirim RSVP");
    }
  };

  const updateField = <K extends keyof RSVPFormData>(
    key: K,
    value: RSVPFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status !== "idle") setStatus("idle");
  };

  if (status === "success") {
    return (
      <section id="rsvp" className="py-24 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-charcoal mb-2">Terima Kasih!</h2>
          <p className="text-charcoal/60">
            RSVP Anda telah kami terima. Sampai jumpa di hari bahagia kami!
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-24 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto"
      >
        <p className="text-center text-rose-gold tracking-[0.2em] text-sm mb-4">
          RSVP
        </p>
        <h2 className="text-center font-serif text-3xl md:text-4xl text-charcoal mb-4">
          Konfirmasi Kehadiran
        </h2>
        <p className="text-center text-charcoal/50 text-sm mb-12">
          Mohon konfirmasi kehadiran Anda sebelum 1 Maret 2027
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-charcoal/70 mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Nama Anda"
              className="w-full px-4 py-3 rounded-xl border border-rose-gold/20 bg-cream focus:outline-none focus:border-rose-gold/50 transition-colors text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-charcoal/70 mb-2">Nomor Telepon</label>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={handlePhoneBlur}
              placeholder="081234567890"
              className={`w-full px-4 py-3 rounded-xl border bg-cream focus:outline-none transition-colors text-sm ${
                phoneError ? "border-red-300 focus:border-red-400" : "border-rose-gold/20 focus:border-rose-gold/50"
              }`}
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? "phone-error" : undefined}
            />
            {phoneError && (
              <p id="phone-error" className="text-red-500 text-xs mt-1.5">{phoneError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-charcoal/70 mb-3">Kehadiran</label>
            <div className="flex gap-3">
              {[
                { value: "hadir", label: "Hadir" },
                { value: "tidak_hadir", label: "Tidak Hadir" },
                { value: "ragu", label: "Ragu" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField("attendance", option.value as RSVPFormData["attendance"])}
                  className={`flex-1 py-3 rounded-xl border text-sm transition-all ${
                    form.attendance === option.value
                      ? "border-rose-gold bg-rose-gold/5 text-rose-gold"
                      : "border-rose-gold/20 text-charcoal/60 hover:border-rose-gold/30"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-charcoal/70 mb-2">Jumlah Tamu</label>
            <select
              value={form.guestCount}
              onChange={(e) => updateField("guestCount", Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-rose-gold/20 bg-cream focus:outline-none focus:border-rose-gold/50 transition-colors text-sm appearance-none"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} orang
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-charcoal/70 mb-2">
              Ucapan & Doa <span className="text-charcoal/30">(opsional)</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Tulis ucapan atau doa untuk kedua mempelai..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-rose-gold/20 bg-cream focus:outline-none focus:border-rose-gold/50 transition-colors text-sm resize-none"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle size={14} /> {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading" || !isFormValid}
            className="w-full py-4 bg-rose-gold hover:bg-rose-gold-dark text-white rounded-xl font-medium tracking-wide transition-all hover:shadow-lg hover:shadow-rose-gold/25 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : null}
            {status === "loading" ? "Mengirim..." : "Kirim RSVP"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
