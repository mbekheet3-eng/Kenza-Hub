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
    .select('*')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// جلب طلبات البائع
export const getSellerOrders = async (sellerId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('seller_id', sellerId)
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