
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OrderService } from "../../src/shared/constants/api";
import * as api from "../../src/shared/constants/api";
import { useUser } from "../../src/shared/constants/useUser";
import { useCart } from "../../src/shared/ui/CartContext";
import { RestaurantCard } from "../../src/shared/ui/RestaurantCard";
import { SearchHeader } from "../../src/shared/ui/SearchHeader";
import { FiltersPanel } from "../../src/shared/ui/FiltersPanel";
import { FoodCard } from "../../src/shared/ui/FoodCard";

const categories = [
  { id: "all", name: "All" },
  { id: "food", name: "Food" },
  { id: "drink", name: "Drink" },
  { id: "cake", name: "Cake" },
  { id: "salad", name: "Salad" },
  { id: "snacks", name: "Snacks" },
];

function looksLikeObjectId(id?: string) {
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);

  const { items: cartItemsFull, addToCart } = useCart();
  const { user } = useUser();
  const cartMenuItemIds = useMemo(() => cartItemsFull.map((i) => i.menuItemId), [cartItemsFull]);

  //  Animated Filter 
  const filterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(filterAnim, {
      toValue: showFilter ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [showFilter, filterAnim]);

  const filterHeight = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // adjust height as needed
  });

  //  Debounced Search 
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [query]);

  //  Load Data 
  useEffect(() => {
    let mounted = true;
    const loadRestaurants = async () => {
      setLoadingRestaurants(true);
      try {
        const res = (await api.getRestaurants?.({ limit: 50 })) ?? [];
        if (!mounted) return;
        setRestaurants(res ?? []);
      } catch (err: any) {
        Alert.alert("Error", err?.message ?? "Could not fetch restaurants");
      } finally {
        if (mounted) setLoadingRestaurants(false);
      }
    };
    loadRestaurants();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadMenu = async () => {
      try {
        const items = (await api.getMenuItems?.(undefined, { limit: 50 })) ?? [];
        if (!mounted) return;
        const normalized = (items ?? []).map((it: any) => ({
          ...it,
          restaurantId: it.restaurant ?? it.restaurantId,
          id: it.id ?? it._id,
          title: (it.name ?? it.title ?? "").toLowerCase(),
          img: it.imageUrl ?? it.img,
        }));
        setMenuItems(normalized);
      } catch (err: any) {
        Alert.alert("Error", err?.message ?? "Could not fetch menu items");
      }
    };
    loadMenu();
    return () => {
      mounted = false;
    };
  }, []);

  //  Filtered Items 
  const activeFoods = useMemo(() => {
    let list = menuItems;
    if (selectedCategory !== "all") {
      list = list.filter((f) => (f.type ?? "").toLowerCase() === selectedCategory.toLowerCase());
    }
    if (debouncedQuery) list = list.filter((f) => (f.title ?? "").includes(debouncedQuery));
    if (typeFilter) list = list.filter((f) => f.type === typeFilter);
    if (maxPrice != null) list = list.filter((f) => Number(f.price) <= maxPrice);
    return list;
  }, [menuItems, selectedCategory, debouncedQuery, typeFilter, maxPrice]);

  const filteredNearby = useMemo(() => {
    return (restaurants ?? []).filter((r) => {
      if (debouncedQuery && !(r.name ?? "").toLowerCase().includes(debouncedQuery)) return false;
      if (minRating != null && Number(r.rating ?? 0) < minRating) return false;
      if (maxDistance != null && (Number(r.distanceKm ?? r.distance) || 0) > maxDistance) return false;
      if (locationFilter && r.location !== locationFilter) return false;
      if (maxPrice != null && (r.avgPrice ?? r.priceLevel ?? 0) > maxPrice) return false;
      return true;
    });
  }, [restaurants, debouncedQuery, minRating, maxDistance, locationFilter, maxPrice]);

  //  Handlers 
  const handleAddToCart = useCallback(
    (menuItem: any) => {
      const menuItemId = menuItem.id ?? menuItem._id;
      const restaurantId = menuItem.restaurantId ?? menuItem.restaurant ?? menuItem.restaurant_id;
      if (!looksLikeObjectId(menuItemId) || !looksLikeObjectId(restaurantId)) {
        Alert.alert("Cannot add to cart", "This item is not available for ordering.");
        return;
      }
      addToCart(
        {
          menuItemId,
          title: menuItem.title ?? menuItem.name ?? menuItem.title,
          price: Number(menuItem.price ?? 0),
          img: menuItem.img ?? menuItem.imageUrl,
          restaurantId,
        },
        1
      );
    },
    [addToCart]
  );

  const handleQuickOrder = useCallback(
    async (menuItem: any) => {
      const menuItemId = menuItem.id ?? menuItem._id;
      const restaurantId = menuItem.restaurantId ?? menuItem.restaurant ?? menuItem.restaurant_id;

      if (!looksLikeObjectId(menuItemId) || !looksLikeObjectId(restaurantId)) {
        Alert.alert("Sorry", "This item is not available for ordering.");
        return;
      }

      if (!user) {
        Alert.alert("Sign in required", "Please sign in to place an order.");
        return;
      }

      if (!user.address || !user.address.line1) {
        Alert.alert("Address required", "Please add your delivery address in your profile before placing orders.");
        return;
      }

      const payload = {
        restaurantId,
        items: [{ menuItemId, quantity: 1 }],
        address: {
          fullName: user.name ?? undefined,
          phone: user.address.phone ?? undefined,
          line1: user.address.line1,
          city: user.address.city ?? undefined,
          state: user.address.state ?? undefined,
          country: user.address.country ?? undefined,
          postalCode: user.address.postalCode ?? undefined,
        },
        paymentMethod: "card" as const,
      };

      try {
        const res = await OrderService.quickOrder(payload);
        const orderId = res.id ?? res._id ?? res.orderNumber;

        Alert.alert("Order placed", `Your order #${orderId} has been placed successfully!`);
      } catch (err: any) {
        Alert.alert("Order failed", err?.response?.data?.message ?? err?.message ?? "Could not place order");
      }
    },
    [user]
  );

  const renderRestaurant = useCallback(
    ({ item }: { item: any }) => (
      <RestaurantCard
        restaurant={{
          id: item.id ?? item._id,
          name: item.name,
          img: item.imageUrl ?? item.img,
          distance: String(item.distanceKm ?? item.distance ?? ""),
          rating: item.rating ?? 0,
          location: item.location ?? "",
        }}
        onPress={() => {}}
      />
    ),
    []
  );

  //  Render 
  if (loadingRestaurants) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />

      {/*  Search Header  */}
      <View style={{ paddingHorizontal: 16 }}>
        <SearchHeader query={query} setQuery={setQuery} onFilterToggle={() => setShowFilter((p) => !p)} />

        <Animated.View style={{ height: filterHeight, overflow: "hidden" }}>
          <FiltersPanel
            minRating={minRating}
            maxDistance={maxDistance}
            typeFilter={typeFilter}
            locationFilter={locationFilter}
            maxPrice={maxPrice}
            toggleRating={(v) => setMinRating((p) => (p === v ? null : v))}
            toggleDistance={(v) => setMaxDistance((p) => (p === v ? null : v))}
            toggleType={(v) => setTypeFilter((p) => (p === v ? null : v))}
            toggleLocation={(v) => setLocationFilter((p) => (p === v ? null : v))}
            togglePrice={(v) => setMaxPrice((p) => (p === v ? null : v))}
            resetFilters={() => {
              setMinRating(null);
              setMaxDistance(null);
              setTypeFilter(null);
              setLocationFilter(null);
              setMaxPrice(null);
            }}
          />
        </Animated.View>
      </View>

      {/*  Nearby Restaurants  */}
<FlatList
  data={filteredNearby}
  keyExtractor={(r) => r.id ?? r._id}
  renderItem={renderRestaurant}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 100 }}
  ListHeaderComponent={
    <>
      {/*  Categories */}
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
              selectedCategory === item.id
                ? styles.consumableActive
                : styles.consumableInactive,
            ]}
          >
            <Text
              style={[
                styles.consumableText,
                selectedCategory === item.id && { color: "#fff" },
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      />

      {/*  Menu Items */}
      <FlatList
        data={activeFoods}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.id ?? i._id}
        renderItem={({ item }) => (
          <FoodCard
            item={{
              id: item.id ?? item._id,
              title: item.title,
              price: item.price,
              img: item.img,
              restaurantId: item.restaurantId ?? item.restaurant,
              type: item.type,
              isAvailable: item.isAvailable ?? true,
            }}
            onQuickOrder={() => handleQuickOrder(item)}
            onAddToCart={() => handleAddToCart(item)}
            isInCart={cartMenuItemIds.includes(item.id ?? item._id)}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      />
    </>
  }
  ListEmptyComponent={() =>
    !loadingRestaurants ? (
      <View style={{ padding: 24 }}>
        <Text style={{ color: "#6B7280" }}>No restaurants found.</Text>
      </View>
    ) : null
  }
/>

    </SafeAreaView>
  );
}

//  Styles 
const styles = StyleSheet.create({
  consumableCard: { width: 90, height: 110, borderRadius: 14, marginHorizontal: 8, padding: 8, alignItems: "center", justifyContent: "center" },
  consumableActive: { backgroundColor: "#10B981" },
  consumableInactive: { backgroundColor: "#F3F4F6" },
  consumableText: { fontSize: 13, fontWeight: "700", color: "#111827" },
});
