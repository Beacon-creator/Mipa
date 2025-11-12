import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StatusBar,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons"; // expo vector icons




const { width } = Dimensions.get("window");

const categories = [
  { id: "food", name: "Food", img: "https://shorturl.at/IZm2X" },
  { id: "drink", name: "Drink", img: "https://shorturl.at/UTAmX" },
  { id: "cake", name: "Cake", img: "https://shorturl.at/mHfYx" },
  { id: "snacks", name: "Snacks", img: "https://picsum.photos/seed/snacks/200/200" },
  { id: "salad", name: "Salad", img: "https://picsum.photos/seed/salad/200/200" },
];

const foods = [
  { id: "f1", title: "Burger", price: "$6.50", img: "https://picsum.photos/seed/b1/300/200", type: "food" },
  { id: "f2", title: "Pizza", price: "$8.00", img: "https://picsum.photos/seed/b2/300/200", type: "food" },
  { id: "d1", title: "Latte", price: "$3.50", img: "https://picsum.photos/seed/d1/300/200", type: "drink" },
];

const nearby = [
  { id: "r1", name: "Joe's Diner", distance: "0.4km", rating: 4.5, img: "https://picsum.photos/seed/r1/120/80", location: "Ikeja" },
  { id: "r2", name: "Bella Bistro", distance: "1.2km", rating: 4.7, img: "https://picsum.photos/seed/r2/120/80", location: "VI" },
];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("food");

  const activeFoods = useMemo(() => foods.filter((f) => f.type === selectedCategory), [selectedCategory]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.container}>
          {/* Search + Filter */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Feather name="search" size={18} style={{ marginRight: 8 }} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search for dishes or restaurants"
                style={styles.searchInput}
              />
            </View>
            <Pressable style={styles.filterBtn}>
              <Feather name="sliders" size={18} color="#111827" />
            </Pressable>
          </View>

          {/* Location Row */}
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color="#185221" />
            <Text style={styles.locationText}>  Paris, France</Text>
          </View>

          {/* Consumables (horizontal swipable categories chips with rounded square) */}
          <View style={{ marginTop: 12 }}>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              renderItem={({ item }) => {
                const active = item.id === selectedCategory;
                return (
                  <Pressable
                    onPress={() => setSelectedCategory(item.id)}
                    style={[styles.consumableCard, active ? styles.consumableActive : styles.consumableInactive]}
                  >
                    <Image source={{ uri: item.img }} style={styles.consumableImg} />
                    <Text style={[styles.consumableText, active && { color: "#fff" }]}>{item.name}</Text>
                  </Pressable>
                );
              }}
            />
          </View>

          {/* Menu for active category (simple horizontal list of items) */}
          <View style={{ marginTop: 18 }}>
            <Text style={styles.sectionTitle}>{selectedCategory.toUpperCase()}</Text>
            <FlatList
              data={activeFoods}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              renderItem={({ item }) => (
                <View style={styles.menuCard}>
                  <Image source={{ uri: item.img }} style={styles.menuImg} />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuPrice}>{item.price}</Text>
                </View>
              )}
            />
          </View>

          {/* Category chips (two-line look) - implemented as horizontal scroll of pill cards */}
          <View style={{ marginTop: 18 }}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              renderItem={({ item }) => (
                <View style={styles.chip}>
                  <Image source={{ uri: item.img }} style={styles.chipImg} />
                  <Text style={styles.chipText}>{item.name}</Text>
                </View>
              )}
            />
          </View>

          {/* Nearby restaurants (vertical) */}
          <View style={{ marginTop: 18, paddingHorizontal: 8 }}>
            <Text style={styles.sectionTitle}>Nearby restaurants</Text>
            {nearby.map((r) => (
              <View key={r.id} style={styles.restaurantRow}>
                <Image source={{ uri: r.img }} style={styles.restaurantImg} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.restaurantName}>{r.name}</Text>
                  <Text style={styles.restaurantMeta}>
                    {r.location} · {r.distance} · ⭐ {r.rating}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 8 },
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

  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  locationText: { fontSize: 13, color: "#6B7280" },

  consumableCard: {
    width: 90,
    height: 110,
    borderRadius: 14,
    marginHorizontal: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  consumableActive: { backgroundColor: "#10B981" },
  consumableInactive: { backgroundColor: "#F3F4F6" },
  consumableImg: { width: 44, height: 44, borderRadius: 10, marginBottom: 8 },
  consumableText: { fontSize: 13, fontWeight: "700", color: "#111827" },

  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },

  menuCard: {
    width: width * 0.48,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    paddingBottom: 8,
  },
  menuImg: { width: "100%", height: 120 },
  menuTitle: { fontWeight: "700", fontSize: 14, paddingHorizontal: 8, marginTop: 8 },
  menuPrice: { paddingHorizontal: 8, color: "#6B7280", marginTop: 4 },

  chip: {
    width: 120,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginRight: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },
  chipImg: { width: 40, height: 40, borderRadius: 8, marginBottom: 6 },
  chipText: { fontSize: 12, fontWeight: "700" },

  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  restaurantImg: { width: 100, height: 72, borderRadius: 8 },
  restaurantName: { fontSize: 16, fontWeight: "800" },
  restaurantMeta: { color: "#6B7280", marginTop: 4 },
});
