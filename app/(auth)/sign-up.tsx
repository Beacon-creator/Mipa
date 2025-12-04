import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { router } from "expo-router";
import {LabeledField} from  "../../src/shared/ui/LabeledField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../../src/shared/constants/api";
import { PrimaryButton, LinkText } from "../../src/shared/ui/Button";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const onContinue = async () => {
  try {
    // basic local validation
    if (!name?.trim() || !email?.trim() || !password) {
      Alert.alert("Validation", "Please fill name, email and password.");
      return;
    }

    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
      const message = json?.error || json?.message || "Signup failed";
      Alert.alert("Signup error", message);
      return;
    }

    // expected dev response: { user, token, needsEmailVerification, verificationCode }
    const { user, token, verificationCode } = json;

    // store token for later authenticated calls
    await AsyncStorage.setItem("mipa_token", token);

    // navigate to verify email screen; pass email and userId (and dev verificationCode if you want)
    // in expo-router you can pass params as query string:
    router.push({
      pathname: "/(auth)/verify-email",
      params: { email: user.email, userId: user.id, devCode: verificationCode },
    });

    // NOTE: For production you will not pass the code. This is dev-only.
  } catch (err: any) {
    console.error("signup error", err);
    Alert.alert("Signup error", err?.message ?? "Something went wrong");
  }
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
            <LabeledField
              label="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              placeholder="Your Name"
              returnKeyType="next"
            />
            <LabeledField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Your Email"
              returnKeyType="next"
            />
            <LabeledField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              returnKeyType="done"
            />

              {/* <LabeledField
              label="Confirm Password"
              value={cpw}
              onChangeText={setCpw}
              placeholder="••••••••"
              secureTextEntry
              returnKeyType="done"
            /> */}
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
  header: { marginBottom: 12, justifyContent: "flex-start" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "left" },
  subtitle: { fontSize: 14, opacity: 0.5, justifyContent: "flex-start", marginTop: 10 },
  form: { gap: 12, marginBottom: 10 },
});
