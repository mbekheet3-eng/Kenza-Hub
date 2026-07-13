import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import SellWizard from './Sell/SellWizardScreen';

export default function SellWizardWrapper(props) {
  return (
    <SafeAreaView style={styles.container}>
      <SellWizard {...props} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#fff',
  },
});