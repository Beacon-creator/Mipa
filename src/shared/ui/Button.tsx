// src/shared/ui/Buttons.tsx
import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  PressableProps,
} from "react-native";

type BtnProps = PressableProps & {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export function PrimaryButton({ title, onPress, style, textStyle, loading = false, disabled = false, ...rest }: BtnProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.primary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{title}</Text>}
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, style, disabled, ...rest }: BtnProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <Text style={styles.secondaryText}>{title}</Text>
    </Pressable>
  );
}

export function LinkText({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => <Text style={[styles.link, pressed && { opacity: 0.6 }]}>{title}</Text>}
    </Pressable>
  );
}

export function GhostButton({ title, onPress, style, textStyle, ...rest }: BtnProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.ghost, pressed && styles.pressed, style]} {...rest}>
      <Text style={[styles.ghostText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#185221", // green brand for primary
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  secondary: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6", // light gray
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryText: { color: "#111827", fontSize: 16, fontWeight: "700" },

  ghost: { paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8 },
  ghostText: { color: "#6B7280", fontSize: 14, fontWeight: "600" },

  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
   link: { color: "#111827", fontSize: 14, fontWeight: "600", textAlign: "center" },
});
