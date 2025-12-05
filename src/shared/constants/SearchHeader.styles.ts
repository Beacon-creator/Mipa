
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 16 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchInput: { flex: 1, height: 36 },
  filterBtn: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 1,
  },
  badge: {
    position: "absolute",
    right: -2,
    top: -6,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
