import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export const CATEGORIES = [
  { key: 'all', ar: 'الكل', en: 'All', fr: 'Tout' },
  { key: 'women', ar: 'سيدات', en: 'Women', fr: 'Femmes' },
  { key: 'men', ar: 'رجال', en: 'Men', fr: 'Hommes' },
  { key: 'kids', ar: 'أطفال', en: 'Kids', fr: 'Enfants' },
];

export default function CategoryTabs({ lang, selectedCategory, onSelectCategory }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.key === selectedCategory;
        return (
          <TouchableOpacity
            key={cat.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onSelectCategory(cat.key)}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {cat[lang] || cat.en}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.navy,
  },
  tabTextActive: {
    color: COLORS.white,
  },
});