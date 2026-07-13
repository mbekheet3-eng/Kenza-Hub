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
} from './constants';

export default function StepDetails({
  form,
  setForm,
}) {
  const updateField = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const renderChips = (title, field, items) => (
    <>
      <Text style={styles.label}>{title}</Text>

      <View style={styles.row}>
        {items.map((item) => {
          const selected = form[field] === item;

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
                {item}
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
        Product Details
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Product title"
        value={form.title}
        onChangeText={(text) => updateField('title', text)}
      />

      {renderChips('Size', 'size', SIZES)}

      {renderChips('Color', 'color', COLORS)}

      {renderChips('Condition', 'condition', CONDITIONS)}
    </ScrollView>
  );
}