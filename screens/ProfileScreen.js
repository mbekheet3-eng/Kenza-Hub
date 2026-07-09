import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { signOut } from '../services/auth';

const LABELS = {
  ar: {
    title: 'البروفايل',
    guest: 'زائر',
    guestMsg: 'سجل دخولك عشان تشوف بروفايلك',
    login: 'تسجيل الدخول',
    myProducts: 'منتجاتي',
    myOrders: 'طلباتي',
    favorites: 'المفضلة',
    settings: 'الإعدادات',
    help: 'المساعدة',
    logout: 'تسجيل الخروج',
    logoutConfirm: 'هل تريد تسجيل الخروج؟',
    yes: 'نعم',
    no: 'لا',
    comingSoon: 'قريبًا',
    back: 'رجوع',
    loggedInAs: 'مسجل دخول كـ',
  },
  en: {
    title: 'Profile',
    guest: 'Guest',
    guestMsg: 'Log in to view your profile',
    login: 'Log In',
    myProducts: 'My Products',
    myOrders: 'My Orders',
    favorites: 'Favorites',
    settings: 'Settings',
    help: 'Help',
    logout: 'Log Out',
    logoutConfirm: 'Are you sure you want to log out?',
    yes: 'Yes',
    no: 'No',
    comingSoon: 'Coming Soon',
    back: 'Back',
    loggedInAs: 'Logged in as',
  },
  fr: {
    title: 'Profil',
    guest: 'Invité',
    guestMsg: 'Connectez-vous pour voir votre profil',
    login: 'Se connecter',
    myProducts: 'Mes articles',
    myOrders: 'Mes commandes',
    favorites: 'Favoris',
    settings: 'Paramètres',
    help: 'Aide',
    logout: 'Se déconnecter',
    logoutConfirm: 'Voulez-vous vous déconnecter?',
    yes: 'Oui',
    no: 'Non',
    comingSoon: 'Bientôt',
    back: 'Retour',
    loggedInAs: 'Connecté en tant que',
  },
};

const MENU_ITEMS = [
  { key: 'myOrders', icon: '📦', action: 'orders' },
  { key: 'myProducts', icon: '👗', action: 'comingSoon' },
  { key: 'favorites', icon: '❤️', action: 'comingSoon' },
  { key: 'settings', icon: '⚙️', action: 'comingSoon' },
  { key: 'help', icon: '💬', action: 'comingSoon' },
];

export default function ProfileScreen({ lang = 'ar', onBack, user, onLogout, onNavigateOrders }) {
  const isRTL = lang === 'ar';
  const l = LABELS[lang];

  const handleLogout = () => {
    Alert.alert(l.logout, l.logoutConfirm, [
      { text: l.no, style: 'cancel' },
      {
        text: l.yes,
        onPress: async () => {
          try {
            await signOut();
            onLogout();
          } catch {
            onLogout();
          }
        },
      },
    ]);
  };

  const handleMenuPress = (action) => {
    if (action === 'orders') {
      onNavigateOrders();
    } else {
      Alert.alert('', l.comingSoon);
    }
  };

  const displayName = user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || l.guest;

  const displayEmail = user?.email || '';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{l.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? displayName[0].toUpperCase() : '👤'}
            </Text>
          </View>

          <Text style={styles.displayName}>{displayName}</Text>

          {user ? (
            <Text style={styles.displayEmail}>{displayEmail}</Text>
          ) : (
            <>
              <Text style={styles.guestMsg}>{l.guestMsg}</Text>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => Alert.alert('', l.comingSoon)}
              >
                <Text style={styles.loginBtnText}>{l.login}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => handleMenuPress(item.action)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuText}>{l[item.key]}</Text>
              <Text style={[
                styles.menuArrow,
                { marginLeft: isRTL ? 0 : 'auto', marginRight: isRTL ? 'auto' : 0 }
              ]}>
                {isRTL ? '‹' : '›'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>{l.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 22, color: COLORS.navy },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.navy },

  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, color: COLORS.white, fontWeight: 'bold' },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 4,
  },
  displayEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  guestMsg: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },

  menuSection: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    gap: 12,
  },
  menuIcon: { fontSize: 20 },
  menuText: { fontSize: 15, color: COLORS.navy, fontWeight: '500', flex: 1 },
  menuArrow: { fontSize: 20, color: COLORS.gray },

  logoutBtn: {
    margin: 24,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: '600' },
});