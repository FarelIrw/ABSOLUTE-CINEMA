import { Tabs } from "expo-router";
import BottomNav from "../../components/BottomNav";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <BottomNav />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="subscription" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}