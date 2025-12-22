// app/src/shared/constants/FoodCard.styles.ts
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Card layout for FoodCard
  card: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  img: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#E5E7EB",
  },

  title: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111827",
  },

  price: {
    fontWeight: "600",
    fontSize: 13,
    color: "#6B7280",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  btn: {
    flex: 1,
    minWidth: 68,
  },

  // (Optional) Menu-style card if you still use it somewhere else
  menuCard: {
    width: width * 0.48,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    paddingBottom: 8,
  },

  imageWrap: {
    position: "relative",
    width: "100%",
    height: 120,
  },

  menuImg: {
    width: "100%",
    height: "100%",
  },

  menuOverlay: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },

  menuTitleOverlay: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    maxWidth: "60%",
  },

  menuPriceOverlay: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 8,
  },

  /* ---------- Buttons (small) ---------- */
  smallBtnBase: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 84,
    flexDirection: "row",
  },

  // Primary (default)
  primaryBtnSmall: {
    backgroundColor: "#111827",
  },
  primaryBtnSmallText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 6,
  },

  // Primary (active — in cart)
  primaryBtnSmallActive: {
    backgroundColor: "#10B981",
  },
  primaryBtnSmallActiveText: {
    color: "#ffffff",
    fontWeight: "800",
  },

  // Primary (disabled)
  primaryBtnSmallDisabled: {
    backgroundColor: "#E5E7EB",
  },
  primaryBtnSmallDisabledText: {
    color: "#374151",
    fontWeight: "700",
  },

  // Secondary (outline style)
  secondaryBtnSmall: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#111827",
  },
  secondaryBtnSmallText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 6,
  },

  // Secondary (active)
  secondaryBtnSmallActive: {
    backgroundColor: "#2563EB",
    borderWidth: 0,
  },
  secondaryBtnSmallActiveText: {
    color: "#fff",
    fontWeight: "800",
  },

  // Secondary (disabled)
  secondaryBtnSmallDisabled: {
    backgroundColor: "transparent",
    borderColor: "#D1D5DB",
  },
  secondaryBtnSmallDisabledText: {
    color: "#9CA3AF",
  },

  tinyIconSpacer: { width: 6 },
});
