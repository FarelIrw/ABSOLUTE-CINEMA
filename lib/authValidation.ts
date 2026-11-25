// Validasi form auth (Modul 4, bagian 3.2). Setiap fungsi mengembalikan
// pesan error (string) bila tidak valid, atau null bila input sudah benar.

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_CALLSIGN_LENGTH = 3;
export const MAX_CALLSIGN_LENGTH = 20;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Panggil dengan email yang SUDAH di-trim (email.trim()) oleh pemanggil.
export function validateEmail(email: string): string | null {
  if (email === "") return "Email wajib diisi.";
  if (!EMAIL_PATTERN.test(email)) return "Format email tidak valid.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password === "") return "Kata sandi wajib diisi.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`;
  }
  return null;
}

// Panggil dengan nama panggilan yang SUDAH di-trim.
export function validateCallsign(callsign: string): string | null {
  if (callsign === "") return "Nama panggilan wajib diisi.";
  if (callsign.length < MIN_CALLSIGN_LENGTH) {
    return `Nama panggilan minimal ${MIN_CALLSIGN_LENGTH} karakter.`;
  }
  if (callsign.length > MAX_CALLSIGN_LENGTH) {
    return `Nama panggilan maksimal ${MAX_CALLSIGN_LENGTH} karakter.`;
  }
  return null;
}