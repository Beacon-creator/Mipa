

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  autoCorrect?: boolean;
  error?: string;
  returnKeyType?: TextInput["props"]["returnKeyType"];
  editable?: boolean;
};

export const LabeledField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  returnKeyType,
}: Props) => {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          editable= {true}
          style={styles.input}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setHidden((p) => !p)}
            style={styles.icon}
            hitSlop={10}
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6B7280"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "600",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 48,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 14,
     width: "100%",
    paddingVertical: 14,
    paddingRight: 44, // space for eye icon
    fontSize: 16,
  },
    error: { marginTop: 6, color: "#DC2626", fontSize: 12 },
  icon: {
    position: "absolute",
    right: 12,
  },
});
