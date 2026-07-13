import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { TRANSLATIONS } from '../../translations';

const TABS = [
  {
    key: 'home',
    icon: 'home-outline',
    active: 'home',
  },
  {
    key: 'chat',
    icon: 'chatbubble-ellipses-outline',
    active: 'chatbubble',
  },
  {
    key: 'sell',
    icon: 'add-circle-outline',
    active: 'add-circle',
  },
  {
    key: 'profile',
    icon: 'person-outline',
    active: 'person',
  },
];

export default function BottomNav({
  lang,
  activeTab,
  onTabPress,
}) {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const tabs = isRTL ? [...TABS].reverse() : TABS;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.8}
              onPress={() => onTabPress(tab.key)}
            >
              <Ionicons
                name={active ? tab.active : tab.icon}
                size={24}
                color={
                  active
                    ? COLORS.primary
                    : '#888'
                }
              />

              <Text
                style={[
                  styles.label,
                  active && styles.activeLabel,
                ]}
              >
                {t[tab.key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },

  container: {
    height: 70,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 8,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
  },

  label: {
    marginTop: 4,
    fontSize: 11,
    color: '#888',
  },

  activeLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});