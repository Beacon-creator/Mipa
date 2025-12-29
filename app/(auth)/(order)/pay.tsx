import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../../../src/shared/constants/api";
import { PrimaryButton } from "../../../src/shared/ui/Button";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type Order = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "paid" | "unpaid";
  status: string;
};

export default function PayOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  //  Fetch order 
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Session expired", "Please sign in again.");
          router.replace("/(auth)/sign-in");
          return;
        }

        const res = await axios.get(`${API_BASE}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(res.data);
      } catch (err: any) {
        Alert.alert(
          "Error",
          err?.response?.data?.message || "Could not load order"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) loadOrder();
  }, [id]);

  //  Pay 
  const handlePay = async () => {
    if (!order) return;

    if (order.paymentStatus === "paid") {
      Alert.alert("Already paid", "This order has already been paid.");
      return;
    }

    setPaying(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Missing token");

      await axios.post(
        `${API_BASE}/orders/${order.id}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Payment successful 🎉", "Your order is confirmed.");

router.replace({
  pathname: "/(auth)/(order)/order/[id]",
  params: { id },
});

    } catch (err: any) {
      Alert.alert(
        "Payment failed",
        err?.response?.data?.message || "Could not process payment"
      );
    } finally {
      setPaying(false);
    }
  };

  //  UI 
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Order not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.orderNo}>#{order.orderNumber}</Text>

        {/* Items */}
        <View style={styles.card}>
          {order.items.map((it, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.itemName}>
                {it.quantity} × {it.name}
              </Text>
              <Text style={styles.itemPrice}>
                ₦{it.subtotal.toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₦{order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Status */}
        <Text style={styles.status}>
          Payment status:{" "}
          <Text
            style={{
              fontWeight: "700",
              color:
                order.paymentStatus === "paid" ? "#10B981" : "#F59E0B",
            }}
          >
            {order.paymentStatus.toUpperCase()}
          </Text>
        </Text>

        {/* Pay button */}
        <PrimaryButton
          title={
            order.paymentStatus === "paid"
              ? "Already Paid"
              : paying
              ? "Processing..."
              : "Pay Now"
          }
          onPress={handlePay}
          disabled={paying || order.paymentStatus === "paid"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 22, fontWeight: "800" },
  orderNo: { color: "#6B7280", marginBottom: 8 },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  itemName: { fontSize: 14 },
  itemPrice: { fontWeight: "700" },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  totalLabel: { fontWeight: "700" },
  totalValue: { fontWeight: "800", fontSize: 16 },
  status: { marginVertical: 8 },
});
