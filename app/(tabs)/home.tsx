// app/(tabs)/home.tsx
import React, { useMemo, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StatusBar, FlatList, Image, Pressable } from "react-native";
import { useCart } from "../../src/shared/ui/CartContext";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as api from "../../src/shared/constants/api";

// Components
import { FoodCard } from "../../src/shared/ui/FoodCard";
import { RestaurantCard } from "../../src/shared/ui//RestaurantCard";
import { SearchHeader } from "../../src/shared/ui/SearchHeader";
import { FiltersPanel } from "../../src/shared/ui/FiltersPanel";

// Data
const categories = [
  { id: "all", name: "All", img: "https://shorturl.at/IZm2X" },
  { id: "food", name: "Food", img: "https://shorturl.at/IZm2X" },
  { id: "drink", name: "Drink", img: "https://shorturl.at/UTAmX" },
  { id: "cake", name: "Cake", img: "https://shorturl.at/mHfYx" },
  { id: "salad", name: "Salad", img: "https://tinyurl.com/y2zukmjx" },
  { id: "snacks", name: "Snacks", img: "https://tinyurl.com/3mbj4y9r" },
];

const foods = [
  { id: "f1", title: "Burger", price: "$6.50", img: "https://picsum.dev/image/329/500/500", type: "food" },
  { id: "f2", title: "Pizza", price: "$8.00", img: "https://unsplash.com/photos/8FUfIQ_2oYw/download?force=true&w=800&h=800", type: "food" },
  { id: "f3", title: "Latte", price: "$3.50", img: "https://tinyurl.com/3n87227t", type: "drink" },
];

const nearby = [
  { id: "r1", name: "Joe's Diner", distance: "0.4km", rating: 4.5, img: "https://tinyurl.com/3j9hrfa5", location: "Ikeja", type: "food", avgPrice: 6.5 },
  { id: "r2", name: "Bella Bistro", distance: "1.2km", rating: 4.7, img: "https://tinyurl.com/yjdymmnn", location: "VI", type: "food", avgPrice: 10.0 },
  { id: "r3", name: "Awesome Restaurant", distance: "0.9km", rating: 4.5, img: "https://tinyurl.com/5buf2ewh", location: "Ikeja", type: "snacks", avgPrice: 5.0 },
  { id: "r4", name: "Cobi Food", distance: "0.5km", rating: 4.9, img: "https://tinyurl.com/yjdymmnn", location: "Sango", type: "drink", avgPrice: 4.0 },
];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof nearby[0] | null>(null);
  const [activeRestaurantTab, setActiveRestaurantTab] = useState<"order" | "review" | "info">("order");

  const { items } = useCart();

  // Filtered foods
  const activeFoods = useMemo(() => {
    const base = selectedCategory === "all" ? foods : foods.filter((f) => f.type === selectedCategory);
    if (!query) return base;
    return base.filter((f) => f.title.toLowerCase().includes(query.toLowerCase()));
  }, [selectedCategory, query]);

  // Filtered restaurants
  const filteredNearby = useMemo(() => {
    return nearby.filter((r) => {
      if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (minRating != null && r.rating < minRating) return false;
      if (maxDistance != null && parseFloat(r.distance) > maxDistance) return false;
      if (typeFilter && r.type !== typeFilter) return false;
      if (locationFilter && r.location !== locationFilter) return false;
      if (maxPrice != null && r.avgPrice > maxPrice) return false;
      return true;
    });
  }, [query, minRating, maxDistance, typeFilter, locationFilter, maxPrice]);

  const resetFilters = () => {
    setMinRating(null);
    setMaxDistance(null);
    setTypeFilter(null);
    setLocationFilter(null);
    setMaxPrice(null);
  };

  const toggleRating = (value: number) => setMinRating((prev) => (prev === value ? null : value));
  const toggleDistance = (value: number) => setMaxDistance((prev) => (prev === value ? null : value));
  const toggleType = (value: string) => setTypeFilter((prev) => (prev === value ? null : value));
  const toggleLocation = (value: string) => setLocationFilter((prev) => (prev === value ? null : value));
  const togglePrice = (value: number) => setMaxPrice((prev) => (prev === value ? null : value));

  const handleQuickOrder = async (food: any) => {
    try {
      const orderPayload = {
        restaurantId: selectedRestaurant?.id || "r1",
        items: [{ menuItemId: String(food.id), quantity: 1 }],
        address: { fullName: "Olubukola", phone: "08000000000", line1: "Sample Street 12", city: "Ikeja", state: "Lagos", country: "Nigeria", postalCode: "100001" },
        paymentMethod: "card" as const,
        notes: "No onions please",
      };
      const order = await api.createOrder(orderPayload);
      router.push({ pathname: "/(order)/order/[id]", params: { id: order.id ?? order._id ?? order.orderNumber } } as any);
    } catch (err: any) {
      console.warn(err?.message || err);
    }
  };

  // --- RENDER ---
  if (selectedRestaurant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ padding: 16 }}>
            {/* Back + Cart */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable onPress={() => setSelectedRestaurant(null)} style={{ padding: 6, marginRight: 8 }}>
                <Feather name="arrow-left" size={20} color="#111827" />
              </Pressable>
              <Text style={{ fontSize: 16, fontWeight: "700" }}>Restaurant details</Text>

              <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => router.push("/(auth)/(order)/cart")} style={{ padding: 8 }}>
                  <Feather name="shopping-cart" size={20} color="#111827" />
                  {items.length > 0 && (
                    <View style={{ position: "absolute", right: -2, top: -6, backgroundColor: "#EF4444", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, minWidth: 16, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{items.length}</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            <Image source={{ uri: selectedRestaurant.img }} style={{ width: "100%", height: 180, borderRadius: 12, marginTop: 12 }} />
            <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 12 }}>{selectedRestaurant.name}</Text>
            <Text style={{ color: "#6B7280" }}>{selectedRestaurant.location} · {selectedRestaurant.distance} · ⭐ {selectedRestaurant.rating}</Text>

            {/* Tabs */}
            <View style={{ flexDirection: "row", marginTop: 16, gap: 8 }}>
              {(["order", "review", "info"] as const).map((tab) => {
                const active = activeRestaurantTab === tab;
                return (
                  <Pressable key={tab} onPress={() => setActiveRestaurantTab(tab)} style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: active ? "#10B981" : "#D1D5DB", backgroundColor: active ? "#10B981" : "#fff" }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: active ? "#fff" : "#111827" }}>{tab === "order" ? "Order" : tab === "review" ? "Reviews" : "Information"}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Tab Content */}
            {activeRestaurantTab === "order" && (
              <FlatList
                data={activeFoods}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => <FoodCard item={item} restaurantId={selectedRestaurant.id} onQuickOrder={handleQuickOrder} />}
                style={{ marginTop: 16 }}
              />
            )}

            {activeRestaurantTab === "review" && (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>Customer reviews</Text>
                <Text style={{ marginTop: 8, color: "#6B7280" }}>★★★★☆ 4.5 average based on 120 reviews.</Text>
              </View>
            )}

            {activeRestaurantTab === "info" && (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>Information</Text>
                <Text style={{ marginTop: 8 }}>Location: {selectedRestaurant.location}</Text>
                <Text>Distance: {selectedRestaurant.distance}</Text>
                <Text>Rating: ⭐ {selectedRestaurant.rating}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- MAIN HOME ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={{ padding: 16 }}>
          <SearchHeader query={query} setQuery={setQuery} onFilterToggle={() => setShowFilter((p) => !p)} />
          {showFilter && (
            <FiltersPanel
              minRating={minRating}
              maxDistance={maxDistance}
              typeFilter={typeFilter}
              locationFilter={locationFilter}
              maxPrice={maxPrice}
              toggleRating={toggleRating}
              toggleDistance={toggleDistance}
              toggleType={toggleType}
              toggleLocation={toggleLocation}
              togglePrice={togglePrice}
              resetFilters={resetFilters}
            />
          )}

          <Text style={{ fontSize: 16, fontWeight: "800", marginTop: 16 }}>Categories</Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => setSelectedCategory(item.id)} style={{ width: 90, height: 110, borderRadius: 14, marginHorizontal: 8, padding: 8, alignItems: "center", justifyContent: "center", backgroundColor: selectedCategory === item.id ? "#10B981" : "#F3F4F6" }}>
                <Image source={{ uri: item.img }} style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 8 }} />
                <Text style={{ fontSize: 13, fontWeight: "700", color: selectedCategory === item.id ? "#fff" : "#111827" }}>{item.name}</Text>
              </Pressable>
            )}
            style={{ marginTop: 12 }}
          />

          <Text style={{ fontSize: 16, fontWeight: "800", marginTop: 16 }}>{selectedCategory.toUpperCase()}</Text>
          <FlatList
            data={activeFoods}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <FoodCard item={item} restaurantId={nearby[0].id} onQuickOrder={handleQuickOrder} />}
            style={{ marginTop: 12 }}
          />

          <Text style={{ fontSize: 16, fontWeight: "800", marginTop: 18 }}>Nearby restaurants</Text>
          {filteredNearby.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onPress={() => { setSelectedRestaurant(r); setActiveRestaurantTab("order"); }} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
