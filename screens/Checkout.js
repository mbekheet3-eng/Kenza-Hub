import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function CheckoutScreen({
  cart = [],
  navigateTo,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState('cash');

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + (item.price || 0),
      0
    );
  }, [cart]);

  const shipping = subtotal > 0 ? 75 : 0;

  const total = subtotal + shipping;

  const confirmOrder = () => {
    if (!name.trim()) {
      Alert.alert(
        'Missing Data',
        'Please enter your name.'
      );
      return;
    }

    if (!phone.trim()) {
      Alert.alert(
        'Missing Data',
        'Please enter your phone number.'
      );
      return;
    }

    if (!address.trim()) {
      Alert.alert(
        'Missing Data',
        'Please enter your address.'
      );
      return;
    }

    Alert.alert(
      'Order Confirmed',
      'Your order has been placed successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            if (navigateTo) {
              navigateTo('Home');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
        }}
      >
        <Text style={styles.title}>
          Checkout
        </Text>

        <Text style={styles.section}>
          Shipping Information
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Shipping Address"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Order Notes (Optional)"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <Text style={styles.section}>
          Payment Method
        </Text>

        <TouchableOpacity
          style={styles.paymentItem}
          onPress={() =>
            setPaymentMethod('cash')
          }
        >
          <Ionicons
            name={
              paymentMethod === 'cash'
                ? 'radio-button-on'
                : 'radio-button-off'
            }
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.paymentText}>
            Cash on Delivery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentItem}
          onPress={() =>
            setPaymentMethod('wallet')
          }
        >
          <Ionicons
            name={
              paymentMethod === 'wallet'
                ? 'radio-button-on'
                : 'radio-button-off'
            }
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.paymentText}>
            Kenza Wallet
          </Text>
        </TouchableOpacity>

        <Text style={styles.section}>
          Order Summary
        </Text>        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Items
            </Text>

            <Text style={styles.summaryValue}>
              {cart.length}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal
            </Text>

            <Text style={styles.summaryValue}>
              {subtotal.toFixed(2)} EGP
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Shipping
            </Text>

            <Text style={styles.summaryValue}>
              {shipping.toFixed(2)} EGP
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalValue}>
              {total.toFixed(2)} EGP
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmOrder}
        >
          <Text style={styles.confirmText}>
            Confirm Order
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 10,
    color: '#222',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  paymentText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },

  summaryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },

  confirmButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
  },

  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});