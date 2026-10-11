import { Platform, StyleSheet } from "react-native";

// Warna navbar: diambil dari tema bawaan app (homeStyles & chip filter genre)
export const NAV = {
  surface: "#1a1a24", // sama dengan header & kartu
  border: "#2a2a38",
  muted: "#a0a0b0", // teks redup
  active: "#ffffff", // warna ikon & label tab aktif
};

// External style: dipakai oleh components/BottomNav.tsx
export const navStyles = StyleSheet.create({
  // Pembungkus: melayang di atas konten (absolute) supaya tidak ada pita gelap di belakang bar
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 15,
  },
  // Bar melayang dengan sudut bulat penuh
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: NAV.surface,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: NAV.border,
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  // Satu tab: ikon + label. Saat aktif hanya warnanya yang berubah
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: NAV.muted,
    fontWeight: "500",
  },
  labelActive: {
    color: NAV.active,
    fontWeight: "700",
  },

  // Layar pengganti untuk tab yang belum punya isi
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  placeholderTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
  },
  placeholderText: {
    color: "#a0a0b0",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
});