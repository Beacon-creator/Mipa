import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

type Slide = {
  key: string;
  title: string;
  text: string;
  image: any; // swap to require(...) or { uri } later
};

export default function OnboardingCarousel() {
  // Dummy images: replace with your assets (e.g., require("@/shared/assets/slide1.png"))
  const slides: Slide[] = useMemo(
    () => [
      {
        key: "s1",
        title: "Track anything",
        text: "Stay on top of your goals with simple, powerful tools.",
        image: { uri: "https://picsum.photos/seed/rn1/800/600" },
      },
      {
        key: "s2",
        title: "Sync everywhere",
        text: "Your data follows you across devices—securely.",
        image: { uri: "https://picsum.photos/seed/rn2/800/600" },
      },
      {
        key: "s3",
        title: "Achieve more",
        text: "Insights that help you make better decisions daily.",
        image: { uri: "https://picsum.photos/seed/rn3/800/600" },
      },
    ],
    []
  );

  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems?.length > 0 && viewableItems[0].index != null) {
        setIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const goNext = useCallback(() => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }
  }, [index, slides.length]);

  const onSignUp = () => router.push("/(auth)/sign-up");
  const onSignIn = () => router.push("/(auth)/sign-in");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(s) => s.key}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.image} style={styles.image} resizeMode="cover" />
              <View style={styles.textBlock}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </View>
          )}
        />

        {/* Indicators */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        {/* Controls: Next OR SignUp/SignIn on last slide */}
        {index < slides.length - 1 ? (
          <Pressable onPress={goNext} style={({ pressed }) => [styles.nextBtn, pressed && styles.nextPressed]}>
            <Text style={styles.nextText}>Next</Text>
          </Pressable>
        ) : (
          <View style={styles.authStack}>
            <Pressable onPress={onSignUp} style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}>
              <Text style={styles.primaryText}>Sign up</Text>
            </Pressable>
            <Pressable onPress={onSignIn} style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}>
              <Text style={styles.secondaryText}>Sign in</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingBottom: 24 },
  slide: { width, alignItems: "center", justifyContent: "flex-start" },
  image: { width: width, height: width * 0.9 },
  textBlock: { paddingHorizontal: 24, marginTop: 16, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 8 },
  text: { fontSize: 15, opacity: 0.75, textAlign: "center", lineHeight: 22 },

  dotsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D1D5DB" },
  dotActive: { width: 18, height: 8, borderRadius: 6, backgroundColor: "#111827" },

  nextBtn: {
    marginTop: 16,
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
  nextPressed: { opacity: 0.85 },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  authStack: { marginTop: 16, paddingHorizontal: 24, gap: 12 },
  primaryBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#111827",
  },
  secondaryBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  btnPressed: { opacity: 0.85 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryText: { color: "#111827", fontSize: 16, fontWeight: "700" },
});
