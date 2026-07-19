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
import { getMessages, sendMessage, subscribeToMessages } from '../services/chat';

const LABELS = {
  ar: { placeholder: 'اكتب رسالة...', send: 'إرسال', back: 'رجوع' },
  en: { placeholder: 'Write a message...', send: 'Send', back: 'Back' },
  fr: { placeholder: 'Écrire un message...', send: 'Envoyer', back: 'Retour' },
};

export default function ChatScreen({ lang = 'ar', onBack, chat, user }) {
  const isRTL = lang === 'ar';
  const l = LABELS[lang];
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!chat?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getMessages(chat.id);
      setMessages(data);
    } catch (error) {
      console.log('fetchMessages error:', error.message);
    } finally {
      setLoading(false);
    }
  }, [chat]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!chat?.id) return;

    const unsubscribe = subscribeToMessages(chat.id, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return unsubscribe;
  }, [chat]);

  const handleSend = async () => {
    if (!newMessage.trim() || !chat?.id || !user) return;

    setSending(true);
    try {
      await sendMessage(chat.id, user.id, newMessage.trim());
      setNewMessage('');
      // الرسالة هتتضاف للقايمة أوتوماتيك عن طريق الاشتراك اللحظي فوق
    } catch (error) {
      console.log('sendMessage error:', error.message);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === user?.id;
    return (
      <View style={[
        styles.messageBubble,
        isMe ? styles.myMessage : styles.otherMessage,
        { alignSelf: isMe ? (isRTL ? 'flex-start' : 'flex-end') : (isRTL ? 'flex-end' : 'flex-start') }
      ]}>
        <Text style={[styles.messageText, isMe && styles.myMessageText]}>
          {item.content}
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
        <Text style={styles.headerName} numberOfLines={1}>
          {chat?.title || 'محادثة'}
        </Text>
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
          onPress={handleSend}
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
  headerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.navy, flex: 1, textAlign: 'center' },
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
