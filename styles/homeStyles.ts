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
    marginBottom: 4,
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
});