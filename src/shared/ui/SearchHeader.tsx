// src/components/SearchHeader.tsx
import React from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCart } from "./CartContext";
import { useRouter } from "expo-router";
import { styles } from "../constants/SearchHeader.styles";

type Props = {
  query: string;
  setQuery: (q: string) => void;
  onFilterToggle: () => void;
};

export const SearchHeader: React.FC<Props> = ({ query, setQuery, onFilterToggle }) => {
  const { items } = useCart();
  const router = useRouter();

  return (
    <View style={styles.searchRow}>
      <View style={styles.searchBox}>
        <Feather name="search" size={18} style={{ marginRight: 8 }} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search for dishes or restaurants" style={styles.searchInput} />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable style={styles.filterBtn} onPress={onFilterToggle}>
          <Feather name="sliders" size={18} color="#111827" />
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/(order)/cart")} style={{ padding: 8, marginLeft: 8 }}>
          <Feather name="shopping-cart" size={20} color="#111827" />
          {items.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{items.length}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};