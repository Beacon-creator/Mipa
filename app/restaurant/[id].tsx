import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from "react-native";

type MenuItem = { id: string; name: string; price: string };
type Review = { id: string; user: string; text: string; stars: number };

type Restaurant = {
  name: string;
  img: string;
  distance: string;
  rating: number;
  location: string;
  menu: MenuItem[];
  reviews: Review[];
  info: string;
};

const mockRestaurants: Record<string, Restaurant> = {
  r1: {
    name: "Joe's Diner",
    img: "https://tinyurl.com/3j9hrfa5",
    distance: "0.4km",
    rating: 4.5,
    location: "Ikeja",
    menu: [
      { id: "m1", name: "Beef Burger", price: "$5.00" },
      { id: "m2", name: "Cheese Pizza", price: "$8.00" },
    ],
    reviews: [
      { id: "rv1", user: "Michael", text: "Great food!", stars: 5 },
      { id: "rv2", user: "Jane", text: "Very tasty meals", stars: 4 },
    ],
    info: "Open 8AM - 10PM\nFast delivery\nFamily friendly",
  },
  r2: {
    name: "Bella Bistro",
    img: "https://tinyurl.com/yjdymmnn",
    distance: "1.2km",
    rating: 4.7,
    location: "VI",
    menu: [
      { id: "m1", name: "Pasta Alfredo", price: "$9.50" },
      { id: "m2", name: "Tiramisu", price: "$4.50" },
    ],
    reviews: [
      { id: "rv1", user: "Ada", text: "Lovely ambiance and food.", stars: 5 },
      { id: "rv2", user: "Kunle", text: "Service was a bit slow.", stars: 3 },
    ],
    info: "Open 10AM - 11PM\nFine dining\nBooking recommended",
  },
  r3: {
    name: "Awesome Restaurant",
    img: "https://tinyurl.com/5buf2ewh",
    distance: "0.9km",
    rating: 4.5,
    location: "Ikeja",
    menu: [
      { id: "m1", name: "Jollof Rice", price: "$6.00" },
      { id: "m2", name: "Fried Plantain", price: "$3.00" },
    ],
    reviews: [
      { id: "rv1", user: "Tobi", text: "Proper Nigerian food 😍", stars: 5 },
      { id: "rv2", user: "Sarah", text: "Portions are generous.", stars: 4 },
    ],
    info: "Open 9AM - 9PM\nNigerian & continental dishes",
  },
  r4: {
    name: "Cobi Food",
    img: "https://tinyurl.com/yjdymmnn",
    distance: "0.5km",
    rating: 4.9,
    location: "Sango",
    menu: [
      { id: "m1", name: "Grilled Chicken", price: "$7.50" },
      { id: "m2", name: "Salad Bowl", price: "$5.50" },
    ],
    reviews: [
      { id: "rv1", user: "John", text: "Super fast delivery.", stars: 5 },
      { id: "rv2", user: "Bisi", text: "Healthy and tasty.", stars: 4 },
    ],
    info: "Open 7AM - 10PM\nHealthy options\nTakeaway & delivery",
  },
};

export default function RestaurantDetails() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;
  const [tab, setTab] = useState<"order" | "reviews" | "info">("order");

  // ✅ Safe guard, no non-null assertion
  if (!id || !mockRestaurants[id]) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Stack.Screen options={{ title: "Restaurant" }} />
        <Text>Restaurant not found.</Text>
      </View>
    );
  }

  const r = mockRestaurants[id];

  return (
    <ScrollView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: r.name }} />

      <Image source={{ uri: r.img }} style={styles.headerImg} />

      {/* Name / rating / location */}
      <View style={styles.headerInfo}>
        <Text style={styles.title}>{r.name}</Text>
        <Text style={styles.meta}>
          {r.location} · {r.distance} · ⭐ {r.rating}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Pressable onPress={() => setTab("order")} style={[styles.tab, tab === "order" && styles.activeTab]}>
          <Text style={[styles.tabText, tab === "order" && styles.activeTabText]}>Order</Text>
        </Pressable>
        <Pressable onPress={() => setTab("reviews")} style={[styles.tab, tab === "reviews" && styles.activeTab]}>
          <Text style={[styles.tabText, tab === "reviews" && styles.activeTabText]}>Reviews</Text>
        </Pressable>
        <Pressable onPress={() => setTab("info")} style={[styles.tab, tab === "info" && styles.activeTab]}>
          <Text style={[styles.tabText, tab === "info" && styles.activeTabText]}>Information</Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {tab === "order" &&
          r.menu.map((f) => (
            <View key={f.id} style={styles.menuRow}>
              <Text style={styles.menuName}>{f.name}</Text>
              <Text style={styles.menuPrice}>{f.price}</Text>
            </View>
          ))}

        {tab === "reviews" &&
          r.reviews.map((rv) => (
            <View key={rv.id} style={styles.reviewBox}>
              <Text style={styles.reviewUser}>
                {rv.user} · ⭐ {rv.stars}
              </Text>
              <Text style={styles.reviewText}>{rv.text}</Text>
            </View>
          ))}

        {tab === "info" && <Text style={styles.infoText}>{r.info}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImg: { width: "100%", height: 200 },
  headerInfo: { padding: 16 },
  title: { fontSize: 22, fontWeight: "800" },
  meta: { color: "#6B7280", marginTop: 4 },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#10B981",
  },
  tabText: { color: "#6B7280", fontSize: 15, fontWeight: "600" },
  activeTabText: { color: "#111827" },
  content: { padding: 16 },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuName: { fontSize: 16, fontWeight: "700" },
  menuPrice: { fontSize: 15, color: "#6B7280" },
  reviewBox: { paddingVertical: 10 },
  reviewUser: { fontWeight: "700", marginBottom: 4 },
  reviewText: { lineHeight: 20 },
  infoText: { fontSize: 15, lineHeight: 22, color: "#374151" },
});
