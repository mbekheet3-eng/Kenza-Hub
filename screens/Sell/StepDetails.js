// screens/Sell/StepDetails.js

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import styles from './SellStyles';
import {
  COLORS,
  CONDITIONS,
  COLOR_LABELS,
  CONDITION_LABELS,
} from './constants';

import { getSizesForCategory, SIZE_LABELS } from '../../data/sizes';

const LABELS = {
  ar: {
    title: 'تفاصيل المنتج',
    titlePlaceholder: 'عنوان المنتج',
    size: 'المقاس',
    color: 'اللون',
    condition: 'الحالة',
  },
  en: {
    title: 'Product Details',
    titlePlaceholder: 'Product title',
    size: 'Size',
    color: 'Color',
    condition: 'Condition',
  },
  fr: {
    title: 'Détails du produit',
    titlePlaceholder: 'Titre du produit',
    size: 'Taille',
    color: 'Couleur',
    condition: 'État',
  },
};

export default function StepDetails({
  form,
  setForm,
  lang = 'ar',
}) {
  const l = LABELS[lang] || LABELS.ar;

  const updateField = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  // القيمة المخزّنة فعليًا في form تفضل زي ما هي (إنجليزي) عشان تتسق مع
  // الداتابيز، وده بس بيترجم النص المعروض للمستخدم
  const renderChips = (title, field, items, labelMap) => (
    <>
      <Text style={styles.label}>{title}</Text>

      <View style={styles.row}>
        {items.map((item) => {
          const selected = form[field] === item;
          const display = labelMap ? (labelMap[lang]?.[item] || item) : item;

          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.chip,
                selected && styles.chipSelected,
              ]}
              onPress={() => updateField(field, item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selected && styles.chipTextSelected,
                ]}
              >
                {display}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  // Get sizes for the selected category; falls back to clothing if none selected
  const applicableSizes = getSizesForCategory(form.categoryId);
  const showsSize = applicableSizes.length > 0;
  
  // Check if this is a home category (no size, no color, no brand needed)
  const isHomeCategory = form.categoryId === '1e69453d-059c-4a7c-a81a-be0fbe9bc9f1';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionTitle}>
        {l.title}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={l.titlePlaceholder}
        value={form.title}
        onChangeText={(text) => updateField('title', text)}
      />

      {/* Only show size chips if the category uses sizes; hide completely for home category */}
      {showsSize && renderChips(l.size, 'size', applicableSizes, SIZE_LABELS)}

      {/* Only show color chips for clothes, shoes, kids (not home) */}
      {!isHomeCategory && renderChips(l.color, 'color', COLORS, COLOR_LABELS)}

      {renderChips(l.condition, 'condition', CONDITIONS, CONDITION_LABELS)}
    </ScrollView>
  );
}
