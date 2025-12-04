// src/components/ReviewForm.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import * as api from "@/shared/constants/api";

export default function ReviewForm({ restaurantId, onSuccess }: { restaurantId: string; onSuccess?: () => void }) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!rating || rating < 1) return Alert.alert("Please select rating");
    setLoading(true);
    try {
      await api.createReview(restaurantId, rating, comment);
      Alert.alert("Thanks!", "Your review was submitted");
      setComment("");
      setRating(5);
      onSuccess?.();
    } catch (err: any) {
      console.warn("review err", err);
      Alert.alert("Failed", err?.message || "Could not submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "700", marginBottom: 8 }}>Leave a review</Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setRating(n)} style={[styles.starBtn, rating >= n && styles.starActive]}>
            <Text>{rating >= n ? "★" : "☆"}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Write your thoughts..."
        value={comment}
        onChangeText={setComment}
        multiline
        style={{ minHeight: 80, borderWidth: 1, borderColor: "#E5E7EB", padding: 8, borderRadius: 8, marginBottom: 8 }}
      />

      <Pressable onPress={submit} style={[styles.primaryBtn, loading && { opacity: 0.6 }]}>
        <Text style={styles.primaryBtnText}>{loading ? "Sending..." : "Submit review"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  starBtn: {
    padding: 6,
  },
  starActive: {
    transform: [{ scale: 1.05 }],
  },
  primaryBtn: {
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#111827",
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
