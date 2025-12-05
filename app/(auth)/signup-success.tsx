import React from "react";
import { StatusBar, View, Text, StyleSheet,Image } from "react-native";
import { PrimaryButton } from "../../src/shared/ui/Button";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import successImg from "../../assets/images/body/success.png";
export default function CongratulationsScreen() {


const goHome = () => router.replace("/(auth)/sign-in"); 

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.badge}>
         <Image source={successImg} style={{ width: 44, height: 44, marginBottom: 5 }} resizeMode="contain" />
        </View>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>Your account is completed, kindly enjoy the best menu from us.</Text>

        <PrimaryButton title="Get Started" onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, gap: 16, justifyContent: "center", alignItems: "center" },
  badge: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F3F4F6", marginBottom: 6,
  },
  emoji: { fontSize: 40 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  subtitle: { fontSize: 14, opacity: 0.5, textAlign: "center" },
});
