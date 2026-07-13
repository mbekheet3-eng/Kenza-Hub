// screens/sell/SellProgress.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

const STEPS = [
  'Photos',
  'Category',
  'Brand',
  'Details',
  'Description',
  'Price',
  'Review',
];

export default function SellProgress({ step = 0 }) {
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>
          Step {step + 1} of {STEPS.length}
        </Text>

        <Text style={styles.title}>
          {STEPS[step]}
        </Text>
      </View>

      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${progress}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  header: {
    marginBottom: 10,
  },

  stepText: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },

  barBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
});