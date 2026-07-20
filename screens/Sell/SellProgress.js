// screens/sell/SellProgress.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

const STEPS = {
  ar: ['الصور', 'التصنيف', 'الماركة', 'التفاصيل', 'الوصف', 'السعر', 'المراجعة'],
  en: ['Photos', 'Category', 'Brand', 'Details', 'Description', 'Price', 'Review'],
  fr: ['Photos', 'Catégorie', 'Marque', 'Détails', 'Description', 'Prix', 'Vérification'],
};

const STEP_OF_LABEL = {
  ar: (current, total) => `الخطوة ${current} من ${total}`,
  en: (current, total) => `Step ${current} of ${total}`,
  fr: (current, total) => `Étape ${current} sur ${total}`,
};

export default function SellProgress({ step = 0, lang = 'ar' }) {
  const steps = STEPS[lang] || STEPS.ar;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>
          {(STEP_OF_LABEL[lang] || STEP_OF_LABEL.ar)(step + 1, steps.length)}
        </Text>

        <Text style={styles.title}>
          {steps[step]}
        </Text>
      </View>

      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${progress}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  header: {
    marginBottom: 10,
  },

  stepText: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },

  barBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
});