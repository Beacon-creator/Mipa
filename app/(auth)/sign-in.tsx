import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { LabeledField } from  "../../src/shared/ui/LabeledField";
import { PrimaryButton, LinkText } from "../../src/shared/ui/Button";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onLogin = () => {
    // TODO: call login API
    // router.replace("/(app)/home"); // when main app area exists
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

          <PrimaryButton title="Log in" onPress={onLogin} />
          <View style={{ height: 12 }} />
          <LinkText title="Forgot password?" onPress={() => router.push("/(auth)/forgot-password")} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, gap: 16, justifyContent: "center" },
  header: { marginBottom: 12, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 14, opacity: 0.7, textAlign: "center", marginTop: 4 },
  form: { gap: 12, marginVertical: 8 },
});
