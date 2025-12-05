
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useCart } from "./CartContext";
import { styles } from "../constants/FoodCard.styles";

type Props = {
  item: {
    id: string;
    title: string;
    price: string | number;
    img?: string;
  };
  restaurantId: string;
  onQuickOrder: (item: any) => void;
};

export const FoodCard: React.FC<Props> = ({ item, restaurantId, onQuickOrder }) => {
  const { addToCart } = useCart();

  const parsePrice = (p: string | number) => {
    if (typeof p === "number") return p;
    const cleaned = String(p).replace(/[^0-9.]/g, "");
    return Number.isFinite(Number(cleaned)) ? Number(cleaned) : 0;
  };

  const handleAdd = () => {
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
          <Pressable onPress={handleAdd} style={styles.primaryBtnSmall}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Add to cart</Text>
          </Pressable>
          <Pressable onPress={() => onQuickOrder(item)} style={styles.secondaryBtnSmall}>
            <Text style={{ fontWeight: "700" }}>Buy now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
