import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          // Returning user → go to sign-in screen or main app
          setRedirectTo("/(auth)/sign-in");
        } else {
          // New user → start onboarding
          setRedirectTo("/(onboarding)/carousel");
        }
      } catch {
        setRedirectTo("/(auth)/sign-in");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  return null; 
}
