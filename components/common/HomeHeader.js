import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../Search/SearchBar';
import { COLORS } from '../../theme/colors';

export default function HomeHeader({
  lang = 'ar',
  user,
  searchQuery,
  onSearch,
  navigateTo,
}) {
  const isRTL = lang === 'ar';

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    'ضيف كنزة';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <Text style={styles.welcome}>
            👋 أهلاً، {userName}
          </Text>

          <Text style={styles.title}>
            Kenza Hub
          </Text>

          <Text style={styles.subtitle}>
            اكتشف برانداتك المفضلة... بأسعار مميزة وفرص جديدة كل يوم
          </Text>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          activeOpacity={0.8}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          lang={lang}
          isRTL={isRTL}
          value={searchQuery}
          onSearch={onSearch}
          navigateTo={navigateTo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  leftSection: {
    flex: 1,
    paddingRight: 12,
  },

  welcome: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  searchContainer: {
    marginTop: 18,
  },
});