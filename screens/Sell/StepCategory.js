// screens/sell/StepCategory.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import styles from './SellStyles';
import { CATEGORIES } from './constants';

export default function StepCategory({
  form,
  setForm,
}) {
  const selectCategory = (category) => {
    setForm({
      ...form,
      category,
    });
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>
        Choose Category
      </Text>

      <Text style={styles.subtitle}>
        Select the category that best matches your item.
      </Text>

      <View style={styles.row}>
        {CATEGORIES.map((category) => {
          const selected = form.category === category;

          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.chip,
                selected && styles.chipSelected,
              ]}
              onPress={() => selectCategory(category)}
            >
              <Text
                style={[
                  styles.chipText,
                  selected && styles.chipTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}