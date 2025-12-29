import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE } from "../../../src/shared/constants/api";
import { useUser } from "../../../src/shared/constants/useUser";
import { useCart } from "../../../src/shared/ui/CartContext";

export default function CartScreen() {
  const { items, updateQty, removeFromCart, clearCart, totalAmount, loading } = useCart();
  const { user } = useUser();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [addressLine1, setAddressLine1] = useState(user?.address?.line1 ?? "");
  const [city, setCity] = useState(user?.address?.city ?? "");
  const [phone, setPhone] = useState(user?.address?.phone ?? "");

  const total = useMemo(() => totalAmount(), [totalAmount]);

  const handleCheckout = async () => {
    if (!items.length) return Alert.alert("Cart is empty");
    if (!addressLine1 || !city || !phone) return Alert.alert("Please fill address & phone");
    if (!user?.token) {
      Alert.alert("Not signed in", "Please sign in to place an order.");
      router.push("/(auth)/sign-in");
      return;
    }

    // Validate all items
    for (const it of items) {
      if (!it.menuItemId || !it.restaurantId) {
        return Alert.alert("Invalid cart item", "One or more items are missing IDs.");
      }
    }

    // Ensure all items are from the same restaurant
    const restaurantId = items[0].restaurantId;
    if (!items.every(it => it.restaurantId === restaurantId)) {
      return Alert.alert("Mixed restaurants", "Cart contains items from multiple restaurants.");
    }

    setCheckoutLoading(true);

    try {
      const payload = {
        restaurantId,
        items: items.map(it => ({ menuItemId: it.menuItemId, quantity: it.quantity })),
        address: {
          fullName: user.name ?? "",
          line1: addressLine1,
          city,
          phone,
          state: user.address?.state,
          country: user.address?.country,
          postalCode: user.address?.postalCode,
        },
        paymentMethod: "card",
      };

      const res = await axios.post(`${API_BASE}/orders`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const orderId = res.data.orderNumber ?? res.data.order?.id ?? res.data.order?._id;
      Alert.alert("Order placed", `Order: ${orderId}`);
      clearCart();
      router.push({
  pathname: "/(order)/pay",
  params: { id: orderId },
} as any);


    } catch (err: any) {
      Alert.alert("Checkout failed", err?.response?.data?.message || err?.message || "Could not place order");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 12 }}>Your cart</Text>

          <FlatList
            data={items}
            keyExtractor={i => i.menuItemId}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <View style={{ padding: 12 }}>
                <Text style={{ color: "#6B7280" }}>Your cart is empty</Text>
                <Pressable
                  style={[styles.primaryBtn, { marginTop: 12 }]}
                  onPress={() => router.push({ pathname: "/(tabs)/home" } as any)}
                >
                  <Text style={styles.primaryBtnText}>Start ordering</Text>
                </Pressable>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "800" }}>{item.title}</Text>
                  <Text style={{ color: "#6B7280" }}>
                    {item.quantity} × ₦{Number(item.price).toFixed(2)}
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
                    <Pressable onPress={() => updateQty(item.menuItemId, item.quantity - 1)} style={styles.qtyBtn}>
                      <Text>-</Text>
                    </Pressable>
                    <TextInput
                      value={String(item.quantity)}
                      onChangeText={t => {
                        const v = Number(t.replace(/\D/g, ""));
                        if (!Number.isNaN(v)) updateQty(item.menuItemId, v);
                      }}
                      keyboardType="number-pad"
                      style={{ width: 36, textAlign: "center", borderBottomWidth: 1, borderColor: "#E5E7EB" }}
                    />
                    <Pressable onPress={() => updateQty(item.menuItemId, item.quantity + 1)} style={styles.qtyBtn}>
                      <Text>+</Text>
                    </Pressable>
                    <Pressable onPress={() => removeFromCart(item.menuItemId)} style={{ marginLeft: 12 }}>
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </Pressable>
                  </View>
                </View>

                <Text style={{ fontWeight: "700" }}>₦{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            )}
          />

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 8 }}>Delivery address</Text>
            <TextInput value={addressLine1} onChangeText={setAddressLine1} placeholder="Address line 1" style={styles.input} />
            <TextInput value={city} onChangeText={setCity} placeholder="City" style={styles.input} />
            <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" style={styles.input} />
          </View>

          <View style={styles.checkoutRow}>
            <View>
              <Text style={{ color: "#6B7280" }}>Total</Text>
              <Text style={{ fontWeight: "800", fontSize: 18 }}>₦{total.toFixed(2)}</Text>
            </View>

            <Pressable style={[styles.primaryBtn, { minWidth: 140 }]} onPress={handleCheckout} disabled={checkoutLoading}>
              {checkoutLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Checkout</Text>}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: "#E5E7EB" },
  primaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, backgroundColor: "#111827" },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 14, marginLeft: 4 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 8, marginBottom: 8 },
  checkoutRow: { marginTop: 20, marginBottom: 60, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
