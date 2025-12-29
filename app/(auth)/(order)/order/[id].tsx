import { Stack, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as api from "../../../../src/shared/constants/api";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /*  Disable back  */
  useEffect(() => {
    const onBack = () => true;
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, []);

  /*  Fetch  */
  const fetchOrder = useCallback(async () => {
    try {
      const res = await api.getOrderById(id);
      setOrder(res);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /*  Polling  */
  useEffect(() => {
    fetchOrder();
    pollingRef.current = setInterval(fetchOrder, 7000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchOrder]);

  if (loading || !order) {
    return <ActivityIndicator style={{ marginTop: 24 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{ title: `Order ${order.orderNumber}`, headerBackVisible: false }}
      />

      <View style={{ padding: 16 }}>
        <FlatList
          data={order.items}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text>{item.name}</Text>
              <Text>{item.quantity} × ₦{item.price}</Text>
            </View>
          )}
        />

        <View style={styles.card}>
          <Text>Status: {order.status}</Text>
          <Text>Payment: {order.paymentStatus}</Text>
          <Text>Total: ₦{order.totalAmount?.toFixed(2)}</Text>
        </View>

        <Text
          style={styles.home}
          onPress={() =>
            router.replace({ pathname: "/(tabs)/home" })
          }
        >
          Back to Home
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  card: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  home: {
    marginTop: 24,
    textAlign: "center",
    fontWeight: "700",
    color: "#10B981",
  },
});
