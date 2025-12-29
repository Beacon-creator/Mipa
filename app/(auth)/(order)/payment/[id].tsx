import { Stack, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as api from "../../../../src/shared/constants/api";


export default function PaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /*  Disable back  */
  useEffect(() => {
    const onBack = () => true;
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, []);

  /*  Fetch order  */
  const fetchOrder = useCallback(async () => {
    try {
      const res = await api.getOrderById(id);
      setOrder(res);

      if (res.paymentStatus === "paid") {
        router.replace({
          pathname: "/(auth)/(order)/order/[id]",
          params: { id },
        });
      }
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  /*  Polling  */
  useEffect(() => {
    fetchOrder();
    pollingRef.current = setInterval(fetchOrder, 5000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchOrder]);

  /*  Pay  */
  const handlePay = async () => {
    if (paying || order?.paymentStatus === "paid") return;

    setPaying(true);
    try {
      await api.payOrder(id);
      router.replace({
        pathname: "/(auth)/(order)/order/[id]",
        params: { id },
      });
    } catch (e: any) {
      Alert.alert("Payment failed", e.message ?? "Try again");
    } finally {
      setPaying(false);
    }
  };

  if (loading || !order) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Payment", headerBackVisible: false }} />

      <View style={{ padding: 16 }}>
        <Text style={styles.title}>Order Summary</Text>

        <View style={styles.card}>
          <Text>Order: {order.orderNumber}</Text>
          <Text>Total: ₦{order.totalAmount?.toFixed(2)}</Text>
          <Text>Status: {order.paymentStatus}</Text>
        </View>

        <Pressable
          onPress={handlePay}
          disabled={paying || order.paymentStatus === "paid"}
          style={[
            styles.button,
            order.paymentStatus === "paid" && styles.disabled,
          ]}
        >
          {paying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.text}>
              {order.paymentStatus === "paid" ? "Paid" : "Pay Now"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  card: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  disabled: { backgroundColor: "#9CA3AF" },
  text: { color: "#fff", fontWeight: "700" },
});
