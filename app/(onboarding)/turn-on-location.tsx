import * as Location from "expo-location";
import { View, Text, Pressable, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import locationImg from "../../assets/images/body/location.png";

export default function TurnOnLocation() {
  const router = useRouter();

  const request = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      // (optional) location usage
      // const loc = await Location.getCurrentPositionAsync({});
      router.push("/(auth)/sign-up"); // continue flow
    } else {
      Alert.alert("Permission needed", "Please enable location to continue.");
    }
  };

  const skip = () => {
    router.push("/(auth)/sign-up");
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Image
        source={locationImg}
        style={{ width: 120, height: 120, marginBottom: 20 }}
        resizeMode="contain"
      />

      <Pressable
        onPress={request}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 10,
          backgroundColor: "black",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Turn on Location</Text>
      </Pressable>

      {/* NEW: Skip Button */}
      <Pressable onPress={skip} style={{ marginTop: 14 }}>
        <Text style={{ color: "#5E5E5E", fontWeight: "600", fontSize: 14 }}>
          Skip for now
        </Text>
      </Pressable>
    </View>
  );
}
