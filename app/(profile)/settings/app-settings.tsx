import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, Pressable, StatusBar, Alert } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppSettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState<"en" | "fr">("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));
  };

  const onAboutPress = () => {
    Alert.alert(
      "About us",
      "Mipa helps you discover nearby restaurants, order your favourite meals, and track deliveries in real time."
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "App settings" }} />

      <View style={styles.container}>
        {/* Toggles */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>Dark mode</Text>
              <Text style={styles.rowMeta}>Use a darker theme to reduce eye strain.</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>Notifications</Text>
              <Text style={styles.rowMeta}>Order status updates and promotions.</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          </View>
        </View>

        {/* Language & About */}
        <View style={styles.card}>
          <Pressable style={styles.row} onPress={toggleLanguage}>
            <View>
              <Text style={styles.rowTitle}>Language</Text>
              <Text style={styles.rowMeta}>Current: {language === "en" ? "English" : "Français"}</Text>
            </View>
          </Pressable>

          <Pressable style={styles.row} onPress={onAboutPress}>
            <View>
              <Text style={styles.rowTitle}>About us</Text>
              <Text style={styles.rowMeta}>Learn more about this app.</Text>
            </View>
          </Pressable>

          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.rowTitle}>Version</Text>
              <Text style={styles.rowMeta}>1.0.0</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { flex: 1, padding: 16, gap: 16 },
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  rowTitle: { fontSize: 15, fontWeight: "700" },
  rowMeta: { fontSize: 13, color: "#6B7280", marginTop: 2, maxWidth: 220 },
});
