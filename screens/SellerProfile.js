import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const PRODUCTS = [
  {
    id: '1',
    title: 'Zara Jacket',
    price: '450 EGP',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
  },
  {
    id: '2',
    title: 'Nike Sneakers',
    price: '850 EGP',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: '3',
    title: 'H&M Hoodie',
    price: '320 EGP',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723',
  },
];

export default function SellerProfileScreen({
  navigateTo,
  seller = {},
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigateTo && navigateTo('productdetails')
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Seller Profile
        </Text>

        <TouchableOpacity>
          <Ionicons
            name="share-social-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{
            uri:
              seller.avatar ||
              'https://i.pravatar.cc/300?img=12',
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>
          {seller.name || 'Ahmed Mohamed'}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons
            name="star"
            size={18}
            color="#FFC107"
          />
          <Text style={styles.rating}>
            {seller.rating || '4.9'} (128 Reviews)
          </Text>
        </View>

        <Text style={styles.member}>
          Member since 2024
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>36</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statNumber}>112</Text>
            <Text style={styles.statLabel}>Sold</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Positive</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() =>
            navigateTo &&
            navigateTo('chat')
          }
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color="#fff"
          />

          <Text style={styles.chatText}>
            Contact Seller
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>
          Seller Products
        </Text>

        <View style={styles.products}>
          {PRODUCTS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigateTo &&
                navigateTo('productdetails', {
                  product: item,
                })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
              />

              <Text
                numberOfLines={1}
                style={styles.productTitle}
              >
                {item.title}
              </Text>

              <Text style={styles.price}>
                {item.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },

  content: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 30,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  name: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: '700',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  rating: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '600',
  },

  member: {
    color: '#777',
    marginTop: 8,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
    marginBottom: 25,
  },

  stat: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },

  statLabel: {
    marginTop: 5,
    color: '#666',
  },

  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 30,
  },

  chatText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 16,
  },

  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },

  products: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
  },

  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },

  productTitle: {
    marginTop: 10,
    fontWeight: '700',
  },

  price: {
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 6,
  },
});