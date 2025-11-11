import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import {LabeledField} from  "../../src/shared/ui/LabeledField";
import { PrimaryButton, LinkText } from "../../src/shared/ui/Button";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onContinue = () => {
    // TODO: perform basic validation / API call
    router.push("/(auth)/verify-email");
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
              value={pw}
              onChangeText={setPw}
              placeholder="••••••••"
              secureTextEntry
              returnKeyType="done"
            />
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
  container: { flex: 1, padding: 24, gap: 16, paddingTop: 80 },
  header: { marginBottom: 12, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "left" },
  subtitle: { fontSize: 14, opacity: 0.5, textAlign: "right", marginTop: 4 },
  form: { gap: 12, marginVertical: 8 },
});
