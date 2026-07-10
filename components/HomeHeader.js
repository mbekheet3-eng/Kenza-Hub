import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from './SearchBar';
import { COLORS } from '../theme/colors';

export default function HomeHeader({
  lang = 'ar',
  user,
  searchQuery,
  onSearch,
}) {
  const isRTL = lang === 'ar';

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    'ضيف كنزة';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.welcome}>
            👋 أهلاً، {userName}
          </Text>

          <Text style={styles.title}>
            Kenza Hub
          </Text>

          <Text style={styles.subtitle}>
            اكتشف أفضل الملابس المستعملة في مصر
          </Text>
        </View>

        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <SearchBar
          lang={lang}
          isRTL={isRTL}
          value={searchQuery}
          onSearch={onSearch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  welcome: {
    fontSize: 15,
    color: '#777',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },

  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBox: {
    marginTop: 18,
  },
});
