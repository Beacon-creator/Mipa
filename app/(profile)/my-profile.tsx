// app/(profile)/my-profile.tsx
import React, { useEffect, useState } from "react";
import { StatusBar, View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { LabeledField } from "../../src/shared/ui/LabeledField";
import { PrimaryButton, SecondaryButton } from "../../src/shared/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import * as api from "../../src/shared/constants/api";

export default function MyProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await api.getMe();
        if (!mounted) return;
        setName(user.name ?? "");
        setEmail(user.email ?? "");
        setPhone(user.phone ?? "");
        // address is not stored as single field in backend; use first address line if available
        const firstAddress = (user.addresses && user.addresses[0]) ?? null;
        setAddress(firstAddress ? `${firstAddress.line1}${firstAddress.city ? ", " + firstAddress.city : ""}` : "");
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      // backend updateProfile supports name, location, phone, avatarUrl
      await api.updateProfile({ name, location: address, phone });
      Alert.alert("Success", "Profile updated");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "My profile" }} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={styles.heading}>Personal information</Text>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 24 }} />
          ) : (
            <>
              <View style={{ marginTop: 12 }}>
                <LabeledField label="Full name" value={name} onChangeText={setName} />
                <LabeledField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" editable={false} />
                <LabeledField label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                <LabeledField
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  style={{ height: 80, textAlignVertical: "top" }}
                />
              </View>

              <View style={{ marginTop: 20, gap: 10 }}>
                <PrimaryButton title={saving ? "Saving..." : "Save changes"} onPress={onSave} disabled={saving} />
                <SecondaryButton title="Cancel" onPress={() => {}} />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  heading: { fontSize: 16, fontWeight: "800" },
});
