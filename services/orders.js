import { supabase } from './supabase';

// إنشاء طلب جديد — عن طريق order-create Edge Function (Frozen) بدل INSERT مباشر
export const createOrder = async (product, buyer) => {
  // shipping_address مؤقت للـ Beta: مبني من city/country بتاعة المستخدم
  const { data: profile } = await supabase
    .from('users')
    .select('city, country')
    .eq('id', buyer.id)
    .maybeSingle();

  const addressParts = [profile?.city, profile?.country].filter(Boolean);
  const shipping_address =
    addressParts.length > 0
      ? addressParts.join(', ')
      : 'Address will be confirmed with the buyer';

  const { data, error } = await supabase.functions.invoke('order-create', {
    body: {
      product_id: product.id,
      shipping_address,
    },
  });

  if (error) {
    const message = error.context?.error || error.message || 'Order creation failed';
    throw new Error(message);
  }

  return data;
};

// جلب طلبات المشتري
export const getBuyerOrders = async (buyerId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id, status, total_amount, currency, created_at,
      products (
        title_en, title_ar,
        product_images ( image_url, display_order )
      )
    `
    )
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// جلب طلبات البائع
// ملحوظة: order-create Edge Function بيسيب عمود orders.seller_user_id فاضي
// (NULL) دايمًا، وبيحط seller_profile_id بس. فلازم نعمل Resolve لـ
// seller_profile_id بتاع المستخدم عن طريق seller_profile_members الأول،
// وبعدين نفلتر orders بيه.
export const getSellerOrders = async (userId) => {
  const { data: membership, error: membershipError } = await supabase
    .from('seller_profile_members')
    .select('seller_profile_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (membershipError) throw membershipError;

  // المستخدم لسه معندوش seller_profile خالص -> يبقى أكيد مفيش طلبات كبائع
  if (!membership?.seller_profile_id) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id, status, total_amount, currency, created_at,
      products (
        title_en, title_ar,
        product_images ( image_url, display_order )
      )
    `
    )
    .eq('seller_profile_id', membership.seller_profile_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};