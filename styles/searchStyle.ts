import { StyleSheet } from "react-native";

export const searchStyles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a24",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 48,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    marginLeft: 8,
    fontSize: 16,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  emptyText: {
    color: "#a0a0b0",
    textAlign: "center",
    marginTop: 6,
    fontSize: 14,
  },
});