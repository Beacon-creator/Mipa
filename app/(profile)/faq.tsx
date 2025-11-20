import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";

// Enable animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  {
    id: 1,
    question: "How do I place an order?",
    answer:
      "Browse through categories, select a restaurant, choose your preferred meal, and tap the Order button. You can track your order in real-time.",
  },
  {
    id: 2,
    question: "How do I reset my password?",
    answer:
      "Go to the Profile tab → Change Password. Follow the on-screen instructions to update your password securely.",
  },
  {
    id: 3,
    question: "How do I update my profile information?",
    answer:
      "Navigate to Profile → My Profile. There you can update your name, email, address, or phone number.",
  },
  {
    id: 4,
    question: "How can I contact support?",
    answer:
      "Use the Contact Us page where you can send us a direct message or view available support options.",
  },
  {
    id: 5,
    question: "Is my payment information secure?",
    answer:
      "Absolutely. We use industry-standard encryption and do not store your card details on our servers.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    LayoutAnimation.easeInEaseOut();
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "FAQ" }} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {faqData.map(item => {
          const isOpen = openId === item.id;
          return (
            <View key={item.id} style={styles.card}>
              <Pressable onPress={() => toggle(item.id)} style={styles.row}>
                <Text style={styles.question}>{item.question}</Text>
                <Feather
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#111827"
                />
              </Pressable>

              {isOpen && <Text style={styles.answer}>{item.answer}</Text>}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    paddingRight: 8,
  },
  answer: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
});
