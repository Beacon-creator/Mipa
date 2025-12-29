import { Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

export default function FoodFilter() {
  const [selected, setSelected] = useState([]);

  const toggle = (v: string) => {
    setSelected((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const apply = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Filter</Text>

      <Text style={styles.section}>Food Category</Text>
      {["food", "drink", "cake", "snacks"].map((item) => (
        <Pressable
          key={item}
          onPress={() => toggle(item)}
          style={[
            styles.option,
            selected.includes(item) && styles.optionActive,
          ]}
        >
          <Text>{item}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.applyBtn} onPress={apply}>
        <Text style={styles.applyText}>Apply Filters</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 20 },
  section: { fontSize: 16, fontWeight: "700", marginTop: 16 },
  option: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E5E7EB",
    marginTop: 10,
  },
  optionActive: { backgroundColor: "#10B98122", borderColor: "#10B981" },
  applyBtn: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#10B981",
    borderRadius: 10,
    alignItems: "center",
  },
  applyText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
