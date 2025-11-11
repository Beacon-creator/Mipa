import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinkText, PrimaryButton } from "../../src/shared/ui/Button";

export default function TurnOnLocationScreen() {
  const [busy, setBusy] = useState(false);

  const onEnable = async () => {
    try {
      setBusy(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "You can enable location later in Settings.");
        router.push("/(auth)/signup-success");
        return;
      }
      // Optional: get current position
      // const position = await Location.getCurrentPositionAsync({});
      router.push("/(auth)/signup-success");
    } catch (e: any) {
      Alert.alert("Location error", e?.message ?? "Unable to get permission.");
      router.push("/(auth)/signup-success");
    } finally {
      setBusy(false);
    }
  };

  const onSkip = () => router.push("/(auth)/signup-success");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Image
          style={styles.illustration}
          resizeMode="contain"
          // Replace with your asset if available: require("@/shared/assets/location.png")
          source={{ uri: "https://picsum.photos/seed/location/1000/600" }}
        />
        <View style={styles.header}>
          <Text style={styles.title}>Turn on location</Text>
          <Text style={styles.subtitle}>
            Enable location to personalize your experience. You can change this at any time.
          </Text>
        </View>

        <PrimaryButton title={busy ? "Enabling..." : "Turn on"} onPress={onEnable} disabled={busy} />
        <View style={{ height: 10 }} />
        <LinkText title="Skip for now" onPress={onSkip} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, gap: 16, justifyContent: "center" },
  header: { alignItems: "center", paddingHorizontal: 8 },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 14, opacity: 0.5, textAlign: "center", marginTop: 4, lineHeight: 20 },
  illustration: { width: "100%", height: 220, marginBottom: 12, borderRadius: 12 },
});
