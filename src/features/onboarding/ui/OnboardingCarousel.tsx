import { useRef, useState, useMemo } from "react";
import { View, Text, FlatList, Image, Pressable, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

type Slide = { id: string; image: any; title: string; body: string };
export function OnboardingCarousel({
  slides,
  onLastCta,
}: { slides: Slide[]; onLastCta: () => void }) {
  const listRef = useRef<FlatList<Slide>>(null);
  const [i, setI] = useState(0);

  const onNext = () => {
    if (i < slides.length - 1) listRef.current?.scrollToIndex({ index: i + 1, animated: true });
    else onLastCta();
  };

  const indicators = useMemo(() => (
    <View style={{ flexDirection:"row", gap:6, marginVertical:16 }}>
      {slides.map((_, idx) => (
        <View key={idx}
          style={{
            width:8, height:8, borderRadius:4,
            backgroundColor: idx === i ? "black" : "#D1D5DB"
          }}
        />
      ))}
    </View>
  ), [i, slides]);

  return (
    <View style={{ flex:1 }}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(s)=>s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e)=>{
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setI(idx);
        }}
        renderItem={({ item }) => (
          <View style={{ width, padding:24, alignItems:"center", justifyContent:"center" }}>
            <Image source={item.image} style={{ width: width*0.7, height: width*0.7, resizeMode:"contain" }} />
            <Text style={{ fontSize:22, fontWeight:"700", marginTop:16 }}>{item.title}</Text>
            <Text style={{ textAlign:"center", opacity:0.7, marginTop:8 }}>{item.body}</Text>
          </View>
        )}
      />

      {indicators}

      <View style={{ paddingHorizontal:24 }}>
        <Pressable onPress={onNext}
          style={{ padding:14, borderRadius:10, backgroundColor:"black", alignItems:"center" }}>
          <Text style={{ color:"white", fontWeight:"600" }}>{i < slides.length - 1 ? "Next" : "Continue"}</Text>
        </Pressable>
      </View>
    </View>
  );
}
