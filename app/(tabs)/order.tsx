import React, { useEffect, useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as api from "../../src/shared/constants/api";

type OrderStatus = "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";

type UIOrder = {
  id: string;
  restaurantName: string;
  restaurantImg?: string;
  status: OrderStatus;
  eta?: string | null;
  dateLabel: string;
  itemsSummary: string;
  total: string; // formatted
  paymentStatus?: string;
  createdAt?: string;
};

function statusLabel(status: OrderStatus) {
  if (status === "on_the_way") return "On the way";
  if (status === "delivered") return "Delivered";
  if (status === "preparing") return "Preparing";
  if (status === "confirmed") return "Confirmed";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
}

function statusColor(status: OrderStatus) {
  if (status === "on_the_way") return "#F97316";
  if (status === "delivered") return "#10B981";
  if (status === "cancelled") return "#EF4444";
  return "#6B7280";
}

export default function OrderScreen() {
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingOrderId, setActionLoadingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.listMyOrders();
      // backend returns array of order DTOs (toOrderDTO)
      const items = Array.isArray(res) ? res : res.orders ?? res;
      const mapped: UIOrder[] = (items || []).map((o: any) => {
        // Compose a short items summary: "2 items · Burger, Fries"
        const itemNames = (o.items || []).slice(0, 3).map((it: any) => it.name);
        const itemsCount = (o.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0);
        const itemsSummary = `${itemsCount} item${itemsCount !== 1 ? "s" : ""} · ${itemNames.join(", ")}`;

        // date label --- use createdAt
        const created = o.createdAt ? new Date(o.createdAt) : null;
        let dateLabel = "Unknown";
        if (created) {
          const now = new Date();
          const sameDay = created.toDateString() === now.toDateString();
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          if (sameDay) dateLabel = "Today";
          else if (created.toDateString() === yesterday.toDateString()) dateLabel = "Yesterday";
          else dateLabel = created.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        }

        const total = typeof o.totalAmount === "number" ? `${formatCurrency(o.totalAmount)}` : `${o.totalAmount ?? ""}`;

        const restaurantName =
          typeof o.restaurant === "object" ? o.restaurant.name || "Restaurant" : (o.restaurant as string) || "Restaurant";

        return {
          id: o.id || o._id,
          restaurantName,
          restaurantImg: undefined, // backend doesn't return restaurant image; use placeholder if you want
          status: o.status as OrderStatus,
          eta: null,
          dateLabel,
          itemsSummary,
          total,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
        };
      });
      setOrders(mapped);
    } catch (err: any) {
      console.warn("Failed to load orders", err);
      Alert.alert("Error", err?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
    } finally {
      setRefreshing(false);
    }
  };

  // Determine currentOrder = most recent non-delivered and non-cancelled, else null
  const currentOrder = useMemo(() => {
    return orders.find((o) => o.status !== "delivered" && o.status !== "cancelled") ?? null;
  }, [orders]);

  const pastOrders = useMemo(() => {
    // past = delivered or cancelled OR everything except the currentOrder
    return orders.filter((o) => o.id !== (currentOrder?.id ?? ""));
  }, [orders, currentOrder]);

  const handleMarkPaid = async (orderId: string) => {
    setActionLoadingOrderId(orderId);
    try {
      await api.markOrderPaid(orderId, { paymentStatus: "paid", paymentMethod: "card" });
      Alert.alert("Success", "Order marked as paid");
      await fetchOrders();
    } catch (err: any) {
      console.warn("mark paid error", err);
      Alert.alert("Error", err?.message || "Failed to mark paid");
    } finally {
      setActionLoadingOrderId(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Orders</Text>
          <Pressable
            onPress={fetchOrders}
            style={{ padding: 8 }}
            accessibilityLabel="Refresh orders"
          >
            <Feather name="refresh-cw" size={18} color="#111827" />
          </Pressable>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Current order</Text>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 12 }} />
          ) : currentOrder ? (
            <View style={styles.currentCard}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{
                    uri:
                      currentOrder.restaurantImg ??
                      "https://via.placeholder.com/96x96.png?text=R",
                  }}
                  style={styles.currentImg}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.currentRestaurant}>{currentOrder.restaurantName}</Text>
                  <Text style={styles.currentMeta}>{currentOrder.itemsSummary}</Text>
                  <Text style={styles.currentMeta}>Placed: {currentOrder.dateLabel}</Text>
                </View>
              </View>

              <View style={styles.currentFooterRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor(currentOrder.status) }]} />
                  <Text style={styles.statusText}>{statusLabel(currentOrder.status as any)}</Text>
                </View>
                <Text style={styles.currentTotal}>{currentOrder.total}</Text>
              </View>

              <View style={styles.currentActionsRow}>
                <Pressable
                  style={[styles.primaryBtn]}
                  onPress={() => {
                    // Navigate to details later (if you implement order details)
                  router.push({ pathname: "/(tabs)/order/[id]", params: { id: currentOrder.id } } as any);
                  }}
                >
                  <Feather name="map" size={16} color="#fff" />
                  <Text style={styles.primaryBtnText}>Track order</Text>
                </Pressable>

                {currentOrder.paymentStatus !== "paid" ? (
                  <Pressable
                    style={[styles.secondaryBtn, { marginLeft: 8 }]}
                    onPress={() =>
                      Alert.alert("Mark paid", "Mark this order as paid?", [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Yes",
                          onPress: () => handleMarkPaid(currentOrder.id),
                        },
                      ])
                    }
                    disabled={actionLoadingOrderId === currentOrder.id}
                  >
                    {actionLoadingOrderId === currentOrder.id ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={styles.secondaryBtnText}>Mark as paid</Text>
                    )}
                  </Pressable>
                ) : (
                  <Pressable
                    style={[styles.secondaryBtn, { marginLeft: 8 }]}
                    onPress={() => router.push("/(tabs)/home")}
                  >
                    <Text style={styles.secondaryBtnText}>Browse more</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No active orders</Text>
              <Text style={styles.emptySubtitle}>When you place an order, it will show up here.</Text>
              <Pressable style={styles.primaryBtn} onPress={() => router.push("/(tabs)/home")}>
                <Text style={styles.primaryBtnText}>Start ordering</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={{ marginTop: 24 }}>
          <View style={styles.pastHeaderRow}>
            <Text style={styles.sectionTitle}>Past orders</Text>
          </View>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 12 }} />
          ) : pastOrders.length === 0 ? (
            <Text style={{ marginTop: 12, color: "#6B7280" }}>No past orders yet.</Text>
          ) : (
            pastOrders.map((o) => (
              <Pressable
                key={o.id}
                style={styles.pastCard}
                onPress={() => {
                  router.push({ pathname: "/(tabs)/order/[id]", params: { id: o.id } } as any);
                }}
              >
                <Image source={{ uri: o.restaurantImg ?? "https://via.placeholder.com/64.png?text=R" }} style={styles.pastImg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.pastRestaurant}>{o.restaurantName}</Text>
                  <Text style={styles.pastMeta}>{o.dateLabel} · {o.itemsSummary}</Text>
                  <View style={styles.pastFooterRow}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={[styles.statusDot, { backgroundColor: statusColor(o.status) }]} />
                      <Text style={styles.statusText}>{statusLabel(o.status as any)}</Text>
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

// small currency formatter — adjust for your locale/currency
function formatCurrency(amount: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
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
    backgroundColor: "#fff",
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
