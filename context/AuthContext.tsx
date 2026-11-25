import { AuthError, Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState } from "react-native";
import { supabase } from "../lib/supabase";

// AuthContext global berbasis Supabase.
// Bentuk nilainya (session, user, loading, signIn, signUp, signOut) sama persis dengan
// versi tiruan sebelumnya, jadi layar sign-in, sign-up, profil, dan guard tidak perlu diubah.

export interface AuthUser {
  id: string;
  email: string;
  callsign: string; // disimpan di user_metadata saat sign-up
}

export interface AuthSession {
  user: AuthUser;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

interface AuthContextValue {
  session: AuthSession | null;
  user: AuthUser | null;
  loading: boolean; // true selama sesi dipulihkan saat app dibuka
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, callsign: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Ubah objek User milik Supabase menjadi AuthUser yang dipakai layar
function toAuthUser(user: User): AuthUser {
  const callsign = user.user_metadata?.callsign;
  return {
    id: user.id,
    email: user.email ?? "",
    callsign:
      typeof callsign === "string" && callsign !== ""
        ? callsign
        : (user.email?.split("@")[0] ?? "Pengguna"),
  };
}

// Pesan error Supabase (bahasa Inggris) -> pesan untuk pengguna (bahasa Indonesia)
function translateAuthError(error: AuthError): string {
  if (error.name === "AuthRetryableFetchError") {
    return "Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.";
  }

  switch (error.code) {
    case "invalid_credentials":
      return "Email atau kata sandi salah.";
    case "user_already_exists":
    case "email_exists":
      return "Email sudah terdaftar. Silakan masuk.";
    case "email_not_confirmed":
      return "Email belum dikonfirmasi. Cek kotak masuk emailmu.";
    case "weak_password":
      return "Kata sandi terlalu lemah. Gunakan kombinasi yang lebih kuat.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
    default:
      return "Terjadi kesalahan. Silakan coba lagi.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    // 1. Pulihkan sesi saat app dibuka (token dibaca dari SecureStore oleh client Supabase)
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!ignore) setSession(data.session);
      })
      .catch(() => {
        // Penyimpanan rusak/tidak terbaca: anggap belum login
        if (!ignore) setSession(null);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    // 2. Real-time: dengarkan login, logout, dan pembaruan token
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    // Cleanup: berhenti berlangganan saat provider dilepas
    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  // Perbarui token otomatis hanya ketika app sedang di layar (aturan untuk React Native)
  useEffect(() => {
    if (AppState.currentState === "active") {
      supabase.auth.startAutoRefresh();
    }

    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      appStateSubscription.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { user: null, error: translateAuthError(error) };
      // State session diperbarui oleh onAuthStateChange, bukan di sini
      return { user: data.user ? toAuthUser(data.user) : null, error: null };
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      callsign: string
    ): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { callsign } },
      });
      if (error) return { user: null, error: translateAuthError(error) };

      // Email yang sudah terdaftar (saat konfirmasi email aktif) tidak mengembalikan error,
      // tetapi daftar identities-nya kosong.
      if (data.user && data.user.identities?.length === 0) {
        return { user: null, error: "Email sudah terdaftar. Silakan masuk." };
      }

      // Jika "Confirm email" aktif di Supabase, pendaftaran berhasil tetapi belum ada sesi
      if (!data.session) {
        return {
          user: null,
          error: "Pendaftaran berhasil. Cek emailmu untuk konfirmasi, lalu masuk.",
        };
      }

      return { user: data.user ? toAuthUser(data.user) : null, error: null };
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    // Sesi lokal tetap dihapus walaupun permintaan ke server gagal, dan
    // onAuthStateChange akan memberi tahu guard bahwa session sudah null.
    await supabase.auth.signOut();
  }, []);

  const user = useMemo(() => (session ? toAuthUser(session.user) : null), [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session: user ? { user } : null,
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  }
  return context;
}