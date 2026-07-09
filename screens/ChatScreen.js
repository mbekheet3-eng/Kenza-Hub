import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { supabase } from '../services/supabase';

const LABELS = {
  ar: { placeholder: 'اكتب رسالة...', send: 'إرسال', back: 'رجوع' },
  en: { placeholder: 'Write a message...', send: 'Send', back: 'Back' },
  fr: { placeholder: 'Écrire un message...', send: 'Envoyer', back: 'Retour' },
};

const MOCK_MESSAGES = [
  { id: '1', text: 'هل المنتج لسه متاح؟', sender_id: 'other', created_at: '2026-07-01T10:00:00' },
  { id: '2', text: 'أيوه متاح، عايز تعرف أكتر؟', sender_id: 'me', created_at: '2026-07-01T10:05:00' },
  { id: '3', text: 'إيه حالته بالظبط؟', sender_id: 'other', created_at: '2026-07-01T10:06:00' },
  { id: '4', text: 'حالته ممتازة، لبسته مرتين بس', sender_id: 'me', created_at: '2026-07-01T10:10:00' },
];

// هنتحقق لو الـ chat id ده UUID حقيقي من Supabase أم لا
const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export default function ChatScreen({ lang = 'ar', onBack, chat, user }) {
  const isRTL = lang === 'ar';
  const l = LABELS[lang];
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  // هل الشات ده حقيقي من Supabase؟
  const isRealChat = chat?.id && isUUID(chat.id);

  const fetchMessages = useCallback(async () => {
    if (!isRealChat) {
      setMessages(MOCK_MESSAGES);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data && data.length > 0 ? data : MOCK_MESSAGES);
    } catch {
      setMessages(MOCK_MESSAGES);
    } finally {
      setLoading(false);
    }
  }, [chat, isRealChat]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!isRealChat) return;

    const subscription = supabase
      .channel(`chat_${chat.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chat.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [chat, isRealChat]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // لو مش شات حقيقي، نعمل mock send
    if (!isRealChat) {
      const mockMsg = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender_id: 'me',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, mockMsg]);
      setNewMessage('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        chat_id: chat.id,
        sender_id: user.id,
        text: newMessage.trim(),
      });
      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.log('Send error:', error.message);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === user?.id || item.sender_id === 'me';
    return (
      <View style={[
        styles.messageBubble,
        isMe ? styles.myMessage : styles.otherMessage,
        { alignSelf: isMe ? (isRTL ? 'flex-start' : 'flex-end') : (isRTL ? 'flex-end' : 'flex-start') }
      ]}>
        <Text style={[styles.messageText, isMe && styles.myMessageText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {chat?.otherUserName?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.headerName}>{chat?.otherUserName || 'محادثة'}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <View style={[styles.inputRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder={l.placeholder}
          placeholderTextColor={COLORS.gray}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { opacity: newMessage.trim() ? 1 : 0.5 }]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.sendIcon}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 16, color: COLORS.white, fontWeight: 'bold' },
  headerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.navy },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messagesList: { padding: 16, paddingBottom: 8 },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  otherMessage: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, color: COLORS.navy, lineHeight: 22 },
  myMessageText: { color: COLORS.white },
  inputRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.navy,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { fontSize: 18, color: COLORS.white },
});