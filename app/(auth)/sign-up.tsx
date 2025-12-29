import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { router } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton, LinkText } from "../../src/shared/ui/Button";
import { API_BASE, safeApiCall } from "../../src/shared/constants/api";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onContinue = async () => {
    if (!name?.trim() || !email?.trim() || !password) {
      Alert.alert("Validation", "Please fill name, email and password.");
      return;
    }

    const [data, error] = await safeApiCall(async () => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const text = await res.text();
      try { return text ? JSON.parse(text) : null; } catch { return { raw: text }; }
    });

    if (error) {
      Alert.alert("Signup Error", error.message);
      return;
    }

    const { user, verificationCode } = data ?? {};

    router.push({
      pathname: "/(auth)/verify-email",
      params: { email: user?.email, userId: user?.id, devCode: verificationCode },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create account and choose favorite menu.</Text>
          </View>

          <View style={styles.form}>
            <LabeledField label="Name" value={name} onChangeText={setName} autoCapitalize="words" autoCorrect={false} placeholder="Your Name" />
            <LabeledField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder="Your Email" />
            <LabeledField label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          </View>

          <PrimaryButton title="Continue" onPress={onContinue} />
          <View style={{ height: 12 }} />
          <LinkText title="Already have an account? Sign in" onPress={() => router.push("/(auth)/sign-in")} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, gap: 16, paddingTop: 40 },
  header: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 14, opacity: 0.5, marginTop: 10 },
  form: { gap: 12, marginBottom: 10 },
});
