import { supabase } from './supabase';

/**
 * يرجّع seller_profile_id بتاع المستخدم الحالي.
 * لو المستخدم مفيش عنده seller_profile لسه، بينشئ واحد جديد تلقائيًا
 * عن طريق فانكشن seller-profile-create (Frozen — بدون أي تعديل عليها).
 */
export const getOrCreateSellerProfileId = async (user) => {
  if (!user?.id) {
    throw new Error('لازم تسجل دخول الأول.');
  }

  // 1) هل عنده seller_profile موجود بالفعل؟
  const { data: membership, error: membershipError } = await supabase
    .from('seller_profile_members')
    .select('seller_profile_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (membershipError) throw membershipError;

  if (membership?.seller_profile_id) {
    return membership.seller_profile_id;
  }

  // 2) مفيش — ننشئ واحد جديد عن طريق seller-profile-create
  const displayName =
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'Kenza Seller';

  const { data, error } = await supabase.functions.invoke('seller-profile-create', {
    body: {
      seller_type: 'seller',
      display_name: displayName,
    },
  });

  if (error) {
    // رسالة الخطأ الفعلية من الفانكشن (لو موجودة) أوضح من رسالة الشبكة العامة
    const message = error.context?.error || error.message || 'تعذر إنشاء ملف البائع.';
    throw new Error(message);
  }

  if (!data?.seller_profile_id) {
    throw new Error('تعذر إنشاء ملف البائع.');
  }

  return data.seller_profile_id;
};
