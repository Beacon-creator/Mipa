import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import slide1 from "../../assets/images/onboarding/slide1.png";
import slide2 from "../../assets/images/onboarding/slide2.png";
import slide3 from "../../assets/images/onboarding/slide3.png";
import mipaLogo from "../../assets/logos/Mipalogo.png";

const { width } = Dimensions.get("window");

const IMG_SIZE = Math.min(320, Math.round(width * 0.6));
const PADDING_H = 24;

type Slide = {
  key: string;
  title: string;
  text: string;
  image: any;
};

export default function OnboardingCarousel() {
  const slides: Slide[] = useMemo(
    () => [
      {
        key: "s1",
        title: "Browse Your Food And Order Directly",
        text: "Order your favorite meal from us and get instant delivery.",
        image: slide1,
      },
      {
        key: "s2",
        title: "Get Your Food At Any Restaurant",
        text: "Select your location to see the wide range of restaurants you can order from.",
        image: slide2,
      },
      {
        key: "s3",
        title: "The Fastest Food Delivery Service",
        text: "Be ready to experience the best food delivery app ever.",
        image: slide3,
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
      <View style={styles.root}>
        {/* Top header: fixed at top */}
        <View style={styles.header}>
          <Image source={mipaLogo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandText}>Mipa</Text>
        </View>


        <View style={styles.middle}>
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
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.page}>
               
            
                <View style={styles.centerBlock}>
            
                  <View style={styles.imgCircle}>
                    <Image source={item.image} style={styles.image} resizeMode="cover" />
                  </View>
         
                  <View style={styles.textBlock}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.text}</Text>
                  </View>
                 
                  <View style={styles.dotsRow}>
                    {slides.map((_, i) => (
                      <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                    ))}
                  </View>

                
                </View>
              </View>
            )}
          />
        </View>

        {/* Bottom: button area pinned to bottom */}
        <View style={styles.footer}>
          {index < slides.length - 1 ? (
            <Pressable
              onPress={goNext}
              style={({ pressed }) => [styles.longButton, pressed && styles.longButtonPressed]}
            >
              <Text style={styles.longButtonText}>Next</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // Root layout: header (top) — middle (flex) — footer (bottom)
  root: { flex: 1 },
  header: {
    width: "100%",
    paddingHorizontal: PADDING_H,
    paddingTop: 25,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  logo: { width: 28, height: 28 },
  brandText: { fontSize: 20, paddingTop: 4, fontWeight: "700", letterSpacing: 0.5 },

  
  middle: { flex: 1 },
  listContent: {
   
    height: "90%",
  },

  page: { width, height: "100%", alignItems: "center", justifyContent: "center" },

  centerBlock: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: PADDING_H,
  },

  
  imgCircle: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: IMG_SIZE / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    marginBottom: 12,
  },
  image: { width: "100%", height: "100%" },

  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 15,
  },
  dot: { width: 9, height: 9, borderRadius: 4, backgroundColor: "#D1D5DB" },
  dotActive: { width: 9, height: 9, borderRadius: 6, backgroundColor: "#333333" },


  textBlock: { width: "70%", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 20, opacity: 0.75 },

  
  footer: {
    width: "100%",
    paddingHorizontal: PADDING_H,
    paddingBottom: 16,
    paddingTop: 8,
  },
  longButton: {
    alignSelf: "center",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#185221",
  },
  longButtonPressed: { opacity: 0.9 },
  longButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  authStack: { width: "100%", gap: 12 },
  primaryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#185221",
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#E8E8E8",
  },
  btnPressed: { opacity: 0.9 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryText: { color: "#111827", fontSize: 16, fontWeight: "700" },
});
