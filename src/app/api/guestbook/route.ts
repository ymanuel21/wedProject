import { NextResponse } from "next/server";

const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL || "";

export async function GET() {
  try {
    if (!GAS_URL) {
      return NextResponse.json({
        success: true,
        messages: [
          {
            timestamp: new Date().toISOString(),
            name: "Budi & Ani",
            message:
              "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
          },
          {
            timestamp: new Date().toISOString(),
            name: "Rina",
            message:
              "Happy wedding ya Dewi & Budi! God bless your marriage always.",
          },
        ],
      });
    }

    const response = await fetch(`${GAS_URL}?type=guestbook`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("[GuestBook API] GAS error:", response.status);
      return NextResponse.json({ success: false, messages: [] });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GuestBook API] Unexpected error:", error);
    return NextResponse.json({ success: false, messages: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !message) {
      return NextResponse.json(
        { success: false, message: "Nama dan ucapan wajib diisi." },
        { status: 400 }
      );
    }

    if (!GAS_URL) {
      console.log("[Mock API] GuestBook received:", name);
      return NextResponse.json({
        success: true,
        message: "Ucapan terkirim! (Mock)",
      });
    }

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "guestbook", name, message }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[GuestBook API] GAS error:", response.status, error);
      return NextResponse.json(
        { success: false, message: "Gagal mengirim ucapan. Silakan coba lagi." },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GuestBook API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
