import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function GetStarted() {
  return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center", padding:24 }}>
      <Text style={{ fontSize:28, fontWeight:"700", marginBottom:12 }}>Welcome</Text>
      <Text style={{ textAlign:"center", opacity:0.7, marginBottom:24 }}>
        Your app’s one-liner goes here.
      </Text>
      <Link href="/(onboarding)/carousel" asChild>
        <Pressable style={{ padding:14, borderRadius:10, backgroundColor:"black" }}>
          <Text style={{ color:"white", fontWeight:"600" }}>Get Started</Text>
        </Pressable>
      </Link>
    </View>
  );
}
