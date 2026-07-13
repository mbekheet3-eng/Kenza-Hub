import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function OrdersTrackingScreen({
  navigateTo,
  order = {},
}) {
  const trackingSteps = [
    {
      id: 1,
      title: 'Order Placed',
      date: '12 Jul 2026 - 09:15 AM',
      completed: true,
    },
    {
      id: 2,
      title: 'Payment Confirmed',
      date: '12 Jul 2026 - 09:30 AM',
      completed: true,
    },
    {
      id: 3,
      title: 'Preparing Shipment',
      date: '12 Jul 2026 - 02:00 PM',
      completed: true,
    },
    {
      id: 4,
      title: 'Shipped',
      date: '13 Jul 2026',
      completed: false,
    },
    {
      id: 5,
      title: 'Out for Delivery',
      date: '',
      completed: false,
    },
    {
      id: 6,
      title: 'Delivered',
      date: '',
      completed: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigateTo && navigateTo('orderdetails', { order })
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Order Tracking
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.orderCard}>
          <Text style={styles.orderId}>
            Order #{order.id || 'KH100254'}
          </Text>

          <Text style={styles.orderStatus}>
            Current Status: Preparing Shipment
          </Text>
        </View>

        <View style={styles.timeline}>
          {trackingSteps.map((step, index) => (
            <View
              key={step.id}
              style={styles.stepContainer}
            >
              <View style={styles.iconColumn}>
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: step.completed
                        ? COLORS.primary
                        : '#ccc',
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      step.completed
                        ? 'checkmark'
                        : 'ellipse'
                    }
                    size={14}
                    color="#fff"
                  />
                </View>

                {index !== trackingSteps.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      {
                        backgroundColor: step.completed
                          ? COLORS.primary
                          : '#ddd',
                      },
                    ]}
                  />
                )}
              </View>

              <View style={styles.textColumn}>
                <Text
                  style={[
                    styles.stepTitle,
                    step.completed &&
                      styles.completedTitle,
                  ]}
                >
                  {step.title}
                </Text>

                {step.date ? (
                  <Text style={styles.stepDate}>
                    {step.date}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigateTo && navigateTo('orders')
          }
        >
          <Text style={styles.buttonText}>
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

  orderCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 25,
  },

  orderId: {
    fontSize: 18,
    fontWeight: '700',
  },

  orderStatus: {
    marginTop: 8,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
  },

  timeline: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },

  stepContainer: {
    flexDirection: 'row',
  },

  iconColumn: {
    alignItems: 'center',
    marginRight: 16,
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  line: {
    width: 2,
    flex: 1,
    minHeight: 45,
  },

  textColumn: {
    flex: 1,
    paddingBottom: 25,
  },

  stepTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },

  completedTitle: {
    color: '#000',
    fontWeight: '700',
  },

  stepDate: {
    marginTop: 6,
    color: '#999',
    fontSize: 13,
  },

  button: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});