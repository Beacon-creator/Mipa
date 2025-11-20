import React from "react";
import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "Settings" }} />

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <Pressable
          style={styles.row}
          onPress={() => router.push("/(profile)/settings/payment")}
        >
          <Text style={styles.rowTitle}>Payment settings</Text>
          <Text style={styles.rowMeta}>Manage your saved cards</Text>
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => router.push("/(profile)/settings/app-settings")}
        >
          <Text style={styles.rowTitle}>App settings</Text>
          <Text style={styles.rowMeta}>Theme, language, and more</Text>
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
  },
  rowTitle: { fontSize: 16, fontWeight: "700" },
  rowMeta: { fontSize: 13, color: "#6B7280", marginTop: 4 },
});
