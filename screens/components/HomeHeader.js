import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    'أهلاً بك';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>👋 أهلاً</Text>

      <Text style={styles.name}>{userName}</Text>

      <Text style={styles.subtitle}>
        اكتشف أفضل القطع المستعملة بعناية
      </Text>

      <View style={styles.searchContainer}>
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },

  greeting: {
    fontSize: 16,
    color: '#777',
  },

  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    color: '#666',
  },

  searchContainer: {
    marginBottom: 4,
  },
});
