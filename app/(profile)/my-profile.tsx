import React, { useState } from "react";
import { StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton, SecondaryButton } from "../../src/shared/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyProfileScreen() {
  const [name, setName] = useState("Ada Lovelace");
  const [email, setEmail] = useState("ada@example.com");
  const [phone, setPhone] = useState("+234 801 234 5678");
  const [address, setAddress] = useState("12, Broad Street, Lagos");

  const onSave = () => {
    // TODO: call API to update profile
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "My profile" }} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={styles.heading}>Personal information</Text>

          <View style={{ marginTop: 12 }}>
            <LabeledField label="Full name" value={name} onChangeText={setName} />
            <LabeledField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <LabeledField label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <LabeledField
              label="Address"
              value={address}
              onChangeText={setAddress}
              multiline
              style={{ height: 80, textAlignVertical: "top" }}
            />
          </View>

          <View style={{ marginTop: 20, gap: 10 }}>
            <PrimaryButton title="Save changes" onPress={onSave} />
            <SecondaryButton title="Cancel" onPress={() => {}} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  heading: { fontSize: 16, fontWeight: "800" },
});
