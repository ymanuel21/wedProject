const PHONE_MIN = 10;
const PHONE_MAX = 15;

export interface PhoneValidation {
  valid: boolean;
  sanitized: string;
  message: string;
}

const INVALID_PREFIXES = ["000", "111", "222", "333", "444", "555", "666", "777", "888", "999"];

export function sanitizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

export function validatePhone(raw: string): PhoneValidation {
  const sanitized = sanitizePhone(raw);

  if (!sanitized) {
    return { valid: false, sanitized: "", message: "Nomor telepon wajib diisi." };
  }

  if (sanitized.length < PHONE_MIN) {
    return { valid: false, sanitized, message: `Nomor telepon minimal ${PHONE_MIN} digit.` };
  }

  if (sanitized.length > PHONE_MAX) {
    return { valid: false, sanitized, message: `Nomor telepon maksimal ${PHONE_MAX} digit.` };
  }

  if (!/^\d+$/.test(sanitized)) {
    return { valid: false, sanitized, message: "Nomor telepon hanya boleh berisi angka." };
  }

  if (/^0+$/.test(sanitized)) {
    return { valid: false, sanitized, message: "Nomor telepon tidak valid." };
  }

  for (const prefix of INVALID_PREFIXES) {
    if (sanitized.startsWith(prefix) && sanitized.length <= 10) {
      return { valid: false, sanitized, message: "Nomor telepon tidak valid." };
    }
  }

  return { valid: true, sanitized, message: "" };
}
