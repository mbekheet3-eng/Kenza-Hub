import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function OrderDetailsScreen({
  navigateTo,
  order = {},
}) {
  const product = order.product || {
    title: 'Zara Jacket',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    price: '450 EGP',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigateTo && navigateTo('orders')
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Order Details
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.image}
        />

        <Text style={styles.productTitle}>
          {product.title}
        </Text>

        <Text style={styles.price}>
          {product.price}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Information
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Order ID
            </Text>
            <Text style={styles.value}>
              #{order.id || 'KH100254'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Status
            </Text>
            <Text style={styles.status}>
              {order.status || 'Processing'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Order Date
            </Text>
            <Text style={styles.value}>
              {order.date || '12 Jul 2026'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Payment
            </Text>
            <Text style={styles.value}>
              Cash on Delivery
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Shipping
            </Text>
            <Text style={styles.value}>
              Standard Delivery
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Delivery Address
          </Text>

          <Text style={styles.address}>
            Mohamed Bakhit{"\n"}
            Cairo, Egypt{"\n"}
            +20 100 000 0000
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Summary
          </Text>

          <View style={styles.row}>
            <Text>Item Price</Text>
            <Text>{product.price}</Text>
          </View>

          <View style={styles.row}>
            <Text>Shipping</Text>
            <Text>50 EGP</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.total}>
              Total
            </Text>

            <Text style={styles.total}>
              500 EGP
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigateTo &&
            navigateTo('chat')
          }
        >
          <Text style={styles.buttonText}>
            Contact Seller
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigateTo &&
            navigateTo('orders')
          }
        >
          <Text style={styles.secondaryText}>
            Back to Orders
          </Text>
        </TouchableOpacity>
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

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
  },

  productTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 15,
  },

  price: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 8,
  },

  section: {
    marginTop: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  label: {
    color: '#666',
  },

  value: {
    fontWeight: '600',
  },

  status: {
    color: '#4CAF50',
    fontWeight: '700',
  },

  address: {
    lineHeight: 24,
    color: '#444',
  },

  total: {
    fontWeight: '700',
    fontSize: 17,
    color: COLORS.primary,
  },

  button: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  secondaryButton: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },

  secondaryText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
});