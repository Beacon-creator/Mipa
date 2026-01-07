import React, { useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton } from "../../src/shared/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE } from "../../src/shared/constants/api";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    if (!email?.trim()) {
      Alert.alert("Validation", "Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      Keyboard.dismiss();
      const res = await fetch(`${API_BASE}/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const json = await res.json();
const resetToken = json?.resetToken || json?.token || "";
      if (!res.ok) {
        const msg = json?.error || json?.message || "Failed to send reset code";
        Alert.alert("Error", msg);
        setLoading(false);
        return;
      }

      router.push({
        pathname: "/(auth)/reset-password",
        params: { email: email.trim(), token: resetToken },
      });
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Absolute back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#185221" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Forgot password</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive a reset code.
            </Text>
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

          <PrimaryButton
            title={loading ? "Sending..." : "Continue"}
            onPress={onContinue}
            disabled={loading}
          />
          {loading ? <ActivityIndicator style={{ marginTop: 10 }} /> : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, gap: 16, paddingTop: 40 },
  backButton: {
    position: "absolute",
    top: 30,
    left: 24,
    zIndex: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  header: { marginBottom: 12, justifyContent: "flex-start" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  subtitle: { fontSize: 14, opacity: 0.5, textAlign: "center", marginTop: 15 },
  form: { gap: 12, marginBottom: 10 },
});
