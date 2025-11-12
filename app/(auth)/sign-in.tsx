import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton, GhostButton } from "@/shared/ui/Button";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onLogin = () => {
    // TODO: call login API
    // router.replace("/(app)/home");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header sits closer to the top */}
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

          <PrimaryButton title="Log in" onPress={onLogin} />
          <View style={{ height: 12 }} />
          <GhostButton title="Forgot password?" onPress={() => router.push("/(auth)/forgot-password")} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, justifyContent: "flex-start" },
  header: { marginTop: 12, marginBottom: 18, alignItems: "flex-start" }, // closer to top-left-ish
  title: { fontSize: 20, fontWeight: "700", textAlign: "left" },
  form: { gap: 12, marginBottom: 16 },
});
