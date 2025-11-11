import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import mipaLogo from "../../assets/logos/Mipalogo.png";

export default function GetStartedScreen() {
  const onGetStarted = () => router.push("/(onboarding)/carousel");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.centerContent}>
        <Image source={mipaLogo} style={{ width: 44, height: 44, marginBottom: 5 }} resizeMode="contain" />
        <Text style={styles.text}>Mipa</Text>

        {/* Button */}
        <Pressable
          onPress={onGetStarted}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#185221",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 52,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 30,
    letterSpacing: 1,
  },
  button: {
    width: "80%",
    paddingVertical: 18,
    borderRadius: 10,
    marginTop: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#185221",
    fontSize: 20,
    fontWeight: "700",
  },
  text:{
      color: "#FFFFFF",
      fontSize: 40,
      fontWeight: "700",
  }
});
