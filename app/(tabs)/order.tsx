import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as api from "../../src/shared/constants/api";
import { safeApiCall } from "../../src/shared/constants/safeApiCall";

/* ================= TYPES ================= */

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "cancelled";

type UIOrder = {
  id: string;
  restaurantName: string;
  status: OrderStatus;
  itemsSummary: string;
  total: string;
  paymentStatus: string;
  createdAt: string;
};

/* ================= HELPERS ================= */

const formatCurrency = (amount: number) =>
  `₦${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;

const dateGroup = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return "Older";
};

/* ================= SCREEN ================= */

export default function OrderTab() {
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    const [res, err] = await safeApiCall(() => api.listMyOrders());

    if (err) {
      Alert.alert("Error", err.message || "Failed to fetch orders");
      return;
    }

    if (!Array.isArray(res)) return;

    const mapped: UIOrder[] = res
      .map((o: any, index: number) => {
        const id = o.id || o._id;
        if (!id) return null;

        const itemsCount = (o.items || []).reduce(
          (s: number, i: any) => s + (i.quantity || 0),
          0
        );

        const itemNames = (o.items || [])
          .slice(0, 2)
          .map((i: any) => i.name)
          .join(", ");

        return {
          id: String(id),
          restaurantName: o.restaurant?.name ?? "Restaurant",
          status: o.status,
          itemsSummary: `${itemsCount} item${
            itemsCount !== 1 ? "s" : ""
          } · ${itemNames}`,
          total: formatCurrency(o.totalAmount || 0),
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
        };
      })
      .filter(Boolean)
      // newest first
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

    setOrders(mapped);
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  /* ================= GROUPING ================= */

  const activeOrders = useMemo(
    () =>
      orders.filter(
        (o) => o.status !== "delivered" && o.status !== "cancelled"
      ),
    [orders]
  );

  const groupedPastOrders = useMemo(() => {
    const groups: Record<string, UIOrder[]> = {
      Today: [],
      Yesterday: [],
      Older: [],
    };

    orders
      .filter(
        (o) => o.status === "delivered" || o.status === "cancelled"
      )
      .forEach((o) => {
        groups[dateGroup(o.createdAt)].push(o);
      });

    return groups;
  }, [orders]);

  /* ================= RENDER ================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.content}
      >
        <Text style={styles.header}>Orders</Text>

        <Text style={styles.section}>Active Orders</Text>

        {loading ? (
          <ActivityIndicator />
        ) : activeOrders.length === 0 ? (
          <Text style={styles.empty}>No active orders</Text>
        ) : (
          activeOrders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))
        )}

        <Text style={[styles.section, { marginTop: 24 }]}>Past Orders</Text>

        {(["Today", "Yesterday", "Older"] as const).map((label) =>
          groupedPastOrders[label].length === 0 ? null : (
            <View key={label}>
              <Text style={styles.group}>{label}</Text>
              {groupedPastOrders[label].map((o) => (
                <OrderCard key={o.id} order={o} />
              ))}
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= CARD ================= */

function OrderCard({ order }: { order: UIOrder }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/order/[id]",
          params: { id: order.id },
        } as any)
      }
    >
      <Image
        source={{ uri: "https://via.placeholder.com/64x64.png?text=🍽️" }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.restaurant}>{order.restaurantName}</Text>
        <Text style={styles.meta}>{order.itemsSummary}</Text>
        <Text style={styles.total}>{order.total}</Text>
      </View>
    </Pressable>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
  section: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  group: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginVertical: 6,
  },
  empty: {
    color: "#6B7280",
  },
  card: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF", // 🔥 FIX
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurant: {
    fontSize: 15,
    fontWeight: "700",
  },
  meta: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 2,
  },
  total: {
    fontSize: 14,
    fontWeight: "700",
  },
});
