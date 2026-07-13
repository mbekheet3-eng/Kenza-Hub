import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const INITIAL_LISTINGS = [
  {
    id: '1',
    title: 'Zara Jacket',
    price: '450 EGP',
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
  },
  {
    id: '2',
    title: 'Nike Shoes',
    price: '850 EGP',
    status: 'Sold',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: '3',
    title: 'H&M Hoodie',
    price: '320 EGP',
    status: 'Pending',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723',
  },
];

export default function MyListingsScreen({ navigateTo }) {
  const [listings, setListings] = useState(INITIAL_LISTINGS);

  const deleteListing = (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setListings((prev) =>
              prev.filter((item) => item.id !== id)
            ),
        },
      ]
    );
  };

  const renderStatus = (status) => {
    let color = '#4CAF50';

    if (status === 'Sold') color = '#999';
    if (status === 'Pending') color = '#FF9800';

    return (
      <Text style={[styles.status, { color }]}>
        {status}
      </Text>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.price}>
          {item.price}
        </Text>

        {renderStatus(item.status)}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            navigateTo &&
            navigateTo('editlisting', {
              product: item,
            })
          }
        >
          <Ionicons
            name="create-outline"
            size={22}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            deleteListing(item.id)
          }
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color="red"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigateTo &&
            navigateTo('profile')
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          My Listings
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigateTo &&
            navigateTo('sell')
          }
        >
          <Ionicons
            name="add-circle"
            size={28}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="cube-outline"
            size={90}
            color="#bbb"
          />

          <Text style={styles.emptyTitle}>
            No Listings Yet
          </Text>

          <Text style={styles.emptyText}>
            Start selling your first item on Kenza Hub.
          </Text>

          <TouchableOpacity
            style={styles.sellButton}
            onPress={() =>
              navigateTo &&
              navigateTo('sell')
            }
          >
            <Text style={styles.sellButtonText}>
              Sell an Item
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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
    paddingVertical: 16,
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
    marginLeft: 15,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
  },

  price: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 6,
    fontWeight: '700',
  },

  status: {
    marginTop: 8,
    fontWeight: '700',
  },

  actions: {
    justifyContent: 'space-around',
    height: 80,
  },

  iconButton: {
    padding: 6,
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

  sellButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },

  sellButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});