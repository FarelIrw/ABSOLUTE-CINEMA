import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { MoviesProvider } from "../context/MoviesContext";

// Penjaga gerbang (route guard). Dipasang di dalam AuthProvider supaya bisa membaca status login.
function AuthGate() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Aturan 1: selama sesi masih dipulihkan, jangan redirect
    if (loading) return;

    const [group] = segments as string[];
    const inAuthGroup = group === "(auth)";

    if (!session && !inAuthGroup) {
      // Aturan 2 (dan 4): belum login / baru logout, tetapi membuka area aplikasi
      router.replace("/sign-in");
    } else if (session && inAuthGroup) {
      // Aturan 3: sudah login tetapi masih di layar sign-in / sign-up
      router.replace("/");
    }
  }, [session, loading, segments, router]);

  // Spinner selama sesi dipulihkan, supaya tidak ada kedipan layar
  if (!loading) return null;
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

// Layout ROOT: dibungkus Provider auth + data, lalu memakai Stack.
// Stack inilah yang membuat push() / back() bekerja (tumpukan layar).
// Layar (tabs), (auth), dan movie/[id] terdeteksi otomatis dari nama file/folder di app/.
export default function RootLayout() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0f0f14" },
          }}
        />
        <AuthGate />
      </MoviesProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0f0f14",
    alignItems: "center",
    justifyContent: "center",
  },
});