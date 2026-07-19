import { supabase } from './supabase';

/**
 * يرجع شات موجود لنفس (buyer_id, seller_profile_id, product_id)
 * لو موجود، وإلا بينشئ واحد جديد.
 * ملحوظة: مفيش Unique Constraint على الثلاثة أعمدة دول في الداتابيز،
 * فده Best-effort (بيدور الأول قبل ما ينشئ) مش حماية كاملة من Race
 * Condition لو حصل طلبين في نفس اللحظة بالظبط.
 */
export const getOrCreateChat = async (buyerId, sellerProfileId, productId) => {
  const { data: existing, error: findError } = await supabase
    .from('chats')
    .select('id, product_id, buyer_id, seller_id, last_message_at, created_at')
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerProfileId)
    .eq('product_id', productId)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from('chats')
    .insert({
      buyer_id: buyerId,
      seller_id: sellerProfileId,
      product_id: productId,
    })
    .select('id, product_id, buyer_id, seller_id, last_message_at, created_at')
    .single();

  if (createError) throw createError;
  return created;
};

/**
 * كل شاتات المستخدم (كمشتري + كبائع لو عنده seller_profile)
 * مع بيانات المنتج وأول صورة له، مرتبة بالأحدث.
 */
export const getChats = async (userId) => {
  const { data: membership } = await supabase
    .from('seller_profile_members')
    .select('seller_profile_id')
    .eq('user_id', userId)
    .maybeSingle();

  const sellerProfileId = membership?.seller_profile_id;

  let query = supabase
    .from('chats')
    .select(
      `
      id, product_id, buyer_id, seller_id, last_message_at, created_at,
      products (
        title_en, title_ar,
        product_images ( image_url, display_order )
      )
    `
    )
    .order('last_message_at', { ascending: false, nullsFirst: false });

  query = sellerProfileId
    ? query.or(`buyer_id.eq.${userId},seller_id.eq.${sellerProfileId}`)
    : query.eq('buyer_id', userId);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * رسايل شات معين، من الأقدم للأحدث
 */
export const getMessages = async (chatId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('id, chat_id, sender_id, content, is_read, read_at, created_at')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * إرسال رسالة
 */
export const sendMessage = async (chatId, senderId, content) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({ chat_id: chatId, sender_id: senderId, content })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * الاشتراك اللحظي في رسايل شات معين (Realtime)
 * بيرجع دالة unsubscribe.
 */
export const subscribeToMessages = (chatId, onNewMessage) => {
  const channel = supabase
    .channel(`chat_${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => onNewMessage(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};
