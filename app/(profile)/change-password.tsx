import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton } from "../../src/shared/ui/Button";

export default function ChangePasswordScreen() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const onSave = () => {
    // TODO: validate + API
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "Change password" }} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={styles.heading}>Update your password</Text>

          <View style={{ marginTop: 12 }}>
            <LabeledField
              label="Current password"
              value={currentPw}
              onChangeText={setCurrentPw}
              secureTextEntry
              placeholder="••••••••"
            />
            <LabeledField
              label="New password"
              value={newPw}
              onChangeText={setNewPw}
              secureTextEntry
              placeholder="••••••••"
            />
            <LabeledField
              label="Confirm new password"
              value={confirmPw}
              onChangeText={setConfirmPw}
              secureTextEntry
              placeholder="••••••••"
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <PrimaryButton title="Save password" onPress={onSave} />
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
