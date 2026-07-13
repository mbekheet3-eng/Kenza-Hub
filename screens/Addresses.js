import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function AddressesScreen({ navigateTo }) {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      title: 'Home',
      name: 'Mohamed Bakhit',
      phone: '01000000000',
      address:
        'Maadi, Cairo, Egypt',
      default: true,
    },
  ]);

  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const addAddress = () => {
    if (!title || !name || !phone || !address) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    setAddresses([
      ...addresses,
      {
        id: Date.now().toString(),
        title,
        name,
        phone,
        address,
        default: false,
      },
    ]);

    setTitle('');
    setName('');
    setPhone('');
    setAddress('');
  };

  const deleteAddress = (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setAddresses(
              addresses.filter(
                (item) => item.id !== id
              )
            ),
        },
      ]
    );
  };

  const setDefault = (id) => {
    setAddresses(
      addresses.map((item) => ({
        ...item,
        default: item.id === id,
      }))
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        {item.default && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Default
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.text}>
        {item.name}
      </Text>

      <Text style={styles.text}>
        {item.phone}
      </Text>

      <Text style={styles.text}>
        {item.address}
      </Text>

      <View style={styles.actions}>
        {!item.default && (
          <TouchableOpacity
            onPress={() =>
              setDefault(item.id)
            }
          >
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() =>
            deleteAddress(item.id)
          }
        >
          <Ionicons
            name="trash"
            size={24}
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
            navigateTo('Profile')
          }
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          My Addresses
        </Text>

        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Address Title"
              value={title}
              onChangeText={setTitle}
            />

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
              placeholder="Full Address"
              value={address}
              onChangeText={setAddress}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={addAddress}
            >
              <Text style={styles.buttonText}>
                Add Address
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },

  form: {
    padding: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
  },

  text: {
    color: '#666',
    marginBottom: 4,
  },

  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: 'green',
    fontWeight: '700',
    fontSize: 12,
  },

  actions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
});