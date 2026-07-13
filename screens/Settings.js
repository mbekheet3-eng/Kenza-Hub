import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function SettingsScreen({ navigateTo }) {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const MenuItem = ({
    icon,
    title,
    onPress,
    rightComponent,
    danger,
  }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Ionicons
          name={icon}
          size={22}
          color={danger ? '#E53935' : COLORS.primary}
        />

        <Text
          style={[
            styles.itemText,
            danger && { color: '#E53935' },
          ]}
        >
          {title}
        </Text>
      </View>

      {rightComponent || (
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#999"
        />
      )}
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
          Settings
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.section}>
          Account
        </Text>

        <MenuItem
          icon="person-outline"
          title="Edit Profile"
          onPress={() =>
            navigateTo &&
            navigateTo('editprofile')
          }
        />

        <MenuItem
          icon="location-outline"
          title="My Addresses"
          onPress={() =>
            navigateTo &&
            navigateTo('addresses')
          }
        />

        <MenuItem
          icon="card-outline"
          title="Payment Methods"
          onPress={() =>
            Alert.alert(
              'Coming Soon',
              'Payment methods will be available later.'
            )
          }
        />

        <Text style={styles.section}>
          Preferences
        </Text>

        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: '#ccc',
                true: COLORS.primary,
              }}
            />
          }
        />

        <MenuItem
          icon="moon-outline"
          title="Dark Mode"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: '#ccc',
                true: COLORS.primary,
              }}
            />
          }
        />

        <MenuItem
          icon="language-outline"
          title="Language"
          onPress={() =>
            Alert.alert(
              'Language',
              'Arabic / English support.'
            )
          }
        />

        <Text style={styles.section}>
          Support
        </Text>

        <MenuItem
          icon="help-circle-outline"
          title="Help Center"
          onPress={() =>
            Alert.alert(
              'Help',
              'Help Center coming soon.'
            )
          }
        />

        <MenuItem
          icon="document-text-outline"
          title="Terms & Privacy"
          onPress={() =>
            Alert.alert(
              'Terms',
              'Terms & Privacy screen.'
            )
          }
        />

        <MenuItem
          icon="information-circle-outline"
          title="About Kenza Hub"
          onPress={() =>
            Alert.alert(
              'Kenza Hub',
              'Version 1.0.0'
            )
          }
        />

        <Text style={styles.section}>
          Account
        </Text>

        <MenuItem
          icon="log-out-outline"
          title="Logout"
          danger
          onPress={() =>
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  style: 'destructive',
                  onPress: () =>
                    navigateTo &&
                    navigateTo('welcome'),
                },
              ]
            )
          }
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
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

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  section: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemText: {
    marginLeft: 14,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});