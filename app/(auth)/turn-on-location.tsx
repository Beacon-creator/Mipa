import * as Location from "expo-location";
import React, { useState } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import locationImg from "../../assets/images/body/location.png";
import { PrimaryButton, SecondaryButton, GhostButton } from "../../src/shared/ui/Button";

export default function TurnOnLocation() {
  const [busy, setBusy] = useState(false);

  const request = async () => {
    try {
      setBusy(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        // (optional) const loc = await Location.getCurrentPositionAsync({});
        router.push("/(auth)/signup-success");
      } else {
        Alert.alert("Permission needed", "Please enable location to continue.");
      }
    } catch (e: any) {
      Alert.alert("Location error", e?.message ?? "Unable to get permission.");
      router.push("/(auth)/signup-success");
    } finally {
      setBusy(false);
    }
  };

  const skip = () => router.push("/(auth)/signup-success");

  return (
    <View style={styles.container}>
      <Image source={locationImg} style={styles.illustration} resizeMode="contain" />
      <View style={styles.header}>
        <Text style={styles.title}>Turn on location</Text>
        <Text style={styles.subtitle}>
          Enable location to personalize your experience. You can change this later.
        </Text>
      </View>

      <PrimaryButton title={busy ? "Enabling..." : "Turn on"} onPress={request} disabled={busy} />
      <View style={{ height: 10 }} />
      <SecondaryButton title="Skip for now" onPress={skip} />
      <View style={{ height: 8 }} />
      <GhostButton title="Why we need location" onPress={() => Alert.alert("Location", "Used to show nearby restaurants and relevant content.")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center", gap: 12 },
  illustration: { width: 220, height: 160, marginBottom: 8, borderRadius: 8 },
  header: { alignItems: "center", paddingHorizontal: 8, marginBottom: 6 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 14, opacity: 0.75, textAlign: "center", marginTop: 6, lineHeight: 20 },
});
