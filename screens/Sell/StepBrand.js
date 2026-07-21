// screens/Sell/StepBrand.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import styles from './SellStyles';
import { BRANDS } from './constants';

const LABELS = {
  ar: {
    title: 'اختار الماركة',
    subtitle: 'اختار ماركة القطعة بتاعتك.',
    homeNote: 'المنتجات المنزلية لا تحتاج ماركة.',
  },
  en: {
    title: 'Select Brand',
    subtitle: 'Choose the brand of your item.',
    homeNote: 'Home products do not require a brand.',
  },
  fr: {
    title: 'Choisir la marque',
    subtitle: 'Choisissez la marque de votre article.',
    homeNote: 'Les produits domestiques n\'ont pas besoin de marque.',
  },
};

export default function StepBrand({
  form,
  setForm,
  lang = 'ar',
}) {
  const l = LABELS[lang] || LABELS.ar;

  // Home category doesn't need brand
  const isHomeCategory = form.categoryId === '1e69453d-059c-4a7c-a81a-be0fbe9bc9f1';

  const selectBrand = (brand) => {
    setForm({
      ...form,
      brand,
    });
  };

  if (isHomeCategory) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.subtitle}>
          {l.homeNote}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>
        {l.title}
      </Text>

      <Text style={styles.subtitle}>
        {l.subtitle}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {BRANDS.map((brand) => {
          const selected = form.brand === brand;

          return (
            <TouchableOpacity
              key={brand}
              style={[
                styles.chip,
                selected && styles.chipSelected,
              ]}
              onPress={() => selectBrand(brand)}
            >
              <Text
                style={[
                  styles.chipText,
                  selected && styles.chipTextSelected,
                ]}
              >
                {brand}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
