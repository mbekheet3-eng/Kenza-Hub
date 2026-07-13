// screens/sell/SellButtons.js

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../theme/colors';

export default function SellButtons({
  step = 0,
  totalSteps = 7,
  loading = false,
  onBack,
  onNext,
  onSubmit,
}) {
  const isLastStep = step === totalSteps - 1;

  return (
    <View style={styles.container}>
      {step > 0 ? (
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onBack}
          disabled={loading}
        >
          <Text style={styles.secondaryText}>
            Back
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <TouchableOpacity
        style={[
          styles.button,
          styles.primaryButton,
          loading && styles.disabledButton,
        ]}
        onPress={isLastStep ? onSubmit : onNext}
        disabled={loading}
      >
        <Text style={styles.primaryText}>
          {loading
            ? 'Please wait...'
            : isLastStep
            ? 'Publish'
            : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },

  placeholder: {
    flex: 1,
    marginRight: 8,
  },

  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },

  secondaryButton: {
    backgroundColor: '#F2F2F2',
    marginRight: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});