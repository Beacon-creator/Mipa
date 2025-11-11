import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";

export function PrimaryButton({
  title,
  onPress,
  style,
  disabled,
}: { title: string; onPress?: () => void; style?: ViewStyle; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.primary, pressed && styles.pressed, disabled && styles.disabled, style]}
    >
      <Text style={styles.primaryText}>{title}</Text>
    </Pressable>
  );
}

export function LinkText({
  title,
  onPress,
}: { title: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => <Text style={[styles.link, pressed && { opacity: 0.6 }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 11,
    alignItems: "center",
    backgroundColor: "#185221",
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  link: { color: "#111827", fontSize: 14, fontWeight: "600", textAlign: "center" },
});
