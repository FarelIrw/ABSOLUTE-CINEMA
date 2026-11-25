import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  AuthResult,
  AuthUser,
  onAuthChange,
  restoreSession,
  signIn as stubSignIn,
  signOut as stubSignOut,
  signUp as stubSignUp,
} from "../lib/authStub";

// PERCOBAAN (sementara): AuthContext berbasis fungsi tiruan supaya alur guard bisa dites.
// Bentuk nilainya (session, user, loading, signIn, signUp, signOut) mengikuti rencana
// Anggota 3. Saat versi Supabase siap, file ini diganti dan layar tidak perlu diubah.

export interface AuthSession {
  user: AuthUser;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    // 1. Pulihkan sesi saat app dibuka (Supabase: getSession dari SecureStore)
    restoreSession().then((restored) => {
      if (ignore) return;
      setUser(restored);
      setLoading(false);
    });

    // 2. Dengarkan login/logout (Supabase: onAuthStateChange)
    const unsubscribe = onAuthChange(setUser);

    // Cleanup: berhenti berlangganan saat provider dilepas
    return () => {
      ignore = true;
      unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    session: user ? { user } : null,
    user,
    loading,
    signIn: stubSignIn,
    signUp: stubSignUp,
    signOut: stubSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  }
  return context;
}