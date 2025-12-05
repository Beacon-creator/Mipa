import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as api from "../../../../src/shared/constants/api";
import { safeApiCall } from "../../../../src/shared/constants/safeApiCall";

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams();
  const id = (params.id as string) ?? "";

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

const fetchOrder = useCallback(async () => {
  setLoading(true);
  const [res, err] = await safeApiCall(() => api.getOrderById(id));
  if (err) {
    Alert.alert("Error", err.message || "Failed to load order");
    setOrder(null);
  } else {
    setOrder(res);
  }
  setLoading(false);
}, [id]);


useEffect(() => {
  if (!id) return;
  fetchOrder();
}, [id, fetchOrder]); 

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text>No order found</Text>
      </SafeAreaView>
    );
  }

  const items = order.items ?? [];
  const address = order.address ?? {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: `Order ${order.orderNumber ?? order.id}` }} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Order Summary */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: "700", fontSize: 18 }}>Order summary</Text>
          <Text style={{ color: "#6B7280", marginTop: 6 }}>
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown date"}
          </Text>
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>Items</Text>
          <FlatList
            data={items}
            keyExtractor={(i: any, idx) => `${i.menuItem}-${idx}`}
            scrollEnabled={false}
            renderItem={({ item }: any) => (
              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "700" }}>{item.name}</Text>
                  <Text style={{ color: "#6B7280" }}>{item.quantity} × ₦{item.price?.toFixed(2) ?? "0.00"}</Text>
                </View>
                <Text style={{ fontWeight: "700" }}>₦{item.subtotal?.toFixed(2) ?? "0.00"}</Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View style={{ borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 8, marginTop: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: "#6B7280" }}>Subtotal</Text>
                  <Text style={{ fontWeight: "700" }}>₦{order.totalAmount?.toFixed(2) ?? "0.00"}</Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* Delivery Address */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>Delivery address</Text>
          {address.fullName && <Text>{address.fullName}</Text>}
          <Text>{address.line1 ?? ""}</Text>
          {address.line2 ? <Text>{address.line2}</Text> : null}
          <Text>
            {address.city ?? ""}{address.state ? `, ${address.state}` : ""}
          </Text>
          {address.phone && <Text>{address.phone}</Text>}
        </View>

        {/* Status */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>Status</Text>
          <Text style={{ marginBottom: 8 }}>{order.status ?? "Unknown"}</Text>
          <Text style={{ color: "#6B7280" }}>Payment: {order.paymentStatus ?? "Unknown"}</Text>
        </View>

        {/* Refresh Button */}
        <View style={{ marginTop: 16 }}>
          <Pressable
            onPress={fetchOrder}
            style={styles.button}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700" }}>Refresh</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  button: { backgroundColor: "#111827", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
});
