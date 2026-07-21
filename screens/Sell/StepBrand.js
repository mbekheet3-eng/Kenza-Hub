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
  ar: { title: 'اختار الماركة', subtitle: 'اختار ماركة القطعة بتاعتك.' },
  en: { title: 'Select Brand', subtitle: 'Choose the brand of your item.' },
  fr: { title: 'Choisir la marque', subtitle: 'Choisissez la marque de votre article.' },
};

export default function StepBrand({
  form,
  setForm,
  lang = 'ar',
}) {
  const l = LABELS[lang] || LABELS.ar;

  const selectBrand = (brand) => {
    setForm({
      ...form,
      brand,
    });
  };

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
