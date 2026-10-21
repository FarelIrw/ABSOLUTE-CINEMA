import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { NAV, navStyles } from "../styles/navStyles";

export type TabKey = "home" | "explore" | "favorites" | "profile" | "subscription";

type Tab = {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap; // ikon outline (tidak aktif)
  iconActive: keyof typeof Ionicons.glyphMap; // ikon solid (aktif)
  href: Href; // alamat route tujuan (sesuai nama file di folder app/)
};

// Ubah isi navbar di sini: tambah/hapus/ganti tab cukup lewat array ini
export const tabs: Tab[] = [
  { key: "home", label: "Beranda", icon: "home-outline", iconActive: "home", href: "/" },
  { key: "explore", label: "Jelajah", icon: "compass-outline", iconActive: "compass", href: "/explore" },
  { key: "favorites", label: "Favorit", icon: "heart-outline", iconActive: "heart", href: "/favorites" },
  { key: "subscription", label: "Subs", icon: "cash-outline", iconActive: "cash", href: "/subscription" },
  { key: "profile", label: "Profil", icon: "person-outline", iconActive: "person", href: "/profile" },
];

// Tidak lagi memakai props/state: tab aktif dibaca dari URL (usePathname),
// perpindahan tab dilakukan dengan router.navigate()
export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname(); // "/", "/explore", "/favorites", ...

  return (
    <View style={navStyles.wrap} pointerEvents="box-none">
      <View style={navStyles.bar}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Pressable
              key={tab.key}
              onPress={() => router.navigate(tab.href)}
              // feedback press: meredup (tanpa transform, supaya teks tidak terpotong)
              style={({ pressed }) => [
                navStyles.item,
                pressed && { opacity: 0.5 },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={isActive ? NAV.active : NAV.muted}
              />
              <Text style={[navStyles.label, isActive && navStyles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Tampilan sementara untuk tab yang belum dibuat isinya
export function ComingSoon({ title, icon }: { title: string; icon: Tab["icon"] }) {
  return (
    <View style={navStyles.placeholder}>
      <Ionicons name={icon} size={56} color={NAV.muted} />
      <Text style={navStyles.placeholderTitle}>{title}</Text>
      <Text style={navStyles.placeholderText}>
        Halaman ini sedang disiapkan dan segera hadir.
      </Text>
    </View>
  );
}