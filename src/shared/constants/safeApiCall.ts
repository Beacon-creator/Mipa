// src/shared/utils/safeApiCall.ts
import { Alert } from "react-native";

export async function safeApiCall<T>(fn: () => Promise<T>, opts?: { alertOnError?: boolean }) {
  try {
    return await fn();
  } catch (err: any) {
    console.warn("API error:", err);
    if (opts?.alertOnError ?? true) {
      const msg = err?.message || "Something went wrong";
      Alert.alert("Error", msg);
    }
    throw err;
  }
}
