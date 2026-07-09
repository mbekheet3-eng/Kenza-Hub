import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { supabase } from '../services/supabase';

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

// Mock data للمحادثات لحد ما نربط Supabase
const MOCK_CHATS = [
  {
    id: '1',
    otherUserName: 'أحمد محمد',
    lastMessage: 'هل المنتج لسه متاح؟',
    lastMessageTime: '10:30',
    unread: 2,
  },
  {
    id: '2',
    otherUserName: 'سارة علي',
    lastMessage: 'شكراً، هوصلك المنتج بكرا',
    lastMessageTime: 'أمس',
    unread: 0,
  },
  {
    id: '3',
    otherUserName: 'محمود حسن',
    lastMessage: 'ممكن تخفض السعر شوية؟',
    lastMessageTime: 'الأحد',
    unread: 1,
  },
];

export default function ChatListScreen({ lang = 'ar', onBack, onOpenChat, user }) {
  const isRTL = lang === 'ar';
  const l = LABELS[lang];
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setChats(data);
      } else {
        setChats(MOCK_CHATS);
      }
    } catch {
      setChats(MOCK_CHATS);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const renderChat = ({ item }) => (
    <TouchableOpacity
      style={[styles.chatItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      onPress={() => onOpenChat(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.otherUserName?.[0]?.toUpperCase() || '?'}
        </Text>
      </View>

      <View style={[styles.chatInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <View style={[styles.chatHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={styles.chatName}>{item.otherUserName}</Text>
          <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

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
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, color: COLORS.white, fontWeight: 'bold' },
  chatInfo: { flex: 1 },
  chatHeader: {
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  chatName: { fontSize: 15, fontWeight: 'bold', color: COLORS.navy },
  chatTime: { fontSize: 12, color: COLORS.gray },
  lastMessage: { fontSize: 13, color: COLORS.gray },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: { fontSize: 11, color: COLORS.white, fontWeight: 'bold' },
});