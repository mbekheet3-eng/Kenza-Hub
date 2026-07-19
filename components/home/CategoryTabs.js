import React from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../theme/colors';

const ALL_LABELS = { ar: 'الكل', en: 'All', fr: 'Tout' };

// التصنيفات بتيجي من الأب (HomeScreen) بعد ما يجيبها من جدول categories الحقيقي
export default function CategoryTabs({
  lang,
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.tab, selectedCategory === 'all' && styles.activeTab]}
        onPress={() => onSelectCategory('all')}
      >
        <Text style={[styles.text, selectedCategory === 'all' && styles.activeText]}>
          {ALL_LABELS[lang] || ALL_LABELS.en}
        </Text>
      </TouchableOpacity>

      {categories.map((cat) => {
        const active = selectedCategory === cat.id;
        const label = lang === 'ar' ? cat.name_ar : cat.name_en;

        return (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.85}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => onSelectCategory(cat.id)}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {label}
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
