import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MoviesProvider } from "../context/MoviesContext";

// Layout ROOT: dibungkus Provider data, lalu memakai Stack.
// Stack inilah yang membuat push() / back() bekerja (tumpukan layar).
// Layar (tabs) dan movie/[id] terdeteksi otomatis dari nama file/folder di app/.
export default function RootLayout() {
  return (
    <MoviesProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0f0f14" },
        }}
      />
    </MoviesProvider>
  );
}
