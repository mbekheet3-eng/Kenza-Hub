import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { TRANSLATIONS } from '../translations';

export default function SearchBar({ lang, isRTL, onSearch }) {
  const [query, setQuery] = useState('');
  const t = TRANSLATIONS[lang];

  return (
    <View style={[styles.container, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <TextInput
        style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
        placeholder={t.searchPlaceholder}
        placeholderTextColor={COLORS.gray}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => onSearch && onSearch(query)}
        returnKeyType="search"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => onSearch && onSearch(query)}
      >
        <Text style={styles.searchIcon}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.navy,
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
});