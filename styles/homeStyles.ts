import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f14",
  },
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#1a1a24",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a38",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    color: "#a0a0b0",
    marginTop: 4,
  },
  content: {
    paddingBottom: 100, // ruang untuk navbar melayang
  },

  // Film unggulan (poster besar dengan info di bagian bawah)
  hero: {
    height: 400,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1a1a24",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a38",
    padding: 16,
  },
  heroPlaceholderText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  heroInfo: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "rgba(15, 15, 20, 0.82)",
  },
  heroTag: {
    color: "#facc15",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  heroMeta: {
    color: "#a0a0b0",
    fontSize: 12,
    marginTop: 4,
  },

  // Baris horizontal (Rating Tertinggi, Film Terbaru)
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  seeAll: {
    color: "#a0a0b0",
    fontSize: 13,
    fontWeight: "600",
  },
  rowContent: {
    paddingHorizontal: 16,
  },
  rowCard: {
    width: 120,
    marginRight: 12,
  },
  rowPoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: "#1a1a24",
  },
  rowPlaceholder: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: "#2a2a38",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  rowPlaceholderText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  rowBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  rowBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  rowTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  rowYear: {
    color: "#a0a0b0",
    fontSize: 11,
    marginTop: 2,
  },
});