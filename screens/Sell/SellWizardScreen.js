// screens/sell/StepReview.js

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native';

import styles from './SellStyles';

const ReviewRow = ({ label, value }) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>
      {value || '-'}
    </Text>
  </View>
);

export default function StepReview({ form }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>
        Review Your Listing
      </Text>

      <Text style={styles.subtitle}>
        Please review all information before publishing.
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
        label="Category"
        value={form.category}
      />

      <ReviewRow
        label="Brand"
        value={form.brand}
      />

      <ReviewRow
        label="Title"
        value={form.title}
      />

      <ReviewRow
        label="Size"
        value={form.size}
      />

      <ReviewRow
        label="Color"
        value={form.color}
      />

      <ReviewRow
        label="Condition"
        value={form.condition}
      />

      <ReviewRow
        label="Description"
        value={form.description}
      />

      <ReviewRow
        label="Price"
        value={
          form.price
            ? `${form.price} ${form.currency}`
            : '-'
        }
      />
    </ScrollView>
  );
}