import React, { useState } from "react";
import { StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton } from "../../src/shared/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const onContinue = () => {
    // TODO: trigger “send OTP” API
    router.push("/(auth)/reset-password");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Forgot password</Text>
            <Text style={styles.subtitle}>Enter your email to receive a reset code.</Text>
          </View>

          <View style={styles.form}>
            <LabeledField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              returnKeyType="done"
            />
          </View>

          <PrimaryButton title="Continue" onPress={onContinue} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, gap: 16, paddingTop: 80 },
  header: { marginBottom: 12, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "left" },
  subtitle: { fontSize: 14, opacity: 0.5, textAlign: "right", marginTop: 4 },
  form: { gap: 12, marginVertical: 8 },
});


