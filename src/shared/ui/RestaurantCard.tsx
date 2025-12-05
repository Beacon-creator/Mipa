// src/components/RestaurantCard.tsx
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { styles } from "../constants/RestaurantCard.styles";

type Props = {
  restaurant: {
    id: string;
    name: string;
    img: string;
    distance: string;
    rating: number;
    location: string;
  };
  onPress: () => void;
};

export const RestaurantCard: React.FC<Props> = ({ restaurant, onPress }) => {
  return (
    <Pressable style={styles.restaurantRow} onPress={onPress}>
      <Image source={{ uri: restaurant.img }} style={styles.restaurantImg} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantMeta}>
          {restaurant.location} · {restaurant.distance} · ⭐ {restaurant.rating}
        </Text>
      </View>
    </Pressable>
  );
};
