import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const PRODUCTS = [
  {
    id: '1',
    title: 'Zara Jacket',
    brand: 'Zara',
    price: '450 EGP',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
  },
  {
    id: '2',
    title: 'Nike Sneakers',
    brand: 'Nike',
    price: '850 EGP',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: '3',
    title: 'H&M Hoodie',
    brand: 'H&M',
    price: '320 EGP',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723',
  },
  {
    id: '4',
    title: 'Adidas T-Shirt',
    brand: 'Adidas',
    price: '280 EGP',
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
  },
];

const LABELS = {
  ar: {
    searchPlaceholder: 'دور على منتج...',
    resultsFound: (n) => `${n} نتيجة`,
    noResultsTitle: 'مفيش نتايج',
    noResultsText: 'جرب كلمة تانية أو تصفح كل المنتجات.',
    browseProducts: 'تصفح المنتجات',
  },
  en: {
    searchPlaceholder: 'Search products...',
    resultsFound: (n) => `${n} Results Found`,
    noResultsTitle: 'No Results Found',
    noResultsText: 'Try another keyword or browse all products.',
    browseProducts: 'Browse Products',
  },
  fr: {
    searchPlaceholder: 'Rechercher des produits...',
    resultsFound: (n) => `${n} résultats trouvés`,
    noResultsTitle: 'Aucun résultat',
    noResultsText: 'Essayez un autre mot-clé ou parcourez tous les produits.',
    browseProducts: 'Parcourir les produits',
  },
};

export default function SearchResultScreen({
  navigateTo,
  searchQuery = '',
  lang = 'ar',
}) {
  const l = LABELS[lang] || LABELS.ar;
  const [query, setQuery] = useState(searchQuery);

  const filteredProducts = PRODUCTS.filter((item) =>
    `${item.title} ${item.brand}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigateTo &&
        navigateTo('productDetails', {
          product: item,
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <Text style={styles.title}>
        {item.title}
      </Text>

      <Text style={styles.brand}>
        {item.brand}
      </Text>

      <Text style={styles.price}>
        {item.price}
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

        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
          />

          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder={l.searchPlaceholder}
          />
        </View>
      </View>

      <Text style={styles.results}>
        {l.resultsFound(filteredProducts.length)}
      </Text>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="search-outline"
            size={90}
            color="#bbb"
          />

          <Text style={styles.emptyTitle}>
            {l.noResultsTitle}
          </Text>

          <Text style={styles.emptyText}>
            {l.noResultsText}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigateTo && navigateTo('home')
            }
          >
            <Text style={styles.buttonText}>
              {l.browseProducts}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    padding: 16,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    marginLeft: 12,
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    height: 45,
    marginLeft: 8,
  },

  results: {
    paddingHorizontal: 16,
    marginBottom: 12,
    color: '#666',
    fontWeight: '600',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },

  brand: {
    color: '#777',
    marginTop: 3,
  },

  price: {
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 8,
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 10,
    marginBottom: 25,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});