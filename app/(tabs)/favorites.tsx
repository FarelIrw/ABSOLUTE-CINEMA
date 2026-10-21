import { View } from "react-native";
import { ComingSoon, tabs } from "../../components/BottomNav";
import { exploreStyles } from "../../styles/exploreStyles";

const tab = tabs.find((t) => t.key === "favorites")!;

// Tab favorites (route "/favorites")
export default function Screen() {
  return (
    <View style={exploreStyles.container}>
      <ComingSoon title={tab.label} icon={tab.icon} />
    </View>
  );
}
