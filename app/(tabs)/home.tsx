// app/(tabs)/home.tsx
import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, StatusBar, FlatList, Image, Pressable, Alert, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as api from "../../src/shared/constants/api";

// Use your canonical CartContext path. Adjust if your file lives elsewhere.
import { useCart } from "../../src/shared/ui/CartContext";

// Components (assume these exist)
import { FoodCard } from "../../src/shared/ui/FoodCard";
import { RestaurantCard } from "../../src/shared/ui/RestaurantCard";
import { SearchHeader } from "../../src/shared/ui/SearchHeader";
import { FiltersPanel } from "../../src/shared/ui/FiltersPanel";

const { width } = Dimensions.get("window");

/* ---------- Demo data (replace with real API data) ---------- */
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

/* ---------- Helpers ---------- */
function looksLikeObjectId(id?: string) {
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

/* ---------- Home component ---------- */
export default function HomeScreen() {
  // search + filters
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // detail state
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof nearby[0] | null>(null);
  const [activeRestaurantTab, setActiveRestaurantTab] = useState<"order" | "review" | "info">("order");

  // cart
  const { items } = useCart();

  // badge - sum of quantities
  const totalCount = items.reduce((s, it) => s + (it.quantity || 0), 0);

  // active foods (search filters food titles)
  const activeFoods = useMemo(() => {
    const base = selectedCategory === "all" ? foods : foods.filter((f) => f.type === selectedCategory);
    if (!query) return base;
    return base.filter((f) => f.title.toLowerCase().includes(query.toLowerCase()));
  }, [selectedCategory, query]);

  // filtered restaurants (search also applies here)
  const filteredNearby = useMemo(() => {
    return nearby.filter((r) => {
      if (query) {
        const q = query.toLowerCase();
        // match restaurant name OR any nearby sample menu name (for demo)
        if (!r.name.toLowerCase().includes(q)) return false;
      }
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

  const toggleRating = (v: number) => setMinRating((p) => (p === v ? null : v));
  const toggleDistance = (v: number) => setMaxDistance((p) => (p === v ? null : v));
  const toggleType = (v: string) => setTypeFilter((p) => (p === v ? null : v));
  const toggleLocation = (v: string) => setLocationFilter((p) => (p === v ? null : v));
  const togglePrice = (v: number) => setMaxPrice((p) => (p === v ? null : v));

  // Quick order: tries to create order immediately.
  // We guard for invalid restaurant ids (demo placeholder ids like 'r1' will be rejected).
  const handleQuickOrder = async (food: any, restaurantIdArg?: string) => {
    const rId = restaurantIdArg ?? selectedRestaurant?.id ?? nearby[0].id;
    if (!looksLikeObjectId(rId)) {
      // If the id isn't a valid backend id, show a clear message and offer to add to cart instead.
      Alert.alert(
        "Cannot order from demo restaurant",
        "This restaurant entry is a local demo and doesn't map to a real backend id. Add to cart instead or open a real restaurant."
      );
      return;
    }

    const payload = {
      restaurantId: rId,
      items: [{ menuItemId: String(food.id), quantity: 1 }],
      address: {
        fullName: "Customer",
        phone: "08000000000",
        line1: "Sample Street 12",
        city: "Ikeja",
        state: "Lagos",
        country: "Nigeria",
        postalCode: "100001",
      },
      paymentMethod: "card" as const,
      notes: "No onions please",
    };

    try {
      const order = await api.createOrder(payload);
      // navigate to order detail using returned id
      const orderId = order?.id ?? order?._id ?? order?.orderNumber;
      router.push({ pathname: "/(order)/order/[id]", params: { id: orderId } } as any);
    } catch (err: any) {
      console.warn("Quick order failed", err);
      Alert.alert("Order failed", err?.message ?? "Could not place order");
    }
  };

  /* ---------- RENDER ---------- */

  // Restaurant details view (inline - not a separate screen here)
  if (selectedRestaurant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.container}>
            {/* Header: back + title + cart */}
            <View style={styles.detailHeaderRow}>
              <Pressable onPress={() => setSelectedRestaurant(null)} style={{ padding: 6, marginRight: 8 }}>
                <Feather name="arrow-left" size={20} color="#111827" />
              </Pressable>
              <Text style={styles.detailHeaderTitle}>Restaurant details</Text>

              <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => router.push("//auth/(order)/cart")} style={{ padding: 8 }}>
                  <Feather name="shopping-cart" size={20} color="#111827" />
                  {totalCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{totalCount}</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <Image source={{ uri: selectedRestaurant.img }} style={styles.detailImage} />
              <View style={{ marginTop: 12 }}>
                <Text style={styles.restaurantName}>{selectedRestaurant.name}</Text>
                <Text style={styles.restaurantMeta}>
                  {selectedRestaurant.location} · {selectedRestaurant.distance} · ⭐ {selectedRestaurant.rating}
                </Text>
              </View>
            </View>

            {/* tabs */}
            <View style={styles.tabsRow}>
              {(["order", "review", "info"] as const).map((tab) => {
                const active = activeRestaurantTab === tab;
                return (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveRestaurantTab(tab)}
                    style={[styles.tabChip, active && styles.tabChipActive]}
                  >
                    <Text style={[styles.tabChipText, active && { color: "#fff" }]}>
                      {tab === "order" ? "Order" : tab === "review" ? "Reviews" : "Information"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* tab content */}
            <View style={{ marginTop: 16 }}>
              {activeRestaurantTab === "order" && (
                <View>
                  <Text style={styles.sectionTitle}>Popular items</Text>
                  <FlatList
                    data={activeFoods}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => (
                      // pass restaurantId so FoodCard or quick-order logic can use the correct id
                      <FoodCard item={item} restaurantId={selectedRestaurant.id} onQuickOrder={(f) => handleQuickOrder(f, selectedRestaurant.id)} />
                    )}
                    scrollEnabled={false}
                  />
                </View>
              )}

              {activeRestaurantTab === "review" && (
                <View>
                  <Text style={styles.sectionTitle}>Customer reviews</Text>
                  <Text style={{ marginTop: 8, color: "#6B7280" }}>★★★★☆ 4.5 average based on 120 reviews.</Text>
                </View>
              )}

              {activeRestaurantTab === "info" && (
                <View>
                  <Text style={styles.sectionTitle}>Information</Text>
                  <Text style={{ marginTop: 8 }}>Location: {selectedRestaurant.location}</Text>
                  <Text>Distance: {selectedRestaurant.distance}</Text>
                  <Text>Rating: ⭐ {selectedRestaurant.rating}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // MAIN HOME
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.container}>
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

          {/* categories */}
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedCategory(item.id)}
                style={[
                  styles.consumableCard,
                  selectedCategory === item.id ? styles.consumableActive : styles.consumableInactive,
                ]}
              >
                <Image source={{ uri: item.img }} style={styles.consumableImg} />
                <Text style={[styles.consumableText, selectedCategory === item.id && { color: "#fff" }]}>{item.name}</Text>
              </Pressable>
            )}
            style={{ marginTop: 12 }}
          />

          {/* foods */}
          <Text style={{ fontSize: 16, fontWeight: "800", marginTop: 16 }}>{selectedCategory.toUpperCase()}</Text>
          <FlatList
            data={activeFoods}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              // pass a demo restaurant id for items listed on the main page (nearby[0]) - quickOrder will guard for invalid object ids
              <FoodCard item={item} restaurantId={nearby[0].id} onQuickOrder={(f) => handleQuickOrder(f, nearby[0].id)} />
            )}
            style={{ marginTop: 12 }}
          />

          {/* nearby restaurants */}
          <Text style={{ fontSize: 16, fontWeight: "800", marginTop: 18 }}>Nearby restaurants</Text>
          {filteredNearby.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onPress={() => {
                setSelectedRestaurant(r);
                setActiveRestaurantTab("order");
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Styles (copied/cleaned from your previous file) ---------- */
const styles = StyleSheet.create({
  container: { padding: 16 },

  filterBtn: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 1,
  },

  consumableCard: { width: 90, height: 110, borderRadius: 14, marginHorizontal: 8, padding: 8, alignItems: "center", justifyContent: "center" },
  consumableActive: { backgroundColor: "#10B981" },
  consumableInactive: { backgroundColor: "#F3F4F6" },
  consumableImg: { width: 44, height: 44, borderRadius: 10, marginBottom: 8 },
  consumableText: { fontSize: 13, fontWeight: "700", color: "#111827" },

  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },

  menuCard: { width: width * 0.48, marginRight: 12, borderRadius: 12, overflow: "hidden", backgroundColor: "#fff", elevation: 2, paddingBottom: 8 },
  imageWrap: { position: "relative", width: "100%", height: 120 },
  menuImg: { width: "100%", height: "100%" },
  menuOverlay: { position: "absolute", left: 8, right: 8, bottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.35)", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  menuTitleOverlay: { color: "#fff", fontWeight: "700", fontSize: 14, maxWidth: "70%" },
  menuPriceOverlay: { color: "#fff", fontWeight: "700", fontSize: 13 },

  restaurantRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  restaurantImg: { width: 100, height: 72, borderRadius: 8 },
  restaurantName: { fontSize: 16, fontWeight: "800" },
  restaurantMeta: { color: "#6B7280", marginTop: 4 },

  detailHeaderRow: { flexDirection: "row", alignItems: "center" },
  detailHeaderTitle: { fontSize: 16, fontWeight: "700" },
  detailImage: { width: "100%", height: 180, borderRadius: 12, backgroundColor: "#E5E7EB" },
  tabsRow: { flexDirection: "row", marginTop: 16, gap: 8 },
  tabChip: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: "#D1D5DB", backgroundColor: "#fff" },
  tabChipActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  tabChipText: { fontSize: 13, fontWeight: "600", color: "#111827" },

  orderRow: { flexDirection: "row", alignItems: "center", marginTop: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  orderImg: { width: 60, height: 60, borderRadius: 10, backgroundColor: "#E5E7EB" },
  orderTitle: { fontSize: 14, fontWeight: "700" },
  orderPrice: { marginTop: 4, color: "#6B7280" },

  primaryBtnSmall: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "#111827", alignItems: "center", justifyContent: "center" },
  secondaryBtnSmall: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: "#111827", alignItems: "center", justifyContent: "center" },

  badge: {
    position: "absolute",
    right: -6,
    top: -8,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
