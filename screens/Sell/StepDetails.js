// screens/sell/StepDetails.js

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
  SIZES,
  COLORS,
  CONDITIONS,
  SIZE_LABELS,
  COLOR_LABELS,
  CONDITION_LABELS,
} from './constants';

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

      {renderChips(l.size, 'size', SIZES, SIZE_LABELS)}

      {renderChips(l.color, 'color', COLORS, COLOR_LABELS)}

      {renderChips(l.condition, 'condition', CONDITIONS, CONDITION_LABELS)}
    </ScrollView>
  );
}
