import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton, LinkText } from "../../src/shared/ui/Button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_BASE } from "../../src/shared/constants/api";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; devCode?: string }>();
  const userEmail = (params?.email ?? "") as string; // email passed as param from sign-up
  const devCode = (params?.devCode ?? null) as string | null;

  const cells = useMemo(() => [0, 1, 2, 3], []);
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // 1) If devCode is passed (from signup), autofill on mount
  useEffect(() => {
    if (devCode && typeof devCode === "string" && devCode.length === 4) {
      const arr = devCode.split("");
      setCode(arr);
      // focus last input (optional)
      setTimeout(() => inputs.current[3]?.focus(), 50);
    }
  }, [devCode]);

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

  async function verifyApi(email: string, codeStr: string) {
    const url = `${API_BASE}/auth/verify-email`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: codeStr }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || json?.message || "Verify failed");
    return json;
  }

  async function resendApi(email: string) {
    // endpoint to request a fresh verification code (dev: returns code in response)
    const url = `${API_BASE}/auth/resend-verification`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Failed to resend");
    return json; // expect { verificationCode?: "1234" }
  }

  const onVerify = async () => {
    if (!userEmail) {
      Alert.alert("Missing email", "No email provided. Please go back and sign up again.");
      return;
    }

    if (!canVerify) return;

    setLoading(true);
    try {
    await verifyApi(userEmail, otpString);
      Keyboard.dismiss();
      router.push("/(auth)/signup-success");
    } catch (err: any) {
      console.error("verify error", err);
      Alert.alert("Verification failed", err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2) Watch otpString and auto-submit when 4 digits are present.
  // Debounce a little so focus changes settle.
  useEffect(() => {
    if (otpString.length !== 4) return;

    // Avoid auto-submitting if already submitting (loading) or if user is currently pressing Resend
    if (loading || resendLoading) return;

    const t = setTimeout(() => {
      // double-check the guard
      if (otpString.length === 4 && !loading) {
        onVerify();
      }
    }, 250);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpString]);

  const onResend = async () => {
    if (!userEmail) {
      Alert.alert("Missing email", "No email provided. Please go back and sign up again.");
      return;
    }

    setResendLoading(true);
    try {
      const json = await resendApi(userEmail);
      // If backend returns verificationCode (dev), autofill & optionally auto-verify
      const returned = (json && (json.verificationCode || json.resetCode)) ?? null;

      if (returned && typeof returned === "string" && returned.length === 4) {
        // fill code automatically
        const arr = returned.split("");
        setCode(arr);
        // focus last input and auto-verify after tiny delay
        inputs.current[3]?.focus();
        setTimeout(() => {
          onVerify();
        }, 600);
      } else {
        Alert.alert("Code sent", "A verification code was generated. Check the app (dev) or email (prod).");
      }
    } catch (err: any) {
      console.error("resend error", err);
      Alert.alert("Resend failed", err.message || "Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              We sent a 4-digit code to {userEmail || "your email"}. It will auto-fill for development.
            </Text>
          </View>

          <View style={styles.otpRow}>
            {cells.map((i) => (
              <TextInput
                key={i}
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
            <View style={{ marginTop: 6 }}>
              <LinkText title="Resend" onPress={onResend} />
            </View>
            {resendLoading ? <ActivityIndicator style={{ marginTop: 8 }} /> : null}
          </View>

          <View style={{ height: 16 }} />
          <PrimaryButton title="Verify" onPress={onVerify} disabled={!canVerify || loading} />
          {loading ? <ActivityIndicator style={{ marginTop: 10 }} /> : null}
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
