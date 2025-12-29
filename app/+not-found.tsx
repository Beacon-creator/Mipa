import { Link, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function NotFound() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        This screen doesn’t exist.
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#6B7280",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        The page you’re looking for couldn’t be found.
      </Text>

      {/* Go back */}
      <Pressable
        onPress={() => router.back()}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
          borderWidth: 1,
          marginBottom: 12,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text>Go back</Text>
      </Pressable>

      {/* Go to Home */}
      <Link href="/(tabs)/home" asChild>
        <Pressable
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            backgroundColor: "#10B981",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Go to Home
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
