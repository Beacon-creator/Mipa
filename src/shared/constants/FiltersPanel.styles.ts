// src/styles/FiltersPanel.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  filterPanel: {
    marginTop: 10,
    marginBottom: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  filterTitle: { fontSize: 14, fontWeight: "700" },
  filterReset: { fontSize: 12, color: "#6B7280" },
  filterRow: { marginTop: 6 },
  filterLabel: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  filterChipsRow: { flexDirection: "row", gap: 8 },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  filterChipActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  filterChipText: { fontSize: 12, color: "#111827" },
});
