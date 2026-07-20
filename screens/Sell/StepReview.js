// screens/sell/StepReview.js

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native';

import styles from './SellStyles';
import { CONDITION_LABELS, COLOR_LABELS, SIZE_LABELS } from './constants';

const LABELS = {
  ar: {
    title: 'راجع إعلانك',
    subtitle: 'من فضلك راجع كل البيانات قبل النشر.',
    category: 'التصنيف', brand: 'الماركة', productTitle: 'العنوان',
    size: 'المقاس', color: 'اللون', condition: 'الحالة',
    description: 'الوصف', price: 'السعر',
  },
  en: {
    title: 'Review Your Listing',
    subtitle: 'Please review all information before publishing.',
    category: 'Category', brand: 'Brand', productTitle: 'Title',
    size: 'Size', color: 'Color', condition: 'Condition',
    description: 'Description', price: 'Price',
  },
  fr: {
    title: 'Vérifiez votre annonce',
    subtitle: 'Veuillez vérifier toutes les informations avant de publier.',
    category: 'Catégorie', brand: 'Marque', productTitle: 'Titre',
    size: 'Taille', color: 'Couleur', condition: 'État',
    description: 'Description', price: 'Prix',
  },
};

const ReviewRow = ({ label, value }) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>
      {value || '-'}
    </Text>
  </View>
);

export default function StepReview({ form, lang = 'ar' }) {
  const l = LABELS[lang] || LABELS.ar;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>
        {l.title}
      </Text>

      <Text style={styles.subtitle}>
        {l.subtitle}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        {form.images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{
              width: 90,
              height: 90,
              borderRadius: 10,
              marginRight: 10,
            }}
          />
        ))}
      </ScrollView>

      <ReviewRow
        label={l.category}
        value={form.category}
      />

      <ReviewRow
        label={l.brand}
        value={form.brand}
      />

      <ReviewRow
        label={l.productTitle}
        value={form.title}
      />

      <ReviewRow
        label={l.size}
        value={SIZE_LABELS[lang]?.[form.size] || form.size}
      />

      <ReviewRow
        label={l.color}
        value={COLOR_LABELS[lang]?.[form.color] || form.color}
      />

      <ReviewRow
        label={l.condition}
        value={CONDITION_LABELS[lang]?.[form.condition] || form.condition}
      />

      <ReviewRow
        label={l.description}
        value={form.description}
      />

      <ReviewRow
        label={l.price}
        value={
          form.price
            ? `${form.price} ${form.currency}`
            : '-'
        }
      />
    </ScrollView>
  );
}
