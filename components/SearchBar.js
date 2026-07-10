import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { TRANSLATIONS } from '../translations';

export default function SearchBar({
  lang,
  isRTL,
  value = '',
  onSearch,
}) {
  const t = TRANSLATIONS[lang];

  return (
    <View
      style={[
        styles.container,
        { flexDirection: isRTL ? 'row-reverse' : 'row' },
      ]}
    >
      <Ionicons
        name="search"
        size={22}
        color="#888"
        style={styles.icon}
      />

      <TextInput
        style={[
          styles.input,
          { textAlign: isRTL ? 'right' : 'left' },
        ]}
        placeholder={t.searchPlaceholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onSearch}
        returnKeyType="search"
        autoCorrect={false}
      />

      {value !== '' && (
        <TouchableOpacity onPress={() => onSearch('')}>
          <Ionicons
            name="close-circle"
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginVertical: 8,
  },

  icon: {
    marginHorizontal: 6,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.navy,
    paddingVertical: 0,
  },
});
