/**
 * Indonesian phone validation — shared across frontend, API, and GAS.
 * Sanitizes input, normalizes +62/62 → 08, requires 08 prefix, 10-15 digits,
 * rejects fake/repeated patterns.
 */

const PHONE_MIN = 10;
const PHONE_MAX = 15;

const FAKE_PATTERNS = [
  /^0+$/,
  /^08111111111+$/,
  /^08123456789+$/,
  /^08888888888+$/,
  /^08999999999+$/,
  /^(\d)\1{9,}$/,
];

export interface PhoneResult {
  valid: boolean;
  normalized: string;
  message: string;
}

export function sanitizePhone(raw: string): string {
  return String(raw || "")
    .replace(/[^\d+]/g, "")
    .trim();
}

export function normalizePhone(cleaned: string): string {
  let phone = cleaned;

  if (phone.startsWith("+62")) {
    phone = "0" + phone.slice(3);
  } else if (phone.startsWith("62") && phone.length >= 10) {
    phone = "0" + phone.slice(2);
  }

  return phone;
}

export function validatePhone(raw: string): PhoneResult {
  const cleaned = sanitizePhone(raw);

  if (!cleaned) {
    return { valid: false, normalized: "", message: "Nomor telepon wajib diisi." };
  }

  const normalized = normalizePhone(cleaned);

  if (!/^\d+$/.test(normalized)) {
    return {
      valid: false,
      normalized,
      message: "Nomor telepon hanya boleh berisi angka.",
    };
  }

  if (/^0+$/.test(normalized)) {
    return { valid: false, normalized, message: "Nomor telepon tidak valid." };
  }

  if (!normalized.startsWith("08")) {
    return {
      valid: false,
      normalized,
      message: "Nomor telepon harus diawali 08.",
    };
  }

  if (normalized.length < PHONE_MIN) {
    return {
      valid: false,
      normalized,
      message: `Nomor telepon minimal ${PHONE_MIN} digit.`,
    };
  }

  if (normalized.length > PHONE_MAX) {
    return {
      valid: false,
      normalized,
      message: `Nomor telepon maksimal ${PHONE_MAX} digit.`,
    };
  }

  for (const pattern of FAKE_PATTERNS) {
    if (pattern.test(normalized)) {
      return { valid: false, normalized, message: "Nomor telepon tidak valid." };
    }
  }

  return { valid: true, normalized, message: "" };
}
