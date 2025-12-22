// app/(tabs)/profile.tsx
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as api from "../../src/shared/constants/api";
import { resolveAvatarUrl } from "../../src/shared/constants/resolveAvatarUrl";

type ProfileRoute =
  | "/(profile)/my-profile"
  | "/(profile)/change-password"
  | "/(profile)/settings"
  | "/(profile)/contact-us"
  | "/(profile)/faq";

const profileLinks: {
  label: string;
  route?: ProfileRoute;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { label: "My profile", route: "/(profile)/my-profile", icon: "user" },
  { label: "Change password", route: "/(profile)/change-password", icon: "lock" },
  { label: "Settings", route: "/(profile)/settings", icon: "settings" },
  { label: "Contact us", route: "/(profile)/contact-us", icon: "phone" },
  { label: "FAQ", route: "/(profile)/faq", icon: "help-circle" },
];

export default function ProfileTabScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  /* ---------------- Fetch user ---------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await api.getMe();
        if (mounted) setUser(data);
      } catch (err: any) {
        if (err?.status === 401) {
          await AsyncStorage.removeItem("authToken");
          router.replace("/(auth)/sign-in");
        } else {
          console.warn("Failed to load user", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  /* ---------------- Navigation ---------------- */
  const goTo = (route: ProfileRoute) => router.push(route);

  const onLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    router.replace("/(auth)/sign-in");
  };

  /* ---------------- Avatar upload ---------------- */
  const onChangeAvatar = async () => {
    if (uploading) return;

    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission required", "Allow photo access to continue");
      return;
    }
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
});


    if (result.canceled) return;

    try {
      setUploading(true);

      const asset = result.assets[0];

      const formData = new FormData();
      formData.append("avatar", {
        uri: asset.uri,
        name: "avatar.jpg",
        type: asset.mimeType ?? "image/jpeg",
      } as any);

      const { avatarUrl } = await api.uploadAvatar(formData);

      setUser((prev: any) => ({
        ...prev,
        avatarUrl,
      }));
    } catch (err: any) {
      Alert.alert(
        "Upload failed",
        err?.message ?? "Could not upload profile picture"
      );
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- Render ---------------- */
  const avatarUri =
    resolveAvatarUrl(user?.avatarUrl) ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name ?? "User"
    )}&background=10B981&color=fff`;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={onChangeAvatar}
            disabled={uploading}
            style={[
              styles.avatarWrap,
              uploading && { opacity: 0.6 },
            ]}
          >
            {loading || uploading ? (
              <ActivityIndicator />
            ) : (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            )}

            <View style={styles.avatarEditBadge}>
              <Feather name="camera" size={14} color="#fff" />
            </View>
          </Pressable>

          <Text style={styles.name}>
            {loading ? "Loading..." : user?.name ?? "Unknown"}
          </Text>
          <Text style={styles.phone}>
            {loading ? "" : user?.phone ?? "+234 800 000 0000"}
          </Text>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {profileLinks.map((item) => (
            <Pressable
              key={item.label}
              style={styles.row}
              onPress={() => item.route && goTo(item.route)}
            >
              <View style={styles.rowLeft}>
                <Feather name={item.icon} size={18} color="#111827" />
                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <Pressable
            onPress={() =>
              Alert.alert("Log out", "Are you sure?", [
                { text: "Cancel", style: "cancel" },
                { text: "Log out", style: "destructive", onPress: onLogout },
              ])
            }
            style={styles.logoutBtn}
          >
            <Feather name="log-out" size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },

  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 12,
  },

  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatar: { width: "100%", height: "100%" },

  avatarEditBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },

  name: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  phone: { fontSize: 14, color: "#6B7280" },

  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
  },

  row: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowLabel: { fontSize: 15, fontWeight: "600", color: "#111827" },


  footer: {
    marginTop: "auto",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },

  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 15,
  },
});