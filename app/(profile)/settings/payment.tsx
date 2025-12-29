import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

type Card = {
  id: string;
  brand: string;
  last4: string;
  isDefault: boolean;
};

const initialCards: Card[] = [
  { id: "c1", brand: "Visa", last4: "1234", isDefault: true },
  { id: "c2", brand: "Mastercard", last4: "5678", isDefault: false },
];

export default function PaymentSettingsScreen() {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const setDefault = (id: string) => {
    setCards((prev) =>
      prev.map((c) => ({ ...c, isDefault: c.id === id }))
    );
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const addCard = () => {
  
    const newId = `c${Date.now()}`;
    const newCard: Card = {
      id: newId,
      brand: "Visa",
      last4: String(Math.floor(Math.random() * 9000) + 1000),
      isDefault: cards.length === 0, 
    };
    setCards((prev) => [...prev, newCard]);
    Alert.alert("Card added", `New ${newCard.brand} •••• ${newCard.last4} added.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "Payment settings" }} />

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Saved cards</Text>
          <Pressable onPress={addCard} style={styles.addBtn}>
            <Text style={styles.addText}>+ Add card</Text>
          </Pressable>
        </View>

        {cards.length === 0 && (
          <Text style={styles.emptyText}>No cards saved yet. Add one to get started.</Text>
        )}

        {cards.map((card) => (
          <View key={card.id} style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>
                {card.brand} •••• {card.last4}
              </Text>
              <Text style={styles.cardMeta}>
                {card.isDefault ? "Default payment method" : "Tap to make default"}
              </Text>
            </View>

            <View style={styles.actions}>
              {!card.isDefault && (
                <Pressable onPress={() => setDefault(card.id)} style={styles.defaultBtn}>
                  <Text style={styles.defaultText}>Set default</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => removeCard(card.id)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  header: { fontSize: 18, fontWeight: "800" },
  addBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  addText: { color: "#047857", fontWeight: "700", fontSize: 13 },
  emptyText: { marginTop: 8, color: "#6B7280" },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardMeta: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  defaultBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  defaultText: { fontSize: 12, color: "#047857", fontWeight: "600" },
  removeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  removeText: { fontSize: 12, color: "#B91C1C", fontWeight: "600" },
});
