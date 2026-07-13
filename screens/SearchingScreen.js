import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function SearchingScreen({
  navigateTo,
  searchQuery = '',
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigateTo) {
navigateTo('searchResult', {
  query: searchQuery,
});
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigateTo, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigateTo && navigateTo('home')
        }
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="search"
            size={60}
            color={COLORS.primary}
          />
        </View>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />

        <Text style={styles.title}>
          Searching...
        </Text>

        {searchQuery ? (
          <Text style={styles.query}>
            "{searchQuery}"
          </Text>
        ) : (
          <Text style={styles.query}>
            Looking for the best matches...
          </Text>
        )}

        <Text style={styles.description}>
          Please wait while we search through
          thousands of products on Kenza Hub.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#fff',
  },

  backButton: {
    marginTop: 15,
    marginLeft: 20,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  loader: {
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
  },

  query: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },

  description: {
    marginTop: 20,
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    lineHeight: 24,
  },
});