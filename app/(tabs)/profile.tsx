// app/(tabs)/profile.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type ProfileRoute =
  | "/(profile)/my-profile"
  | "/(profile)/change-password"
  | "/(profile)/settings"
  | "/(profile)/contact-us"
  | "/(profile)/faq";

const profileLinks: { label: string; route?: ProfileRoute; icon: keyof typeof Feather.glyphMap }[] = [
  { label: "My profile", route: "/(profile)/my-profile", icon: "user" },
  { label: "Change password", route: "/(profile)/change-password", icon: "lock" },
  { label: "Settings", route: "/(profile)/settings", icon: "settings" },
  { label: "Contact us", route: "/(profile)/contact-us", icon: "phone" },
  { label: "FAQ", route: "/(profile)/faq", icon: "help-circle" },
];

export default function ProfileTabScreen() {
  const router = useRouter();

  const goTo = (route: ProfileRoute) => {
    router.push(route);
  };

  const onLogout = () => {
    // TODO: clear auth state & redirect to sign-in
    // router.replace("/(auth)/sign-in");
  };

  const onChangeAvatar = () => {
    // TODO: open image picker later
    console.log("Change avatar");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header: avatar + name + phone */}
        <View style={styles.header}>
          <Pressable onPress={onChangeAvatar} style={styles.avatarWrap}>
            <Image
              source={{
                uri: "https://ui-avatars.com/api/?name=User&background=10B981&color=fff",
              }}
              style={styles.avatar}
            />
            <View style={styles.avatarEditBadge}>
              <Feather name="camera" size={14} color="#fff" />
            </View>
          </Pressable>

          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.phone}>+234 800 000 0000</Text>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {profileLinks.map((item) => (
            <Pressable
              key={item.label}
              style={styles.row}
              onPress={() => {
                if (item.route) goTo(item.route);
              }}
            >
              <View style={styles.rowLeft}>
                <Feather name={item.icon} size={18} color="#111827" />
                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>

        {/* Settings group example */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Pressable
            style={styles.row}
            onPress={() => goTo("/(profile)/settings")}
          >
            <View style={styles.rowLeft}>
              <Feather name="sliders" size={18} color="#111827" />
              <Text style={styles.rowLabel}>Payment & app settings</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <Pressable onPress={onLogout} style={styles.logoutBtn}>
            <Feather name="log-out" size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

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

  footer: { marginTop: "auto", paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  logoutText: { color: "#EF4444", fontWeight: "700", fontSize: 15 },
});
