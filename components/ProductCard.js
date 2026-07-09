import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 16 * 3) / 2; // مسافة 16 على الجنبين + مسافة في النص

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
      <Text style={styles.price}>{product.price} ج.م</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.3,
    borderRadius: 10,
    backgroundColor: COLORS.lightGray,
    marginBottom: 6,
  },
  title: {
    fontSize: 13,
    color: COLORS.navy,
    fontWeight: '500',
    textAlign: 'right',
  },
  price: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 2,
  },
});