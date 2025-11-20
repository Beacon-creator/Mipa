import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, TextInput, Modal } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


type Card = {
  id: string;
  brand: string;
  last4: string;
  isDefault: boolean;
};

export default function PaymentSettingsScreen() {
  const [cards, setCards] = useState<Card[]>([
    { id: "1", brand: "Visa", last4: "1234", isDefault: true },
    { id: "2", brand: "Mastercard", last4: "5678", isDefault: false },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [brand, setBrand] = useState("");
  const [last4, setLast4] = useState("");

  const setDefault = (id: string) => {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === id,
      }))
    );
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const onAddCard = () => {
    if (!brand.trim() || last4.length !== 4) {
      Alert.alert("Incomplete", "Please enter a brand and the last 4 digits.");
      return;
    }
    setCards((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        brand: brand.trim(),
        last4,
        isDefault: prev.length === 0,
      },
    ]);
    setBrand("");
    setLast4("");
    setShowAdd(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: "Payment settings" }} />
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Saved cards</Text>

        {cards.map((card) => (
          <View key={card.id} style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardBrand}>{card.brand}</Text>
              <Text style={styles.cardMeta}>•••• •••• •••• {card.last4}</Text>
              {card.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
            </View>

            {!card.isDefault && (
              <Pressable
                style={styles.smallBtn}
                onPress={() => setDefault(card.id)}
              >
                <Text style={styles.smallBtnText}>Make default</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.smallBtn, { marginLeft: 8 }]}
              onPress={() => removeCard(card.id)}
            >
              <Text style={styles.smallBtnText}>Remove</Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.addBtn} onPress={() => setShowAdd(true)}>
          <Text style={styles.addBtnText}>+ Add new card</Text>
        </Pressable>
      </View>

      {/* Simple Add Card modal */}
      <Modal visible={showAdd} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add new card</Text>

            <Text style={styles.inputLabel}>Card brand</Text>
            <TextInput
              value={brand}
              onChangeText={setBrand}
              placeholder="e.g. Visa"
              style={styles.input}
            />
            <Text style={styles.inputLabel}>Last 4 digits</Text>
            <TextInput
              value={last4}
              onChangeText={setLast4}
              placeholder="1234"
              keyboardType="number-pad"
              maxLength={4}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#E5E7EB" }]}
                onPress={() => {
                  setShowAdd(false);
                  setBrand("");
                  setLast4("");
                }}
              >
                <Text style={{ fontWeight: "600" }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#111827" }]}
                onPress={onAddCard}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cardBrand: { fontSize: 15, fontWeight: "700" },
  cardMeta: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  defaultBadge: {
    marginTop: 4,
    fontSize: 11,
    color: "#10B981",
    fontWeight: "700",
  },
  smallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  smallBtnText: { fontSize: 12, fontWeight: "600" },
  addBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#111827",
  },
  addBtnText: { fontWeight: "700" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#fff",
  },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  inputLabel: { fontSize: 13, fontWeight: "600", marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
