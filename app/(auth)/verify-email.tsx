import React, { useMemo, useRef, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton, LinkText } from "../../src/shared/ui/Button";

export default function VerifyEmailScreen() {
  const cells = useMemo(() => [0, 1, 2, 3], []);
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]); // ✅ T[] form & typed correctly

  const setDigit = (i: number, v: string) => {
    const val = v.replace(/[^0-9]/g, "").slice(-1); // keep last digit
    const next = [...code];
    next[i] = val;
    setCode(next);

    if (val && i < 3) inputs.current[i + 1]?.focus();
    if (!val && i > 0) inputs.current[i - 1]?.focus();
  };

  const onKeyPress = (i: number, e: any) => {
    if (e.nativeEvent?.key === "Backspace" && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const otpString = code.join("");
  const canVerify = otpString.length === 4;

  const onVerify = () => {
    Keyboard.dismiss();
    // TODO: verify OTP via API, then navigate
    // router.push("/(auth)/congratulations");
  };

  const onResend = () => {
    // TODO: resend OTP API
    console.log("Resend OTP");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              We sent a 4-digit code to your email. Enter it below to continue.
            </Text>
          </View>

          <View style={styles.otpRow}>
            {cells.map((i) => (
              <TextInput
                key={i}
                // ✅ return void from ref callback
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                value={code[i]}
                onChangeText={(v) => setDigit(i, v)}
                onKeyPress={(e) => onKeyPress(i, e)}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                maxLength={1}
                autoFocus={i === 0}
                style={styles.otpCell}
              />
            ))}
          </View>

          <View style={{ alignItems: "center", marginTop: 12 }}>
            <Text style={styles.mutedText}>Didn’t receive the code?</Text>
            <LinkText title="Resend" onPress={onResend} />
          </View>

          <View style={{ height: 16 }} />
          <PrimaryButton title="Verify" onPress={onVerify} disabled={!canVerify} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 16, paddingHorizontal: 8 },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", opacity: 0.7, marginTop: 6, lineHeight: 20 },
  otpRow: { flexDirection: "row", gap: 12, alignSelf: "center", marginTop: 8 },
  otpCell: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  mutedText: { color: "#6B7280", marginBottom: 6 },
});
