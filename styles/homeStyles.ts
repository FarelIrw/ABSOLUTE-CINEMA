import { StyleSheet } from "react-native";

// External style: dipakai oleh App.tsx dan MovieCard.tsx
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

  // Kartu horizontal: poster di kiri, teks di kanan
  card: {
    flexDirection: "row",
    backgroundColor: "#1a1a24",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  posterWrapper: {
    width: 100,
    height: 150,
    marginRight: 12,
  },
  // Poster TMDB (rasio 2:3, jadi 100x150 pas tanpa terpotong)
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#0f0f14",
  },
  // Kotak pengganti saat poster belum ada / token kosong
  posterPlaceholder: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#2a2a38",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  posterPlaceholderText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  // Badge rating di pojok kanan atas poster
  ratingBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 12,
    color: "#a0a0b0",
    marginBottom: 6,
  },
  cardSynopsis: {
    paddingTop: 20,
    lineHeight: 20,
    color: "#c4c4d0",
    textAlign: "justify"
  },
});