// src/components/FiltersPanel.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "../constants/FiltersPanel.styles";

type Props = {
  minRating: number | null;
  maxDistance: number | null;
  typeFilter: string | null;
  locationFilter: string | null;
  maxPrice: number | null;
  toggleRating: (val: number) => void;
  toggleDistance: (val: number) => void;
  toggleType: (val: string) => void;
  toggleLocation: (val: string) => void;
  togglePrice: (val: number) => void;
  resetFilters: () => void;
};

export const FiltersPanel: React.FC<Props> = ({
  minRating,
  maxDistance,
  typeFilter,
  locationFilter,
  maxPrice,
  toggleRating,
  toggleDistance,
  toggleType,
  toggleLocation,
  togglePrice,
  resetFilters,
}) => (
  <View style={styles.filterPanel}>
    <View style={styles.filterHeaderRow}>
      <Text style={styles.filterTitle}>Filters</Text>
      <Pressable onPress={resetFilters}>
        <Text style={styles.filterReset}>Reset</Text>
      </Pressable>
    </View>

    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>Rating</Text>
      <View style={styles.filterChipsRow}>
        {[4.0, 4.5].map((r) => (
          <Pressable key={r} onPress={() => toggleRating(r)} style={[styles.filterChip, minRating === r && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, minRating === r && { color: "#fff" }]}>{r}+</Text>
          </Pressable>
        ))}
      </View>
    </View>

    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>Distance</Text>
      <View style={styles.filterChipsRow}>
        {[0.5, 1].map((d) => (
          <Pressable key={d} onPress={() => toggleDistance(d)} style={[styles.filterChip, maxDistance === d && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, maxDistance === d && { color: "#fff" }]}>{`< ${d}km`}</Text>
          </Pressable>
        ))}
      </View>
    </View>

    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>Type</Text>
      <View style={styles.filterChipsRow}>
        {["food", "drink", "snacks"].map((t) => (
          <Pressable key={t} onPress={() => toggleType(t)} style={[styles.filterChip, typeFilter === t && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, typeFilter === t && { color: "#fff" }]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </Pressable>
        ))}
      </View>
    </View>

    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>Location</Text>
      <View style={styles.filterChipsRow}>
        {["Ikeja", "VI", "Sango"].map((loc) => (
          <Pressable key={loc} onPress={() => toggleLocation(loc)} style={[styles.filterChip, locationFilter === loc && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, locationFilter === loc && { color: "#fff" }]}>{loc}</Text>
          </Pressable>
        ))}
      </View>
    </View>

    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>Price</Text>
      <View style={styles.filterChipsRow}>
        {[5, 8].map((p) => (
          <Pressable key={p} onPress={() => togglePrice(p)} style={[styles.filterChip, maxPrice === p && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, maxPrice === p && { color: "#fff" }]}>{`< $${p}`}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  </View>
);