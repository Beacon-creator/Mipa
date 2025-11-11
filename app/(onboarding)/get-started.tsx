import React from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { router } from "expo-router";

export default function GetStartedScreen() {
  const onGetStarted = () => router.push("/(onboarding)/carousel");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.brand}><Text style={styles.logo}>YourBrand</Text></View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Welcome 👋</Text>
          <Text style={styles.subtitle}>Short line about what your app does.</Text>
        </View>
        <Pressable onPress={onGetStarted} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
        <Text style={styles.footerHint}>You can change this later in Settings</Text>
      </View>
    </SafeAreaView>
  );
}

// (styles unchanged from before)
const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#fff"},
  container:{flex:1,paddingHorizontal:24,paddingTop:24,paddingBottom:32,alignItems:"center",justifyContent:"space-between"},
  brand:{marginTop:24,alignItems:"center"},
  logo:{fontSize:24,fontWeight:"700",letterSpacing:1},
  textBlock:{alignItems:"center",paddingHorizontal:8},
  title:{fontSize:32,fontWeight:"800",textAlign:"center",marginBottom:8},
  subtitle:{fontSize:16,textAlign:"center",opacity:0.7,lineHeight:22},
  button:{width:"100%",paddingVertical:16,borderRadius:12,alignItems:"center",justifyContent:"center",backgroundColor:"#111827"},
  buttonPressed:{opacity:0.85},
  buttonText:{color:"#fff",fontSize:16,fontWeight:"700"},
  footerHint:{fontSize:12,opacity:0.5,textAlign:"center"},
});
