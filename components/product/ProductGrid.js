import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';

// بيانات تجريبية
export const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'جاكيت جينز',
    price: 250,
    category: 'women',
    image:
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'حذاء رياضي',
    price: 400,
    category: 'men',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'فستان صيفي',
    price: 180,
    category: 'women',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'تيشيرت أطفال',
    price: 90,
    category: 'kids',
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'بنطلون قماش',
    price: 220,
    category: 'men',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
  },
  {
    id: '6',
    title: 'شنطة يد',
    price: 300,
    category: 'women',
    image:
      'https://images.unsplash.com/photo-1595995477361-41d9a34e7a38?w=300&h=400&fit=crop',
  },
];

export default function ProductGrid({
  products,
  onProductPress,
}) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={onProductPress}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 110,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
});