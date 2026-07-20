// screens/sell/StepDescription.js

import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';

import styles from './SellStyles';

const LABELS = {
  ar: {
    title: 'وصف المنتج',
    subtitle: 'اوصف القطعة بوضوح. اذكر أي عيوب، الخامة، المقاسات، وأي تفاصيل مهمة.',
    placeholder: 'مثال: چاكيت زارا، مقاس M، اتلبس مرتين، حالة ممتازة...',
  },
  en: {
    title: 'Product Description',
    subtitle: 'Describe the item clearly. Mention defects, material, measurements, and any important details.',
    placeholder: 'Example: Zara jacket, size M, worn twice, excellent condition...',
  },
  fr: {
    title: 'Description du produit',
    subtitle: 'Décrivez clairement l\'article. Mentionnez les défauts, la matière, les mesures et tout détail important.',
    placeholder: 'Exemple : Veste Zara, taille M, portée deux fois, excellent état...',
  },
};

export default function StepDescription({
  form,
  setForm,
  lang = 'ar',
}) {
  const l = LABELS[lang] || LABELS.ar;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>
        {l.title}
      </Text>

      <Text style={styles.subtitle}>
        {l.subtitle}
      </Text>

      <TextInput
        style={styles.textArea}
        placeholder={l.placeholder}
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
