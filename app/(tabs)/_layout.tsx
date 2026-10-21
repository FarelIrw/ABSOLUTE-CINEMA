import { Tabs } from "expo-router";
import BottomNav from "../../components/BottomNav";

// Layout grup (tabs): memakai Tabs bawaan expo-router,
// tetapi tampilan bar-nya tetap BottomNav milik kita (lewat prop tabBar).
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <BottomNav />}
      screenOptions={{ headerShown: false }}
    />
  );
}
