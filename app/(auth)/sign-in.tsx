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
} from "react-native";
import { router } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton, LinkText } from "../../src/shared/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../../src/shared/constants/api";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    // basic validation
    if (!email?.trim() || !pw) {
      Alert.alert("Validation", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      Keyboard.dismiss();
      const res =await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: pw }),
      });

      const json = await res.json();

      if (!res.ok) {
        const message = json?.error || json?.message || "Login failed";
        Alert.alert("Login failed", message);
        setLoading(false);
        return;
      }

      // expected response: { token: "...", user: { ... } } (adjust if different)
      const token = json?.token ?? json?.accessToken ?? null;
      if (!token) {
        Alert.alert("Login failed", "No token returned from server.");
        setLoading(false);
        return;
      }

      // persist token
      await AsyncStorage.setItem("mipa_token", token);

      // navigate to the app — replace history so user can't go back to auth
      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.error("login error", err);
      Alert.alert("Login error", err?.message ?? "Something went wrong");
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
            <Text style={styles.title}>Sign In</Text>
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
              label="Password"
              value={pw}
              onChangeText={setPw}
              placeholder="••••••••"
              secureTextEntry
              returnKeyType="done"
            />
          </View>

          <PrimaryButton title={loading ? "Logging in..." : "Log in"} onPress={onLogin} disabled={loading} />
          {loading ? <ActivityIndicator style={{ marginTop: 10 }} /> : null}

          <View style={{ height: 10 }} />
          <LinkText title="Forgot password?" onPress={() => router.push("/(auth)/forgot-password")} />
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
  form: { gap: 12, marginBottom: 12 },
});
