
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  menuCard: {
    width: width * 0.48,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    paddingBottom: 8,
  },
  imageWrap: { position: "relative", width: "100%", height: 120 },
  menuImg: { width: "100%", height: "100%" },
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
  menuTitleOverlay: { color: "#fff", fontWeight: "700", fontSize: 14, maxWidth: "70%" },
  menuPriceOverlay: { color: "#fff", fontWeight: "700", fontSize: 13 },

  primaryBtnSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
});
