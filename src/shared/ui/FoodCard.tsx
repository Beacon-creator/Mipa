// src/shared/ui/FoodCard.tsx
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useCart } from "../ui/CartContext"; // use your canonical path
import { styles } from "../constants/FoodCard.styles";

type Props = {
  item: { id: string; title: string; price: string | number; img?: string };
  restaurantId: string;
  onQuickOrder: (item: any) => void;
};

export const FoodCard: React.FC<Props> = ({ item, restaurantId, onQuickOrder }) => {
  const { addToCart, items } = useCart();

  const parsePrice = (p: string | number) => {
    if (typeof p === "number") return p;
    const cleaned = String(p).replace(/[^0-9.]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const inCart = items.find((it) => it.menuItemId === item.id);
  const isDisabled = Boolean(inCart);

  const handleAdd = () => {
    if (isDisabled) return;
    addToCart(
      {
        menuItemId: item.id,
        title: item.title,
        price: parsePrice(item.price),
        img: item.img,
        restaurantId,
      },
      1
    );
  };

  return (
    <View style={styles.menuCard}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.img }} style={styles.menuImg} />
        <View style={styles.menuOverlay}>
          <Text style={styles.menuTitleOverlay}>{item.title}</Text>
          <Text style={styles.menuPriceOverlay}>{item.price}</Text>
        </View>
      </View>

      <View style={{ padding: 8 }}>
        <Text style={{ fontWeight: "700" }}>{item.title}</Text>
        <Text style={{ color: "#6B7280", marginTop: 4 }}>{item.price}</Text>

        <View style={{ marginTop: 8, flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={handleAdd}
            disabled={isDisabled}
            style={[
              styles.primaryBtnSmall,
              isDisabled && { backgroundColor: "#9CA3AF", opacity: 0.9 }, // greyed out
            ]}
          >
            <Text style={{ color: isDisabled ? "#111827" : "#fff", fontWeight: "700" }}>
              {isDisabled ? `In cart · ${inCart?.quantity ?? 1}` : "Add to cart"}
            </Text>
          </Pressable>

          <Pressable onPress={() => onQuickOrder(item)} style={styles.secondaryBtnSmall}>
            <Text style={{ fontWeight: "700" }}>Buy now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
