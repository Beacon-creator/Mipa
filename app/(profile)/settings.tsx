import React from "react";
import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: "Settings" }} />
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <Pressable
          style={styles.row}
          onPress={() => router.push("/(profile)/settings/payment")}
        >
          <Text style={styles.rowLabel}>Payment settings</Text>
          <Text style={styles.rowArrow}>›</Text>
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => router.push("/(profile)/settings/app-settings")}
        >
          <Text style={styles.rowLabel}>App settings</Text>
          <Text style={styles.rowArrow}>›</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 16 },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: { fontSize: 15 },
  rowArrow: { fontSize: 18, color: "#9CA3AF" },
});
