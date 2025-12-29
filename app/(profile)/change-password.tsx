import { useState } from "react";
import { StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { Stack } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton } from "../../src/shared/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import * as api from "../../src/shared/constants/api";

export default function ChangePasswordScreen() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      return Alert.alert("Error", "Please fill all fields");
    }
    if (newPw !== confirmPw) {
      return Alert.alert("Error", "New password and confirm password do not match");
    }
    setLoading(true);
    try {
      await api.updatePassword(currentPw, newPw);
      Alert.alert("Success", "Password updated");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "Change password" }} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={styles.heading}>Update your password</Text>

          <View style={{ marginTop: 12 }}>
            <LabeledField
              label="Current password"
              value={currentPw}
              onChangeText={setCurrentPw}
              secureTextEntry
              placeholder="••••••••"
            />
            <LabeledField
              label="New password"
              value={newPw}
              onChangeText={setNewPw}
              secureTextEntry
              placeholder="••••••••"
            />
            <LabeledField
              label="Confirm new password"
              value={confirmPw}
              onChangeText={setConfirmPw}
              secureTextEntry
              placeholder="••••••••"
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <PrimaryButton title={loading ? "Saving..." : "Save password"} onPress={onSave} disabled={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  heading: { fontSize: 16, fontWeight: "800" },
});
