import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "onboardingCompleted";

export const setOnboardingCompleted = async (v: boolean) =>
  v ? AsyncStorage.setItem(KEY, "1") : AsyncStorage.removeItem(KEY);

export const getOnboardingCompleted = (): boolean => {
  
  return false;
};
