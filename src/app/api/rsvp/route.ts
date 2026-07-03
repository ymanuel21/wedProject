import { NextResponse } from "next/server";
import type { RSVPFormData } from "@/types";

const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL || "";

export async function POST(request: Request) {
  try {
    const body: RSVPFormData = await request.json();

    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { success: false, message: "Nama dan nomor telepon wajib diisi." },
        { status: 400 }
      );
    }

    if (!GAS_URL) {
      console.log("[Mock API] RSVP received:", body.name);
      return NextResponse.json({
        success: true,
        message: "RSVP berhasil dikirim. Terima kasih! (Mock)",
      });
    }

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "rsvp", ...body }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[RSVP API] GAS error:", response.status, error);
      return NextResponse.json(
        { success: false, message: "Gagal mengirim RSVP. Silakan coba lagi." },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[RSVP API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
