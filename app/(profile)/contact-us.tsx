// app/(profile)/contact-us.tsx
import React, { useState } from "react";
import { StatusBar, View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Stack } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton } from "../../src/shared/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import * as api from "../../src/shared/constants/api";

export default function ContactUsScreen() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    if (!subject || !message) {
      return Alert.alert("Error", "Subject and message are required");
    }
    setLoading(true);
    try {
      await api.contactUs(subject, message);
      Alert.alert("Sent", "Your message has been sent. We'll get back to you soon.");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "Contact us" }} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.text}>Have an issue or feedback? Send us a message.</Text>

        <View style={{ marginTop: 12 }}>
          <LabeledField label="Subject" value={subject} onChangeText={setSubject} />
          <LabeledField
            label="Message"
            value={message}
            onChangeText={setMessage}
            multiline
            style={{ height: 120, textAlignVertical: "top" }}
            placeholder="Describe your issue or question..."
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <PrimaryButton title={loading ? "Sending..." : "Send message"} onPress={onSend} disabled={loading} />
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={styles.subtle}>Or email us at support@example.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  text: { fontSize: 14 },
  subtle: { fontSize: 13, color: "#6B7280" },
});
