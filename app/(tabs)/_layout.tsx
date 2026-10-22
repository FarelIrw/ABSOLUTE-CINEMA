import { Tabs } from "expo-router";
import BottomNav from "../../components/BottomNav";
import {Stack} from "expo-router";

// Layout grup (tabs): memakai Tabs bawaan expo-router,
// tetapi tampilan bar-nya tetap BottomNav milik kita (lewat prop tabBar).
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

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <BottomNav />}
      screenOptions={{ headerShown: false }}
    />
  );
}