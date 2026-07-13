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

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Message',
    message: 'You received a new message about your Zara Jacket.',
    time: '5 min ago',
    icon: 'chatbubble-outline',
    read: false,
  },
  {
    id: '2',
    title: 'Item Sold',
    message: 'Congratulations! Your Nike Shoes have been sold.',
    time: '2 hours ago',
    icon: 'checkmark-circle-outline',
    read: false,
  },
  {
    id: '3',
    title: 'New Favorite',
    message: 'Someone added your H&M Hoodie to their favorites.',
    time: 'Yesterday',
    icon: 'heart-outline',
    read: true,
  },
  {
    id: '4',
    title: 'Price Suggestion',
    message: 'Your item has received a price offer.',
    time: '2 days ago',
    icon: 'pricetag-outline',
    read: true,
  },
];

export default function NotificationsScreen({ navigateTo }) {
  const [notifications, setNotifications] = useState(
    INITIAL_NOTIFICATIONS
  );

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        !item.read && styles.unreadCard,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={item.icon}
          size={24}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.message}>
          {item.message}
        </Text>

        <Text style={styles.time}>
          {item.time}
        </Text>
      </View>

      {!item.read && <View style={styles.dot} />}
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
          Notifications
        </Text>

        <TouchableOpacity onPress={markAllRead}>
          <Ionicons
            name="checkmark-done"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={90}
            color="#bbb"
          />

          <Text style={styles.emptyTitle}>
            No Notifications
          </Text>

          <Text style={styles.emptyText}>
            You're all caught up.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
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
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },

  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    marginLeft: 15,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  message: {
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },

  time: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
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