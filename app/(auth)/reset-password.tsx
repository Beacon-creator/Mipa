import React, { useState, useEffect } from "react";
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
} from "react-native";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton } from "../../src/shared/ui/Button";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE } from "../../src/shared/constants/api";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const prefilledEmail = (params?.email ?? "") as string;

  const [email, setEmail] = useState(prefilledEmail);
  const [token, setToken] = useState(""); // token = OTP from email
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefilledEmail) setEmail(prefilledEmail);
  }, [prefilledEmail]);

  const onReset = async () => {
    if (!email?.trim()) {
      Alert.alert("Validation", "Please provide an email (or go back to request code).");
      return;
    }
    if (!token?.trim() || token.trim().length < 4) {
      Alert.alert("Invalid token", "Please enter the 4-digit verification token.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Password too short", "Use at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords don't match", "Please confirm your new password.");
      return;
    }

    setLoading(true);
    try {
      Keyboard.dismiss();
      const payload = {
        email: email.trim(),
        token: token.trim(), // matches resetPasswordSchema
        newPassword: newPassword,
      };

      const res = await fetch(`${API_BASE}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json?.error || json?.message || "Failed to reset password";
        Alert.alert("Reset failed", msg);
        setLoading(false);
        return;
      }

      // success — navigate to success or sign-in
      router.push("/(auth)/signup-success");
    } catch (err: any) {
      console.error("reset password error", err);
      Alert.alert("Error", err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Verify token & reset</Text>
            <Text style={styles.subtitle}>Enter the token sent to your email, then set a new password.</Text>
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
              returnKeyType="next"
            />
            <LabeledField
              label="Verification token"
              value={token}
              onChangeText={setToken}
              keyboardType="number-pad"
              placeholder="4-digit token"
              returnKeyType="next"
            />
            <LabeledField
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="••••••••"
              returnKeyType="next"
            />
            <LabeledField
              label="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="••••••••"
              returnKeyType="done"
            />
          </View>

          <PrimaryButton title={loading ? "Resetting..." : "Reset password"} onPress={onReset} disabled={loading} />
          {loading ? <ActivityIndicator style={{ marginTop: 10 }} /> : null}
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
