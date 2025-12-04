// app/(tabs)/home.tsx
import React, { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "@/shared/ui/CartContext";
import * as api from "../../src/shared/constants/api";

const { width } = Dimensions.get("window");

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
  {
    id: "f2",
    title: "Pizza",
    price: "$8.00",
    img: "https://unsplash.com/photos/8FUfIQ_2oYw/download?force=true&w=800&h=800",
    type: "food",
  },
  { id: "f3", title: "Latte", price: "$3.50", img: "https://tinyurl.com/3n87227t", type: "drink" },
];

const secondGroup = [
  { id: "s1", title: "Chicken", price: "$4.00", img: "https://tinyurl.com/bdcfr6x2" },
  { id: "s2", title: "Beans", price: "$5.00", img: "https://tinyurl.com/4r55cvkh" },
  { id: "s3", title: "Bread", price: "$7.00", img: "https://tinyurl.com/4b8u3f7h" },
];

const nearby = [
  {
    id: "r1",
    name: "Joe's Diner",
    distance: "0.4km",
    rating: 4.5,
    img: "https://tinyurl.com/3j9hrfa5",
    location: "Ikeja",
    type: "food",
    avgPrice: 6.5,
  },
  {
    id: "r2",
    name: "Bella Bistro",
    distance: "1.2km",
    rating: 4.7,
    img: "https://tinyurl.com/yjdymmnn",
    location: "VI",
    type: "food",
    avgPrice: 10.0,
  },
  {
    id: "r3",
    name: "Awesome Restaurant",
    distance: "0.9km",
    rating: 4.5,
    img: "https://tinyurl.com/5buf2ewh",
    location: "Ikeja",
    type: "snacks",
    avgPrice: 5.0,
  },
  {
    id: "r4",
    name: "Cobi Food",
    distance: "0.5km",
    rating: 4.9,
    img: "https://tinyurl.com/yjdymmnn",
    location: "Sango",
    type: "drink",
    avgPrice: 4.0,
  },
];

type Restaurant = (typeof nearby)[number];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [showFilter, setShowFilter] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);

  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [activeRestaurantTab, setActiveRestaurantTab] = useState<"order" | "review" | "info">("order");

  // Cart
  const { addToCart, items } = useCart();

  // Convert string "$6.50" => number 6.5
  const parsePrice = (p: string | number) => {
    if (typeof p === "number") return p;
    const cleaned = String(p).replace(/[^0-9.]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // Add to cart handler
  const handleAddToCart = (food: any) => {
    const priceNum = parsePrice(food.price);
    addToCart(
      {
        menuItemId: String(food.id),
        title: food.title,
        price: priceNum,
        img: food.img,
        restaurantId: selectedRestaurant?.id || "r1",
      },
      1
    );
    Alert.alert("Added to cart", `${food.title} has been added to your cart.`);
  };

  // Quick order (calls backend immediately) — optional, kept for convenience
  const handleQuickOrder = async (food: any) => {
    try {
      const orderPayload = {
        restaurantId: selectedRestaurant?.id || "r1",
        items: [{ menuItemId: String(food.id), quantity: 1 }],
        address: {
          fullName: "Olubukola",
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

      const order = await api.createOrder(orderPayload);
      Alert.alert("✅ Order Successful", `Order No: ${order.orderNumber ?? order.id}`);
      // After quick order, navigate to Order Details screen (if you created it)
      router.push({ pathname: "/(order)/order/[id]", params: { id: order.id ?? order._id ?? order.orderNumber } } as any);
    } catch (err: any) {
      Alert.alert("❌ Order Failed", err?.message ?? String(err));
    }
  };

  const activeFoods = useMemo(() => {
    if (selectedCategory === "all") return foods;
    return foods.filter((f) => f.type === selectedCategory);
  }, [selectedCategory]);

  const filteredNearby = useMemo(() => {
    return nearby.filter((r) => {
      if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (minRating != null && r.rating < minRating) return false;
      if (maxDistance != null) {
        const d = parseFloat(r.distance);
        if (!Number.isNaN(d) && d > maxDistance) return false;
      }
      if (typeFilter && r.type !== typeFilter) return false;
      if (locationFilter && r.location !== locationFilter) return false;
      if (maxPrice != null && r.avgPrice > maxPrice) return false;
      return true;
    });
  }, [query, minRating, maxDistance, typeFilter, locationFilter, maxPrice]);

  const toggleRating = (value: number) => setMinRating((prev) => (prev === value ? null : value));
  const toggleDistance = (value: number) => setMaxDistance((prev) => (prev === value ? null : value));
  const toggleType = (value: string) => setTypeFilter((prev) => (prev === value ? null : value));
  const toggleLocation = (value: string) => setLocationFilter((prev) => (prev === value ? null : value));
  const togglePrice = (value: number) => setMaxPrice((prev) => (prev === value ? null : value));
  const resetFilters = () => {
    setMinRating(null);
    setMaxDistance(null);
    setTypeFilter(null);
    setLocationFilter(null);
    setMaxPrice(null);
  };

  // Back to restaurant list
  if (selectedRestaurant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.container}>
            <View style={styles.detailHeaderRow}>
              <Pressable onPress={() => setSelectedRestaurant(null)} style={{ padding: 6, marginRight: 8 }}>
                <Feather name="arrow-left" size={20} color="#111827" />
              </Pressable>
              <Text style={styles.detailHeaderTitle}>Restaurant details</Text>

              {/* CART ICON in detail header */}
              <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => router.push({ pathname: "/(order)/cart" } as any)} style={{ padding: 8 }}>
                  <Feather name="shopping-cart" size={20} color="#111827" />
                  {items.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{items.length}</Text>
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

            <View style={styles.tabsRow}>
              {(["order", "review", "info"] as const).map((tab) => {
                const label = tab === "order" ? "Order" : tab === "review" ? "Reviews" : "Information";
                const active = activeRestaurantTab === tab;
                return (
                  <Pressable key={tab} onPress={() => setActiveRestaurantTab(tab)} style={[styles.tabChip, active && styles.tabChipActive]}>
                    <Text style={[styles.tabChipText, active && { color: "#fff" }]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ marginTop: 16 }}>
              {activeRestaurantTab === "order" && (
                <View>
                  <Text style={styles.sectionTitle}>Popular items</Text>
                  {activeFoods.map((item) => (
                    <View key={item.id} style={styles.orderRow}>
                      <Image source={{ uri: item.img }} style={styles.orderImg} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.orderTitle}>{item.title}</Text>
                        <Text style={styles.orderPrice}>{item.price}</Text>
                        <View style={{ marginTop: 8, flexDirection: "row", gap: 8 }}>
                          <Pressable onPress={() => handleAddToCart(item)} style={styles.primaryBtnSmall}>
                            <Text style={{ color: "#fff", fontWeight: "700" }}>Add to cart</Text>
                          </Pressable>
                          <Pressable onPress={() => handleQuickOrder(item)} style={styles.secondaryBtnSmall}>
                            <Text style={{ fontWeight: "700" }}>Buy now</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {activeRestaurantTab === "review" && (
                <View>
                  <Text style={styles.sectionTitle}>Customer reviews</Text>
                  <Text style={{ marginTop: 8, color: "#6B7280" }}>★★★★☆ 4.5 average based on 120 reviews.</Text>
                  <Text style={{ marginTop: 8 }}>“Great food and quick delivery!” — User A</Text>
                  <Text style={{ marginTop: 4 }}>“Loved the ambience and the menu variety.” — User B</Text>
                </View>
              )}

              {activeRestaurantTab === "info" && (
                <View>
                  <Text style={styles.sectionTitle}>Information</Text>
                  <Text style={{ marginTop: 8 }}>Location: {selectedRestaurant.location}</Text>
                  <Text>Distance: {selectedRestaurant.distance}</Text>
                  <Text>Rating: ⭐ {selectedRestaurant.rating}</Text>
                  <Text style={{ marginTop: 8, color: "#6B7280" }}>Opening hours: 9:00 AM – 10:00 PM</Text>
                  <Text style={{ marginTop: 4, color: "#6B7280" }}>Contact: +234 800 000 0000</Text>
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
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Feather name="search" size={18} style={{ marginRight: 8 }} />
              <TextInput value={query} onChangeText={setQuery} placeholder="Search for dishes or restaurants" style={styles.searchInput} />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable style={styles.filterBtn} onPress={() => setShowFilter((p) => !p)}>
                <Feather name="sliders" size={18} color="#111827" />
              </Pressable>

              {/* Cart icon + badge */}
              <Pressable onPress={() => router.push({ pathname: "/(order)/cart" } as any)} style={{ padding: 8, marginLeft: 8 }}>
                <Feather name="shopping-cart" size={20} color="#111827" />
                {items.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{items.length}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {showFilter && (
            <View style={styles.filterPanel}>
              <View style={styles.filterHeaderRow}>
                <Text style={styles.filterTitle}>Filters</Text>
                <Pressable onPress={resetFilters}>
                  <Text style={styles.filterReset}>Reset</Text>
                </Pressable>
              </View>

              {/* Rating */}
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Rating</Text>
                <View style={styles.filterChipsRow}>
                  <Pressable onPress={() => toggleRating(4.0)} style={[styles.filterChip, minRating === 4.0 && styles.filterChipActive]}>
                    <Text style={[styles.filterChipText, minRating === 4.0 && { color: "#fff" }]}>4.0+</Text>
                  </Pressable>
                  <Pressable onPress={() => toggleRating(4.5)} style={[styles.filterChip, minRating === 4.5 && styles.filterChipActive]}>
                    <Text style={[styles.filterChipText, minRating === 4.5 && { color: "#fff" }]}>4.5+</Text>
                  </Pressable>
                </View>
              </View>

              {/* Distance */}
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Distance</Text>
                <View style={styles.filterChipsRow}>
                  <Pressable onPress={() => toggleDistance(0.5)} style={[styles.filterChip, maxDistance === 0.5 && styles.filterChipActive]}>
                    <Text style={[styles.filterChipText, maxDistance === 0.5 && { color: "#fff" }]}>{`< 0.5km`}</Text>
                  </Pressable>
                  <Pressable onPress={() => toggleDistance(1.0)} style={[styles.filterChip, maxDistance === 1.0 && styles.filterChipActive]}>
                    <Text style={[styles.filterChipText, maxDistance === 1.0 && { color: "#fff" }]}>{`< 1km`}</Text>
                  </Pressable>
                </View>
              </View>

              {/* Type */}
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Type</Text>
                <View style={styles.filterChipsRow}>
                  {["food", "drink", "snacks"].map((t) => (
                    <Pressable key={t} onPress={() => toggleType(t)} style={[styles.filterChip, typeFilter === t && styles.filterChipActive]}>
                      <Text style={[styles.filterChipText, typeFilter === t && { color: "#fff" }]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Location */}
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Location</Text>
                <View style={styles.filterChipsRow}>
                  {["Ikeja", "VI", "Sango"].map((loc) => (
                    <Pressable key={loc} onPress={() => toggleLocation(loc)} style={[styles.filterChip, locationFilter === loc && styles.filterChipActive]}>
                      <Text style={[styles.filterChipText, locationFilter === loc && { color: "#fff" }]}>{loc}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Price */}
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Price</Text>
                <View style={styles.filterChipsRow}>
                  <Pressable onPress={() => togglePrice(5)} style={[styles.filterChip, maxPrice === 5 && styles.filterChipActive]}>
                    <Text style={[styles.filterChipText, maxPrice === 5 && { color: "#fff" }]}>{`< $5`}</Text>
                  </Pressable>
                  <Pressable onPress={() => togglePrice(8)} style={[styles.filterChip, maxPrice === 8 && styles.filterChipActive]}>
                    <Text style={[styles.filterChipText, maxPrice === 8 && { color: "#fff" }]}>{`< $8`}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color="#185221" />
            <Text style={styles.locationText}>  Paris, France</Text>
          </View>

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
                  <Pressable onPress={() => setSelectedCategory(item.id)} style={[styles.consumableCard, active ? styles.consumableActive : styles.consumableInactive]}>
                    <Image source={{ uri: item.img }} style={styles.consumableImg} />
                    <Text style={[styles.consumableText, active && { color: "#fff" }]}>{item.name}</Text>
                  </Pressable>
                );
              }}
            />
          </View>

          <View style={{ marginTop: 18 }}>
            <Text style={styles.sectionTitle}>{selectedCategory.toUpperCase()}</Text>

            <FlatList
              data={activeFoods}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <View style={styles.menuCard}>
                  <Pressable onPress={() => setSelectedRestaurant(nearby[0])}>
                    <View style={styles.imageWrap}>
                      <Image source={{ uri: item.img }} style={styles.menuImg} />
                      <View style={styles.menuOverlay}>
                        <Text style={styles.menuTitleOverlay}>{item.title}</Text>
                        <Text style={styles.menuPriceOverlay}>{item.price}</Text>
                      </View>
                    </View>
                  </Pressable>

                  <View style={{ padding: 8 }}>
                    <Text style={{ fontWeight: "700" }}>{item.title}</Text>
                    <Text style={{ color: "#6B7280", marginTop: 4 }}>{item.price}</Text>
                    <View style={{ marginTop: 8, flexDirection: "row", gap: 8 }}>
                      <Pressable onPress={() => handleAddToCart(item)} style={styles.primaryBtnSmall}>
                        <Text style={{ color: "#fff", fontWeight: "700" }}>Add to cart</Text>
                      </Pressable>
                      <Pressable onPress={() => handleQuickOrder(item)} style={styles.secondaryBtnSmall}>
                        <Text style={{ fontWeight: "700" }}>Buy now</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
            />

            <FlatList
              data={secondGroup}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ paddingHorizontal: 8, marginTop: 12 }}
              renderItem={({ item }) => (
                <View style={styles.menuCard}>
                  <View style={styles.imageWrap}>
                    <Image source={{ uri: item.img }} style={styles.menuImg} />
                    <View style={styles.menuOverlay}>
                      <Text style={styles.menuTitleOverlay}>{item.title}</Text>
                      <Text style={styles.menuPriceOverlay}>{item.price}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>

          <View style={{ marginTop: 18, paddingHorizontal: 8 }}>
            <Text style={styles.sectionTitle}>Nearby restaurants</Text>
            {filteredNearby.map((r) => (
              <Pressable
                key={r.id}
                style={styles.restaurantRow}
                onPress={() => {
                  setSelectedRestaurant(r);
                  setActiveRestaurantTab("order");
                }}
              >
                <Image source={{ uri: r.img }} style={styles.restaurantImg} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.restaurantName}>{r.name}</Text>
                  <Text style={styles.restaurantMeta}>
                    {r.location} · {r.distance} · ⭐ {r.rating}
                  </Text>
                </View>
              </Pressable>
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

  filterPanel: {
    marginTop: 10,
    marginBottom: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  filterTitle: { fontSize: 14, fontWeight: "700" },
  filterReset: { fontSize: 12, color: "#6B7280" },
  filterRow: { marginTop: 6 },
  filterLabel: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  filterChipsRow: { flexDirection: "row", gap: 8 },
  filterChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: "#D1D5DB", backgroundColor: "#fff" },
  filterChipActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  filterChipText: { fontSize: 12, color: "#111827" },

  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  locationText: { fontSize: 13, color: "#6B7280" },

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
    right: -2,
    top: -6,
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
