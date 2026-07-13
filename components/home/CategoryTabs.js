import React from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../theme/colors';

export const CATEGORIES = [
  { key: 'all', ar: 'الكل', en: 'All', fr: 'Tout' },
  { key: 'women', ar: 'سيدات', en: 'Women', fr: 'Femmes' },
  { key: 'men', ar: 'رجال', en: 'Men', fr: 'Hommes' },
  { key: 'kids', ar: 'أطفال', en: 'Kids', fr: 'Enfants' },
];

export default function CategoryTabs({
  lang,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const active = selectedCategory === cat.key;

        return (
          <TouchableOpacity
            key={cat.key}
            activeOpacity={0.85}
            style={[
              styles.tab,
              active && styles.activeTab,
            ]}
            onPress={() => onSelectCategory(cat.key)}
          >
            <Text
              style={[
                styles.text,
                active && styles.activeText,
              ]}
            >
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
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 6,
  },

  tab: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,

    borderWidth: 1,
    borderColor: '#ECECEC',

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },

  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});