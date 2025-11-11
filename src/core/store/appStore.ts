import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "onboardingCompleted";

export const setOnboardingCompleted = async (v: boolean) =>
  v ? AsyncStorage.setItem(KEY, "1") : AsyncStorage.removeItem(KEY);

export const getOnboardingCompleted = (): boolean => {
  // You can make this async if you prefer; for simplicity return a sync default.
  // In production, read it once in a splash or use a small zustand store.
  return false;
};
