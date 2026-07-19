import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getChats } from '../services/chat';

const LABELS = {
  ar: {
    title: 'المحادثات',
    noChats: 'مفيش محادثات لسه',
    noChatsMsg: 'لما تتواصل مع بائع أو مشتري هتظهر هنا',
    back: 'رجوع',
    loginRequired: 'سجل دخولك عشان تشوف محادثاتك',
  },
  en: {
    title: 'Chats',
    noChats: 'No chats yet',
    noChatsMsg: 'When you contact a seller or buyer, chats will appear here',
    back: 'Back',
    loginRequired: 'Log in to see your chats',
  },
  fr: {
    title: 'Messages',
    noChats: 'Pas encore de messages',
    noChatsMsg: 'Quand vous contactez un vendeur ou acheteur, les chats apparaîtront ici',
    back: 'Retour',
    loginRequired: 'Connectez-vous pour voir vos messages',
  },
};

const PLACEHOLDER_IMAGE = 'https://placehold.co/160x160/F5F5F5/999999?text=Kenza';

export default function ChatListScreen({ lang = 'ar', onBack, onOpenChat, user }) {
  const isRTL = lang === 'ar';
  const l = LABELS[lang];
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getChats(user.id);
      setChats(data || []);
    } catch (error) {
      console.log('fetchChats error:', error.message);
      setChats([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const renderChat = ({ item }) => {
    const title = lang === 'ar' ? item.products?.title_ar : item.products?.title_en;
    const images = (item.products?.product_images || [])
      .slice()
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    const image = images[0]?.image_url || PLACEHOLDER_IMAGE;

    return (
      <TouchableOpacity
        style={[styles.chatItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        onPress={() => onOpenChat({ id: item.id, title, image })}
      >
        <Image source={{ uri: image }} style={styles.avatar} />

        <View style={[styles.chatInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={styles.chatName} numberOfLines={1}>{title}</Text>
          {item.last_message_at && (
            <Text style={styles.chatTime}>
              {new Date(item.last_message_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : lang)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{l.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : !user ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyText}>{l.loginRequired}</Text>
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyText}>{l.noChats}</Text>
          <Text style={styles.emptySubText}>{l.noChatsMsg}</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChat}
          showsVerticalScrollIndicator={false}
        />
      )}
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

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navy,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },

  chatItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 15, fontWeight: 'bold', color: COLORS.navy, marginBottom: 4 },
  chatTime: { fontSize: 12, color: COLORS.gray },
});
