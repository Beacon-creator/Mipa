import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
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
  const userEmail = (params?.email ?? "") as string;
  const devCode = (params?.devCode ?? null) as string | null;

  const cells = useMemo(() => [0, 1, 2, 3], []);
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Autofill devCode on mount
  useEffect(() => {
    if (devCode && devCode.length === 4) {
      setCode(devCode.split(""));
      setTimeout(() => inputs.current[3]?.focus(), 50);
    }
  }, [devCode]);

  const setDigit = (i: number, v: string) => {
    const val = v.replace(/[^0-9]/g, "").slice(-1);
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

  const verifyApi = async (email: string, codeStr: string) => {
    const res = await fetch(`${API_BASE}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: codeStr }),
    });

    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }

    if (!res.ok) throw new Error(json?.error || json?.message || `Verify failed (HTTP ${res.status})`);
    return json;
  };

  const resendApi = async (email: string) => {
    const res = await fetch(`${API_BASE}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }

    if (!res.ok) throw new Error(json?.error || json?.message || `Failed to resend (HTTP ${res.status})`);
    return json;
  };

  const onVerify = useCallback(async () => {
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
  }, [otpString, userEmail, canVerify, router]);

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (otpString.length !== 4 || loading || resendLoading) return;

    const t = setTimeout(() => {
      if (otpString.length === 4 && !loading) {
        onVerify();
      }
    }, 250);

    return () => clearTimeout(t);
  }, [otpString, loading, resendLoading, onVerify]);

  const onResend = async () => {
    if (!userEmail) {
      Alert.alert("Missing email", "No email provided. Please go back and sign up again.");
      return;
    }

    setResendLoading(true);
    try {
      const json = await resendApi(userEmail);
      const returned = (json?.verificationCode || json?.resetCode) ?? null;

      if (returned && returned.length === 4) {
        setCode(returned.split(""));
        inputs.current[3]?.focus();
        setTimeout(() => onVerify(), 600);
      } else {
        Alert.alert("Code sent", "A verification code was generated.");
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
                ref={(el: TextInput | null) => { inputs.current[i] = el; }}
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
            {resendLoading && <ActivityIndicator style={{ marginTop: 8 }} />}
          </View>

          <View style={{ height: 16 }} />
          <PrimaryButton title="Verify" onPress={onVerify} disabled={!canVerify || loading} />
          {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
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
