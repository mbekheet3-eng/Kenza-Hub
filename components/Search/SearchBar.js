import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { TRANSLATIONS } from '../../translations';

export default function SearchBar({
  lang,
  isRTL,
  value = '',
  onSearch,
  navigateTo,
}) {
  const [query, setQuery] = useState(value);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    setQuery(value);
  }, [value]);

const handleSearch = () => {
  if (query.trim()) {
    navigateTo &&
      navigateTo('searching', {
        query: query.trim(),
      });
  }

  onSearch && onSearch(query);
};

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
<TouchableOpacity
  style={styles.iconButton}
  onPress={() => navigateTo?.('searchByImage')}
  activeOpacity={0.7}
>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      <TextInput
        style={[
          styles.input,
          {
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}
        placeholder={t.searchPlaceholder}
        placeholderTextColor="#9CA3AF"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.iconButton}
onPress={() =>
  navigateTo &&
  navigateTo('searchByImage')
}
        activeOpacity={0.7}
      >
        <Ionicons
          name="camera-outline"
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ECECEC',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    paddingHorizontal: 8,
    paddingVertical: 0,
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});