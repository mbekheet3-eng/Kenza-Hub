import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { TRANSLATIONS } from '../translations';

export default function Footer({ lang }) {
  // جلب الترجمات حسب اللغة
  const t = TRANSLATIONS[lang];

  return (
    <View style={styles.footerRow}>
      <TouchableOpacity 
        onPress={() => Alert.alert(t.aboutAlertTitle, t.aboutAlertBody)}
      >
        <Text style={styles.footerLink}>{t.aboutLink}</Text>
      </TouchableOpacity>
      <Text style={styles.footerDivider}>•</Text>
      <Text style={styles.footerVersion}>v1.0.0</Text>
    </View>
  );
}

// الأنماط خارج الدالة
const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 12,
    paddingBottom: 12,
  },
  footerLink: {
    color: COLORS.primary || '#E91E63',
    fontSize: 13,
    paddingVertical: 2,
    fontWeight: '500',
  },
  footerDivider: {
    color: COLORS.gray || '#888',
    marginHorizontal: 8,
    fontSize: 12,
  },
  footerVersion: {
    color: COLORS.gray || '#888',
    fontSize: 12,
  },
});