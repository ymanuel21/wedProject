"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WEDDING_DATA } from "@/constants/wedding";
import { Copy, Check, Gift, MapPin, Building } from "lucide-react";
import Image from "next/image";

export default function GiftSection() {
  const { gift } = WEDDING_DATA;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyAccount = async (accountNumber: string, index: number) => {
    await navigator.clipboard.writeText(accountNumber);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="gift" className="py-24 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <p className="text-center text-rose-gold tracking-[0.2em] text-sm mb-4">
          HADIAH
        </p>
        <h2 className="text-center font-serif text-3xl md:text-4xl text-charcoal mb-4">
          Hadiah Pernikahan
        </h2>
        <p className="text-center text-charcoal/50 text-sm mb-12">
          Doa restu Anda adalah hadiah terbaik. Namun jika ingin memberi, berikut
          informasi rekening kami.
        </p>

        <div className="space-y-6">
          {gift.bankAccounts.map((account, index) => (
            <motion.div
              key={account.bank}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-cream rounded-2xl p-6 border border-rose-gold/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-charcoal/50 text-xs mb-1">
                    <Building size={12} /> {account.bank}
                  </div>
                  <div className="font-mono text-lg text-charcoal tracking-wide">
                    {account.accountNumber}
                  </div>
                  <div className="text-sm text-charcoal/60 mt-1">
                    a.n. {account.accountName}
                  </div>
                </div>
                <button
                  onClick={() => copyAccount(account.accountNumber, index)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-gold/20 text-rose-gold hover:bg-rose-gold/5 transition-colors text-sm shrink-0"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={14} /> Disalin
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Salin
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}

          {gift.qrisImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-cream rounded-2xl p-6 border border-rose-gold/10 text-center"
            >
              <p className="text-sm text-charcoal/60 mb-4">
                Scan QRIS untuk hadiah digital
              </p>
              <div className="relative w-48 h-48 mx-auto bg-white rounded-xl p-2">
                <Image
                  src={gift.qrisImage}
                  alt="QRIS Code"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}

          {gift.address && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-3 bg-cream rounded-2xl p-6 border border-rose-gold/10"
            >
              <Gift size={18} className="text-rose-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-charcoal mb-1">
                  Kirim Hadiah Fisik
                </p>
                <div className="flex items-start gap-2 text-sm text-charcoal/60">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  <span>{gift.address}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
