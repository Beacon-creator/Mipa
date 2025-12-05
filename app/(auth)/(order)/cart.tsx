// app/(auth)/(order)/cart.tsx
import * as api from "../../../src/shared/constants/api";
import { useCart } from "../../../src/shared/ui/CartContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const { items, updateQty, removeFromCart, clearCart, totalAmount, loading } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // address inputs (previously unused setters caused eslint warnings)
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  // include totalAmount in deps to satisfy lint
  const total = useMemo(() => totalAmount(), [ totalAmount]);

  const handleCheckout = async () => {
    if (items.length === 0) return Alert.alert("Cart is empty");
    if (!addressLine1 || !city || !phone) return Alert.alert("Please fill address & phone");

    setCheckoutLoading(true);
    try {
      const payload = {
        restaurantId: items[0].restaurantId || "r1",
        items: items.map((it) => ({ menuItemId: it.menuItemId, quantity: it.quantity })),
        address: {
          line1: addressLine1,
          city,
          country: "Nigeria",
          phone,
        },
        // explicit literal to match TS union type
        paymentMethod: "card" as const,
        notes: "",
      };

      const order = await api.createOrder(payload);

      Alert.alert("Order placed", `Order: ${order.orderNumber ?? order.id ?? "Ok"}`);

      // clear cart after successful order
      clearCart();

      // navigate to order details (use pathname + params and cast to any to satisfy expo-router typing)
      router.push({ pathname: "/(order)/order/[id]", params: { id: order.id ?? order._id ?? order.orderNumber } } as any);
    } catch (err: any) {
      console.warn("checkout error", err);
      Alert.alert("Checkout failed", err?.message || "Could not place order");
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
            keyExtractor={(i) => i.menuItemId}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <View style={{ padding: 12 }}>
                <Text style={{ color: "#6B7280" }}>Your cart is empty</Text>
                <Pressable style={[styles.primaryBtn, { marginTop: 12 }]} onPress={() => router.push({ pathname: "/(tabs)/home" } as any)}>
                  <Text style={styles.primaryBtnText}>Start ordering</Text>
                </Pressable>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Image source={{ uri: item.img || "https://via.placeholder.com/80" }} style={styles.img} />
                <View style={{ flex: 1, marginLeft: 12 }}>
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
                      onChangeText={(t) => {
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

          {/* Address inputs (now used) */}
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 8 }}>Delivery address</Text>
            <TextInput
              value={addressLine1}
              onChangeText={setAddressLine1}
              placeholder="Address line 1"
              style={{ borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 8, marginBottom: 8 }}
            />
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="City"
              style={{ borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 8, marginBottom: 8 }}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              keyboardType="phone-pad"
              style={{ borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 8 }}
            />
          </View>

          <View style={{ marginTop: 20, marginBottom: 60, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
  row: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  img: { width: 80, height: 60, borderRadius: 8, backgroundColor: "#E5E7EB" },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
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
  checkoutBox: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
