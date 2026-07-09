import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { TRANSLATIONS } from '../translations';

const TABS = [
  { key: 'home', icon: '🏠' },
  { key: 'chat', icon: '💬' },
  { key: 'sell', icon: '➕' },
  { key: 'profile', icon: '👤' },
];

export default function BottomNav({ lang, activeTab, onTabPress }) {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const displayTabs = isRTL ? [...TABS].reverse() : TABS;

  return (
    <View style={styles.container}>
      {displayTabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t[tab.key]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 8,
    paddingBottom: 20,
  },
  tab: { flex: 1, alignItems: 'center' },
  icon: { fontSize: 20, marginBottom: 2 },
  label: { fontSize: 11, color: COLORS.gray },
  labelActive: { color: COLORS.primary, fontWeight: '600' },
});