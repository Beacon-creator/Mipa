// app/src/shared/ui/FoodCard.tsx
import React, { useMemo, useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { useCart } from "./CartContext";
import { styles } from "../../shared/constants/FoodCard.styles";

export interface FoodItem {
  id: string;
  title?: string;
  name?: string;
  price: number | string;
  img?: string;
  imageUrl?: string;
  restaurantId?: string;
  type?: string;
  isAvailable?: boolean;
}

type Props = {
  item: FoodItem;
  onQuickOrder?: (menuItem: FoodItem) => Promise<void> | void;
  onAddToCart?: (menuItem: FoodItem) => void;
  isInCart?: boolean;
};

export const FoodCard: React.FC<Props> = ({ item, onQuickOrder, onAddToCart, isInCart = false }) => {
  const { addToCart } = useCart();
  const [loadingCart, setLoadingCart] = useState(false);

  const menuItemId = item.id;
  const restaurantId = item.restaurantId;

  const priceNumber = useMemo(() => {
    const p = typeof item.price === "number" ? item.price : parseFloat(String(item.price));
    return isNaN(p) ? 0 : p;
  }, [item.price]);

  const handleAddToCart = async () => {
    if (loadingCart) return;

    if (!menuItemId || !restaurantId) {
      return alert("Invalid item: missing menuItemId or restaurantId");
    }

    if (isInCart) return;

    setLoadingCart(true);
    try {
      if (onAddToCart) {
        onAddToCart(item);
      } else {
        addToCart(
          {
            menuItemId,
            title: item.title ?? item.name ?? "Item",
            price: priceNumber,
            img: item.img ?? item.imageUrl,
            restaurantId,
          },
          1
        );
      }
    } catch {
      alert("Could not add to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.img ?? item.imageUrl ?? "https://via.placeholder.com/300" }}
        style={styles.img}
      />
      <View style={{ marginBottom: 8 }}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title ?? item.name}
        </Text>
        <Text style={styles.price}>₦{priceNumber.toFixed(2)}</Text>
      </View>

      <View style={styles.btnRow}>

        <Pressable
          onPress={handleAddToCart}
          disabled={!item.isAvailable || isInCart || loadingCart}
          style={[
            styles.smallBtnBase,
            isInCart ? styles.primaryBtnSmallActive : styles.secondaryBtnSmall,
            (!item.isAvailable || isInCart) && styles.secondaryBtnSmallDisabled,
            styles.btn,
          ]}
        >
          {loadingCart ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text style={isInCart ? styles.primaryBtnSmallActiveText : styles.secondaryBtnSmallText}>
              {isInCart ? "In cart" : "Add to cart"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
