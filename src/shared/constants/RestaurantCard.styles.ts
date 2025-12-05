// src/styles/RestaurantCard.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  restaurantRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  restaurantImg: { width: 100, height: 72, borderRadius: 8 },
  restaurantName: { fontSize: 16, fontWeight: "800" },
  restaurantMeta: { color: "#6B7280", marginTop: 4 },
});
