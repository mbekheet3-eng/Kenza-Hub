import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function EditProfileScreen({
  navigateTo,
  user = {},
}) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [city, setCity] = useState(user.city || '');
  const [bio, setBio] = useState(user.bio || '');

  const saveProfile = () => {
    Alert.alert(
      'Success',
      'Profile updated successfully.',
      [
        {
          text: 'OK',
          onPress: () =>
            navigateTo &&
            navigateTo('ProfileScreen'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() =>
            navigateTo &&
            navigateTo('ProfileScreen')
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>


        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user.avatar ||
                'https://i.pravatar.cc/300',
            }}
            style={styles.avatar}
          />

          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={() =>
              Alert.alert(
                'Coming Soon',
                'Change profile picture feature.'
              )
            }
          >
            <Ionicons
              name="camera"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>


        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />


        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />


        <Text style={styles.label}>
          Phone
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />


        <Text style={styles.label}>
          City
        </Text>

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />


        <Text style={styles.label}>
          Bio
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.bio,
          ]}
          placeholder="Tell us about yourself..."
          multiline
          numberOfLines={4}
          value={bio}
          onChangeText={setBio}
        />


        <TouchableOpacity
          style={styles.saveBtn}
          onPress={saveProfile}
        >
          <Text style={styles.saveText}>
            Save Changes
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() =>
            navigateTo &&
            navigateTo('ProfileScreen')
          }
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      COLORS.background || '#fff',
  },


  content: {
    padding: 20,
    paddingBottom: 40,
  },


  backBtn: {
    marginBottom: 20,
  },


  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },


  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },


  cameraBtn: {
    position: 'absolute',
    right: 115,
    bottom: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },


  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },


  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },


  bio: {
    height: 120,
    textAlignVertical: 'top',
  },


  saveBtn: {
    marginTop: 35,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },


  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },


  cancelBtn: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },


  cancelText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },

});