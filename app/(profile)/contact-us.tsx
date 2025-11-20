import React, { useState } from "react";
import { StatusBar, View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton } from "../../src/shared/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";



export default function ContactUsScreen() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const onSend = () => {
    // TODO: send to support
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
          <PrimaryButton title="Send message" onPress={onSend} />
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
