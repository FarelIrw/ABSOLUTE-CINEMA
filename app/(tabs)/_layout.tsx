
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MoviesProvider } from "../../context/MoviesContext";
export default function RootLayout() {
  return (
    <MoviesProvider>
      <StatusBar style="light" />

      // app/_layout.tsx
<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0f0f14" } }}>
  <Stack.Screen name="(tabs)" />
  <Stack.Screen
    name="movie/[id]"
    options={{
      headerShown: true,
      title: "Detail Film",
      animation: "slide_from_bottom",
      headerStyle: { backgroundColor: "#1a1a24" },
      headerTintColor: "#ffffff",
    }}
  />
  </Stack>
    </MoviesProvider>
  );
}
