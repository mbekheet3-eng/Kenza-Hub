import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const TRANSACTIONS = [
  {
    id: '1',
    title: 'Sale - Zara Jacket',
    amount: '+450 EGP',
    date: '12 Jul 2026',
    type: 'income',
  },
  {
    id: '2',
    title: 'Purchase - Nike Shoes',
    amount: '-850 EGP',
    date: '10 Jul 2026',
    type: 'expense',
  },
  {
    id: '3',
    title: 'Refund',
    amount: '+320 EGP',
    date: '08 Jul 2026',
    type: 'income',
  },
  {
    id: '4',
    title: 'Withdrawal',
    amount: '-500 EGP',
    date: '05 Jul 2026',
    type: 'expense',
  },
];

export default function WalletScreen({ navigateTo }) {
  const renderItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={
            item.type === 'income'
              ? 'arrow-down-circle'
              : 'arrow-up-circle'
          }
          size={30}
          color={
            item.type === 'income'
              ? '#4CAF50'
              : '#F44336'
          }
        />
      </View>

      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          {item.title}
        </Text>

        <Text style={styles.transactionDate}>
          {item.date}
        </Text>
      </View>

      <Text
        style={[
          styles.amount,
          {
            color:
              item.type === 'income'
                ? '#4CAF50'
                : '#F44336',
          },
        ]}
      >
        {item.amount}
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
          My Wallet
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          Available Balance
        </Text>

        <Text style={styles.balance}>
          2,350 EGP
        </Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.primaryButton}
          >
            <Ionicons
              name="arrow-down"
              size={18}
              color="#fff"
            />

            <Text style={styles.primaryText}>
              Withdraw
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
          >
            <Ionicons
              name="add"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.secondaryText}>
              Top Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Recent Transactions
      </Text>

      <FlatList
        data={TRANSACTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      />
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

  balanceCard: {
    backgroundColor: COLORS.primary,
    margin: 20,
    borderRadius: 16,
    padding: 22,
  },

  balanceLabel: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 16,
  },

  balance: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    marginTop: 10,
  },

  buttonsRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
  },

  primaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 8,
  },

  primaryText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '700',
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
  },

  secondaryText: {
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 12,
  },

  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  iconContainer: {
    marginRight: 12,
  },

  transactionInfo: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  transactionDate: {
    color: '#777',
    marginTop: 4,
    fontSize: 13,
  },

  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});