import { StyleSheet } from "react-native";

// Warna dipakai MovieCard untuk badge rating (inline style)
export const colors = {
  good: "#4ade80", // hijau: rating di atas 8
  warn: "#facc15", // kuning: rating 8 ke bawah
};

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
  card: {
    backgroundColor: "#1a1a24",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 12,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 14,
    color: "#a0a0b0",
  },
  cardInfo: {
    fontSize: 14,
    color: "#a0a0b0",
    marginBottom: 8,
  },
  cardSynopsis: {
    fontSize: 13,
    lineHeight: 18,
    color: "#c4c4d0",
    marginTop: 8,
  },
  // Poster dari TMDB
  poster: {
    width: "100%",
    height: 260,
    borderRadius: 8,
    backgroundColor: "#0f0f14",
    resizeMode: "contain",
  },
  // Kotak pengganti saat poster belum ada / token kosong
  posterPlaceholder: {
    width: "100%",
    height: 260,
    borderRadius: 8,
    backgroundColor: "#2a2a38",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  posterPlaceholderText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});