import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function LabeledField({ label, error, style, ...inputProps }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#A3A3A3"
        style={[styles.input, style]}
        {...inputProps}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", marginBottom: 12 },
  label: { fontSize: 15, fontWeight: "700", marginBottom: 6, color: "#000000" },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#E8E8E8",
    fontSize: 16,
  },
  error: { marginTop: 6, color: "#DC2626", fontSize: 12 },
});
