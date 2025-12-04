// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import {CartProvider} from "../../src/shared/ui/CartContext";

export default function TabLayout() {
  return (
    <CartProvider>
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="order" options={{ title: "Order" }} />
      <Tabs.Screen name="my-list" options={{ title: "My List" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
    </CartProvider>
  );
}
