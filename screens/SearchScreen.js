import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const RECENT_SEARCHES = [
  'Zara',
  'Nike',
  'H&M',
  'Adidas',
  'Dress',
  'Shoes',
  'Kids',
];

export default function SearchScreen({ navigateTo }) {
  const [query, setQuery] = useState('');

  const startSearch = (text) => {
    const value = text.trim();

    if (!value) return;

    navigateTo &&
      navigateTo('searching', {
        searchQuery: value,
      });
  };

  const renderRecent = ({ item }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => startSearch(item)}
    >
      <Ionicons
        name="time-outline"
        size={18}
        color="#777"
      />

      <Text style={styles.recentText}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
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

        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Search products, brands..."
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={() =>
              startSearch(query)
            }
            autoFocus
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.imageSearchButton}
        onPress={() =>
          navigateTo &&
          navigateTo('searchbyimage')
        }
      >
        <Ionicons
          name="camera"
          size={22}
          color={COLORS.primary}
        />

        <Text style={styles.imageSearchText}>
          Search by Image
        </Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Recent Searches
        </Text>

        <TouchableOpacity>
          <Text style={styles.clearText}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={RECENT_SEARCHES}
        keyExtractor={(item, index) =>
          index.toString()
        }
        renderItem={renderRecent}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    marginLeft: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    height: 46,
    marginLeft: 8,
    fontSize: 16,
  },

  imageSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
  },

  imageSearchText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  clearText: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  recentText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});