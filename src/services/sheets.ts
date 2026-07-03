import type { RSVPFormData, RSVPResponse, GuestBookResponse } from "@/types";

export async function submitRSVP(data: RSVPFormData): Promise<RSVPResponse> {
  const response = await fetch("/api/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengirim RSVP");
  }

  return result;
}

export async function submitGuestBook(
  name: string,
  message: string
): Promise<RSVPResponse> {
  const response = await fetch("/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengirim ucapan");
  }

  return result;
}

export async function fetchGuestBook(): Promise<GuestBookResponse> {
  const response = await fetch("/api/guestbook", { method: "GET" });

  if (!response.ok) {
    return { success: false, messages: [] };
  }

  return response.json();
}
