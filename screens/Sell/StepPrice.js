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

export default function StepPrice({
  form,
  setForm,
}) {
  const updateField = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>
        Set Your Price
      </Text>

      <Text style={styles.subtitle}>
        Enter the selling price and choose the currency.
      </Text>

      <Text style={styles.label}>
        Price
      </Text>

      <TextInput
        style={styles.input}
        placeholder="0"
        keyboardType="numeric"
        value={form.price}
        onChangeText={(text) => updateField('price', text)}
      />

      <Text style={styles.label}>
        Currency
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