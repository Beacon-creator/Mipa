import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable } from "react-native";
import { Stack } from "expo-router";

const appVersion = "1.0.0";

export default function AppSettingsScreen() {
  const [language, setLanguage] = useState<"en" | "fr" | "yo">("en");

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: "App settings" }} />
      <View style={styles.container}>
        {/* About us */}
        <Text style={styles.sectionTitle}>About us</Text>
        <Text style={styles.aboutText}>
          Mipa helps you discover nearby restaurants, order your favourite meals, and track your
          deliveries in real time. Our goal is to make great food more accessible, wherever you are.
        </Text>

        {/* Change language */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Language</Text>
        <View style={styles.languageRow}>
          {(["en", "fr", "yo"] as const).map((code) => {
            const label = code === "en" ? "English" : code === "fr" ? "French" : "Yoruba";
            const active = language === code;
            return (
              <Pressable
                key={code}
                onPress={() => setLanguage(code)}
                style={[
                  styles.langChip,
                  active && styles.langChipActive,
                ]}
              >
                <Text style={[styles.langText, active && { color: "#fff" }]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Version */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Version</Text>
        <Text style={styles.versionText}>Mipa v{appVersion}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },
  aboutText: { fontSize: 13, color: "#4B5563", lineHeight: 20 },

  languageRow: { flexDirection: "row", gap: 8 },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  langChipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  langText: { fontSize: 13, fontWeight: "600", color: "#111827" },

  versionText: { fontSize: 13, color: "#6B7280" },
});
