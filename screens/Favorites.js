import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const FAVORITES = [
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
];

export default function FavoritesScreen({ navigateTo }) {
  const [favorites, setFavorites] = useState(FAVORITES);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigateTo &&
        navigateTo('productdetails', { product: item })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.brand}>
          {item.brand}
        </Text>

        <Text style={styles.price}>
          {item.price}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => removeFavorite(item.id)}
      >
        <Ionicons
          name="heart"
          size={26}
          color="red"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigateTo && navigateTo('profile')
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Favorites
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="heart-outline"
            size={90}
            color="#bbb"
          />

          <Text style={styles.emptyTitle}>
            No Favorites Yet
          </Text>

          <Text style={styles.emptyText}>
            Save products you like to see them here.
          </Text>

          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() =>
              navigateTo && navigateTo('home')
            }
          >
            <Text style={styles.shopText}>
              Explore Products
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
          }}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    alignItems: 'center',
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginHorizontal: 15,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
  },

  brand: {
    color: '#777',
    marginTop: 4,
  },

  price: {
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 10,
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
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
  },

  shopBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
  },

  shopText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});