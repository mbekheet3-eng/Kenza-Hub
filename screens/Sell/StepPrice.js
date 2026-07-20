// screens/sell/StepPrice.js

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import styles from './SellStyles';
import { CURRENCIES } from './constants';

const LABELS = {
  ar: {
    title: 'حدد السعر',
    subtitle: 'اكتب سعر البيع واختار العملة.',
    price: 'السعر',
    currency: 'العملة',
  },
  en: {
    title: 'Set Your Price',
    subtitle: 'Enter the selling price and choose the currency.',
    price: 'Price',
    currency: 'Currency',
  },
  fr: {
    title: 'Définir le prix',
    subtitle: 'Entrez le prix de vente et choisissez la devise.',
    price: 'Prix',
    currency: 'Devise',
  },
};

export default function StepPrice({
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

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>
        {l.title}
      </Text>

      <Text style={styles.subtitle}>
        {l.subtitle}
      </Text>

      <Text style={styles.label}>
        {l.price}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="0"
        keyboardType="numeric"
        value={form.price}
        onChangeText={(text) => updateField('price', text)}
      />

      <Text style={styles.label}>
        {l.currency}
      </Text>

      <View style={styles.row}>
        {CURRENCIES.map((currency) => {
          const selected = form.currency === currency;

          return (
            <TouchableOpacity
              key={currency}
              style={[
                styles.chip,
                selected && styles.chipSelected,
              ]}
              onPress={() => updateField('currency', currency)}
            >
              <Text
                style={[
                  styles.chipText,
                  selected && styles.chipTextSelected,
                ]}
              >
                {currency}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
