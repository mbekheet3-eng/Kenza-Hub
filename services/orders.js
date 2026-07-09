import { supabase } from './supabase';

// إنشاء طلب جديد
export const createOrder = async (product, buyer) => {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      product_id: product.id,
      buyer_id: buyer.id,
      seller_id: product.seller_id,
      price: product.price,
      status: 'pending',
      buyer_name: buyer.user_metadata?.full_name || buyer.email,
      seller_name: product.sellerName,
      product_title: product.title,
      product_image: product.image,
    })
    .select()
    .single();

  if (error) throw error;
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