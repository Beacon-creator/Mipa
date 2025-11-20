// app/(tabs)/order.tsx
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// If you already have shared buttons, you can later swap these
// Pressables for <PrimaryButton /> / <SecondaryButton />.

type OrderStatus = "ongoing" | "delivered" | "cancelled";

type Order = {
  id: string;
  restaurant: string;
  restaurantImg: string;
  status: OrderStatus;
  eta?: string;            // for ongoing
  date: string;
  itemsSummary: string;    // "2 items · Burger, Fries"
  total: string;           // "$12.50"
};

const currentOrder: Order | null = {
  id: "o1",
  restaurant: "Joe's Diner",
  restaurantImg: "https://tinyurl.com/3j9hrfa5",
  status: "ongoing",
  eta: "20–25 min",
  date: "Today",
  itemsSummary: "2 items · Burger, Fries",
  total: "$11.50",
};

const pastOrders: Order[] = [
  {
    id: "o2",
    restaurant: "Bella Bistro",
    restaurantImg: "https://tinyurl.com/yjdymmnn",
    status: "delivered",
    date: "Yesterday",
    itemsSummary: "3 items · Pizza, Salad, Drink",
    total: "$18.90",
  },
  {
    id: "o3",
    restaurant: "Cobi Food",
    restaurantImg: "https://tinyurl.com/yjdymmnn",
    status: "delivered",
    date: "Aug 10",
    itemsSummary: "1 item · Jollof Rice",
    total: "$6.00",
  },
];

export default function OrderScreen() {
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");

  const visiblePastOrders =
    filterStatus === "all"
      ? pastOrders
      : pastOrders.filter((o) => o.status === filterStatus);

  const statusLabel = (status: OrderStatus) => {
    if (status === "ongoing") return "On the way";
    if (status === "delivered") return "Delivered";
    return "Cancelled";
  };

  const statusColor = (status: OrderStatus) => {
    if (status === "ongoing") return "#F97316"; // orange
    if (status === "delivered") return "#10B981"; // green
    return "#EF4444"; // red
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>

        {/* Current / ongoing order */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Current order</Text>

          {currentOrder ? (
            <View style={styles.currentCard}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{ uri: currentOrder.restaurantImg }}
                  style={styles.currentImg}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.currentRestaurant}>
                    {currentOrder.restaurant}
                  </Text>
                  <Text style={styles.currentMeta}>
                    {currentOrder.itemsSummary}
                  </Text>
                  <Text style={styles.currentMeta}>
                    ETA: {currentOrder.eta ?? "—"}
                  </Text>
                </View>
              </View>

              <View style={styles.currentFooterRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusColor(currentOrder.status) },
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {statusLabel(currentOrder.status)}
                  </Text>
                </View>
                <Text style={styles.currentTotal}>{currentOrder.total}</Text>
              </View>

              <View style={styles.currentActionsRow}>
                <Pressable
                  style={[styles.primaryBtn]}
                  onPress={() => {
                    // Could navigate to a tracking screen or map later
                  }}
                >
                  <Feather name="map" size={16} color="#fff" />
                  <Text style={styles.primaryBtnText}>Track order</Text>
                </Pressable>
                <Pressable
                  style={[styles.secondaryBtn]}
                  onPress={() => {
                    // e.g. navigate to home / help
                    router.push("/(tabs)/home");
                  }}
                >
                  <Text style={styles.secondaryBtnText}>Browse more</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No active orders</Text>
              <Text style={styles.emptySubtitle}>
                When you place an order, it will show up here.
              </Text>
              <Pressable
                style={styles.primaryBtn}
                onPress={() => router.push("/(tabs)/home")}
              >
                <Text style={styles.primaryBtnText}>Start ordering</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Past orders */}
        <View style={{ marginTop: 24 }}>
          <View style={styles.pastHeaderRow}>
            <Text style={styles.sectionTitle}>Past orders</Text>

            {/* Small status filter chips */}
            <View style={styles.statusFilterRow}>
              {(["all", "ongoing", "delivered", "cancelled"] as const).map(
                (key) => {
                  const isActive = filterStatus === key;
                  const label =
                    key === "all"
                      ? "All"
                      : key === "ongoing"
                      ? "Ongoing"
                      : key === "delivered"
                      ? "Delivered"
                      : "Cancelled";
                  return (
                    <Pressable
                      key={key}
                      onPress={() => setFilterStatus(key)}
                      style={[
                        styles.statusChip,
                        isActive && styles.statusChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          isActive && { color: "#fff" },
                        ]}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>

          {visiblePastOrders.length === 0 ? (
            <Text style={{ marginTop: 12, color: "#6B7280" }}>
              No orders found for this filter.
            </Text>
          ) : (
            visiblePastOrders.map((o) => (
              <Pressable
                key={o.id}
                style={styles.pastCard}
                onPress={() => {
                  // Later you can expand into an order details screen or modal
                }}
              >
                <Image
                  source={{ uri: o.restaurantImg }}
                  style={styles.pastImg}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.pastRestaurant}>{o.restaurant}</Text>
                  <Text style={styles.pastMeta}>
                    {o.date} · {o.itemsSummary}
                  </Text>
                  <View style={styles.pastFooterRow}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: statusColor(o.status) },
                        ]}
                      />
                      <Text style={styles.statusText}>
                        {statusLabel(o.status)}
                      </Text>
                    </View>
                    <Text style={styles.pastTotal}>{o.total}</Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  // Current order card
  currentCard: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  currentImg: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  currentRestaurant: {
    fontSize: 16,
    fontWeight: "800",
  },
  currentMeta: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },
  currentFooterRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#4B5563",
  },
  currentTotal: {
    fontSize: 15,
    fontWeight: "700",
  },
  currentActionsRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },

  // Buttons (local styling but matches the style we’ve been using)
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 4,
  },
  secondaryBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#111827",
  },
  secondaryBtnText: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111827",
  },

  // Empty state
  emptyBox: {
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 6,
  },

  // Past orders
  pastHeaderRow: {
    flexDirection: "column",
    gap: 6,
  },
  statusFilterRow: {
    flexDirection: "row",
    gap: 6,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  statusChipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },

  pastCard: {
    flexDirection: "row",
    marginTop: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pastImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  pastRestaurant: {
    fontSize: 15,
    fontWeight: "700",
  },
  pastMeta: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  pastFooterRow: {
    flexDirection: "row",
    marginTop: 6,
    justifyContent: "space-between",
    alignItems: "center",
  },
  pastTotal: {
    fontSize: 14,
    fontWeight: "700",
  },
});
