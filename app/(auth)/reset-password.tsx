import React, { useState } from "react";
import { StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton } from "../../src/shared/ui/Button";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const onReset = () => {
    if (pw.length < 6) {
      Alert.alert("Password too short", "Use at least 6 characters.");
      return;
    }
    if (pw !== pw2) {
      Alert.alert("Passwords don't match", "Please confirm your new password.");
      return;
    }
    // TODO: verify OTP + reset password via API
    router.push("/(auth)/signup-success");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Verify code & reset</Text>
            <Text style={styles.subtitle}>Enter the code sent to your email, then set a new password.</Text>
          </View>

          <View style={styles.form}>
            <LabeledField
              label="Verification code"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              placeholder="4-digit code"
              returnKeyType="next"
            />
            <LabeledField
              label="New password"
              value={pw}
              onChangeText={setPw}
              secureTextEntry
              placeholder="••••••••"
              returnKeyType="next"
            />
            <LabeledField
              label="Confirm new password"
              value={pw2}
              onChangeText={setPw2}
              secureTextEntry
              placeholder="••••••••"
              returnKeyType="done"
            />
          </View>

          <PrimaryButton title="Reset password" onPress={onReset} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, gap: 16, paddingTop: 40 },
  header: { marginBottom: 12, justifyContent: "flex-start" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "left" },
  subtitle: { fontSize: 14, opacity: 0.5, justifyContent: "flex-start", marginTop: 10 },
  form: { gap: 12, marginBottom: 10 },
});

