import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const REVIEWS = [
  {
    id: '1',
    user: 'Ahmed',
    rating: 5,
    comment: 'Excellent seller. Product exactly as described.',
    date: '12 Jul 2026',
  },
  {
    id: '2',
    user: 'Sara',
    rating: 4,
    comment: 'Fast delivery and good communication.',
    date: '08 Jul 2026',
  },
  {
    id: '3',
    user: 'Mohamed',
    rating: 5,
    comment: 'Highly recommended. Will buy again.',
    date: '01 Jul 2026',
  },
];

export default function MyReviewsScreen({ navigateTo }) {
  const [reviews] = useState(REVIEWS);

  const renderStars = (rating) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={18}
          color="#FFC107"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>

      {renderStars(item.rating)}

      <Text style={styles.comment}>
        {item.comment}
      </Text>
    </View>
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
          My Reviews
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.summary}>
        <Text style={styles.average}>
          ⭐ 4.7 / 5
        </Text>

        <Text style={styles.total}>
          {reviews.length} Reviews
        </Text>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={90}
            color="#bbb"
          />

          <Text style={styles.emptyTitle}>
            No Reviews Yet
          </Text>

          <Text style={styles.emptyText}>
            Your received reviews will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 30,
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

  summary: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },

  average: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  total: {
    marginTop: 5,
    color: '#777',
    fontSize: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  user: {
    fontSize: 17,
    fontWeight: '700',
  },

  date: {
    color: '#888',
    fontSize: 13,
  },

  starsRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 10,
  },

  comment: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
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
    marginTop: 10,
    color: '#777',
    textAlign: 'center',
  },
});