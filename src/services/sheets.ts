import type { RSVPFormData, RSVPResponse, GuestBookResponse } from "@/types";

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL || "";

function isMockMode(): boolean {
  return !SCRIPT_URL;
}

function mockDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitRSVP(data: RSVPFormData): Promise<RSVPResponse> {
  if (isMockMode()) {
    await mockDelay();
    console.log("[Mock RSVP]", data);
    return { success: true, message: "RSVP berhasil dikirim. Terima kasih! (Mock)" };
  }

  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "rsvp", ...data }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || "Failed to submit RSVP");
  }

  return response.json();
}

export async function submitGuestBook(
  name: string,
  message: string
): Promise<RSVPResponse> {
  if (isMockMode()) {
    await mockDelay();
    console.log("[Mock GuestBook]", { name, message });
    return { success: true, message: "Ucapan terkirim! (Mock)" };
  }

  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "guestbook", name, message }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || "Failed to submit message");
  }

  return response.json();
}

export async function fetchGuestBook(): Promise<GuestBookResponse> {
  if (isMockMode()) {
    return {
      success: true,
      messages: [
        {
          timestamp: new Date().toISOString(),
          name: "Budi & Ani",
          message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
        },
        {
          timestamp: new Date().toISOString(),
          name: "Rina",
          message: "Happy wedding ya Dewi & Budi! God bless your marriage always.",
        },
      ],
    };
  }

  const response = await fetch(`${SCRIPT_URL}?type=guestbook`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return { success: false, messages: [] };
  }

  return response.json();
}
