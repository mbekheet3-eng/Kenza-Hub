// screens/sell/StepDescription.js

import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';

import styles from './SellStyles';

export default function StepDescription({
  form,
  setForm,
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>
        Product Description
      </Text>

      <Text style={styles.subtitle}>
        Describe the item clearly. Mention defects, material, measurements, and any important details.
      </Text>

      <TextInput
        style={styles.textArea}
        placeholder="Example: Zara jacket, size M, worn twice, excellent condition..."
        multiline
        numberOfLines={8}
        maxLength={1000}
        textAlignVertical="top"
        value={form.description}
        onChangeText={(text) =>
          setForm({
            ...form,
            description: text,
          })
        }
      />

      <Text
        style={{
          alignSelf: 'flex-end',
          color: '#888',
          marginTop: 6,
        }}
      >
        {form.description.length}/1000
      </Text>
    </View>
  );
}