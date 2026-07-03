export interface GuestName {
  raw: string | null;
  display: string;
  hasName: boolean;
}

export interface RSVPFormData {
  name: string;
  phone: string;
  attendance: "hadir" | "tidak_hadir" | "ragu";
  guestCount: number;
  message: string;
}

export interface RSVPResponse {
  success: boolean;
  message: string;
}

export interface GuestBookEntry {
  timestamp: string;
  name: string;
  message: string;
}

export interface GuestBookResponse {
  success: boolean;
  messages: GuestBookEntry[];
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
