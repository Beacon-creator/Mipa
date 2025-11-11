import * as Location from "expo-location";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function TurnOnLocation() {
  const router = useRouter();
  const request = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      // (optional) get location here
      // const loc = await Location.getCurrentPositionAsync({});
      router.push("/(auth)/sign-up");
    } else {
      Alert.alert("Permission needed", "Please enable location to continue.");
    }
  };

  return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center", padding:24 }}>
      <Text style={{ fontSize:24, fontWeight:"700", marginBottom:12 }}>Enable location</Text>
      <Text style={{ textAlign:"center", opacity:0.7, marginBottom:24 }}>
        We use your location to improve experience.
      </Text>
      <Pressable onPress={request} style={{ padding:14, borderRadius:10, backgroundColor:"black" }}>
        <Text style={{ color:"white", fontWeight:"600" }}>Turn on</Text>
      </Pressable>
    </View>
  );
}
