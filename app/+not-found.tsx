// app/+not-found.tsx
import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function NotFound() {
  return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center", padding:24 }}>
      <Text style={{ fontSize:20, fontWeight:"700", marginBottom:8 }}>This screen doesn’t exist.</Text>
      <Link href="/" asChild>
        <Pressable style={{ padding:12, borderRadius:10, borderWidth:1 }}>
          <Text>Go to home</Text>
        </Pressable>
      </Link>
    </View>
  );
}
