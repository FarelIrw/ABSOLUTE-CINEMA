// FUNGSI TIRUAN (sementara) untuk alur auth, dipakai sambil menunggu
// Supabase dari Anggota 1/3. Data hanya hidup di memori (hilang saat app ditutup)
// dan TIDAK dikirim ke mana pun. Dipanggil oleh context/AuthContext.tsx, bukan
// langsung oleh layar.
//
// Padanan Supabase (untuk mengganti nanti):
//   restoreSession()  -> supabase.auth.getSession()      (membaca token dari SecureStore)
//   onAuthChange()    -> supabase.auth.onAuthStateChange()
//   signIn / signUp / signOut -> supabase.auth.signInWithPassword / signUp / signOut

export interface AuthUser {
  id: string;
  email: string;
  callsign: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

type AuthListener = (user: AuthUser | null) => void;

interface StoredAccount extends AuthUser {
  password: string; // hanya untuk tiruan; Supabase tidak menyimpan password seperti ini
}

const accounts: StoredAccount[] = [];
const listeners = new Set<AuthListener>();
let currentUser: AuthUser | null = null;

// Menyimulasikan jaringan yang lambat supaya loading state terlihat
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toUser(account: StoredAccount): AuthUser {
  return { id: account.id, email: account.email, callsign: account.callsign };
}

// Memberi tahu semua pelanggan bahwa status login berubah
function setCurrentUser(user: AuthUser | null) {
  currentUser = user;
  listeners.forEach((listener) => listener(user));
}

// Dipanggil sekali saat app dibuka: memulihkan sesi (tiruan: lambat sebentar)
export async function restoreSession(): Promise<AuthUser | null> {
  await delay(600);
  return currentUser;
}

// Berlangganan perubahan login/logout. Mengembalikan fungsi untuk berhenti berlangganan.
export function onAuthChange(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function signUp(
  email: string,
  password: string,
  callsign: string,
): Promise<AuthResult> {
  await delay(800);
  const key = email.toLowerCase();
  if (accounts.some((account) => account.email === key)) {
    return { user: null, error: "Email sudah terdaftar. Silakan masuk." };
  }
  const account: StoredAccount = {
    id: `stub-${accounts.length + 1}`,
    email: key,
    callsign,
    password,
  };
  accounts.push(account);
  setCurrentUser(toUser(account));
  return { user: currentUser, error: null };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  await delay(800);
  const key = email.toLowerCase();
  const account = accounts.find((a) => a.email === key && a.password === password);
  if (!account) {
    return { user: null, error: "Email atau kata sandi salah." };
  }
  setCurrentUser(toUser(account));
  return { user: currentUser, error: null };
}

export async function signOut(): Promise<void> {
  await delay(300);
  setCurrentUser(null);
}