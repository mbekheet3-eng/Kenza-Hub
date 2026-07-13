// screens/sell/StepBrand.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import styles from './SellStyles';
import { BRANDS } from './constants';

export default function StepBrand({
  form,
  setForm,
}) {
  const selectBrand = (brand) => {
    setForm({
      ...form,
      brand,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>
        Select Brand
      </Text>

      <Text style={styles.subtitle}>
        Choose the brand of your item.
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