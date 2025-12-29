import { useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    id: "q1",
    question: "How do I place an order?",
    answer:
      "Browse the home screen, select a restaurant, choose items from the Order tab, then tap the checkout button to confirm.",
  },
  {
    id: "q2",
    question: "How are delivery fees calculated?",
    answer:
      "Delivery fees depend on the distance between your location and the restaurant, and may vary during peak hours.",
  },
  {
    id: "q3",
    question: "Can I change or cancel my order?",
    answer:
      "You can change or cancel an order only before the restaurant starts preparing it. Go to Orders and check the order status.",
  },
  {
    id: "q4",
    question: "What payment methods are supported?",
    answer:
      "We support debit and credit cards, and in some regions, wallet and pay-on-delivery options. Manage them under Payment Settings.",
  },
  {
    id: "q5",
    question: "How do I contact support?",
    answer:
      "Use the Contact Us section in your profile or send us an email from there. Our support team is available 24/7.",
  },
];

export default function FaqScreen() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "FAQ" }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Frequently Asked Questions</Text>
        <Text style={styles.subHeader}>
          Find quick answers to common questions.
        </Text>

        {faqs.map((item) => {
          const open = item.id === openId;
          return (
            <View key={item.id} style={styles.card}>
              <Pressable
                onPress={() => setOpenId(open ? null : item.id)}
                style={styles.questionRow}
              >
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.chevron}>{open ? "−" : "+"}</Text>
              </Pressable>
              {open && <Text style={styles.answer}>{item.answer}</Text>}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  subHeader: { fontSize: 14, color: "#6B7280", marginBottom: 16 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: { flex: 1, fontSize: 15, fontWeight: "600", marginRight: 8 },
  chevron: { fontSize: 20, color: "#6B7280", fontWeight: "600" },
  answer: { marginTop: 6, fontSize: 14, color: "#4B5563", lineHeight: 20 },
});
