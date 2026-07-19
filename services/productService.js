import { supabase } from './supabase';

/**
 * جلب المنتجات (مع الصور والتصنيف) - قابلة للفلترة بتصنيف معين
 */
export async function getProducts({ categoryId } = {}) {
  try {
    let query = supabase
      .from('products')
      .select(
        `
        id, seller_id, category_id, title_en, title_ar,
        description_en, description_ar, price, currency,
        condition, status, size, color, brand, created_at,
        categories ( id, name_en, name_ar, slug ),
        product_images ( image_url, display_order )
      `
      )
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log('getProducts error:', error.message);
    return [];
  }
}


/**
 * البحث عن المنتجات
 */
export async function searchProducts(query) {
  try {
    if (!query || query.trim() === '') {
      return getProducts();
    }

    const q = query.trim();

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id, seller_id, category_id, title_en, title_ar,
        description_en, description_ar, price, currency,
        condition, status, size, color, brand, created_at,
        categories ( id, name_en, name_ar, slug ),
        product_images ( image_url, display_order )
      `
      )
      .eq('status', 'active')
      .or(
        `title_en.ilike.%${q}%,title_ar.ilike.%${q}%,description_en.ilike.%${q}%,description_ar.ilike.%${q}%,brand.ilike.%${q}%`
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log('searchProducts error:', error.message);
    return [];
  }
}


/**
 * جلب منتج واحد بالتعريف
 */
export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log('getProductById error:', error.message);
    return null;
  }
}


/**
 * إضافة منتج جديد
 */
export async function addProduct(product) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log('addProduct error:', error.message);
    return null;
  }
}


/**
 * تعديل منتج
 */
export async function updateProduct(id, updates) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log('updateProduct error:', error.message);
    return null;
  }
}


/**
 * حذف منتج
 */
export async function deleteProduct(id) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.log('deleteProduct error:', error.message);
    return false;
  }
}


/**
 * حفظ روابط الصور في جدول product_images بعد إنشاء المنتج
 * (الصور مش عمود في products — جدول منفصل)
 */
export async function addProductImages(productId, imageUrls = []) {
  if (!productId || imageUrls.length === 0) return [];

  const rows = imageUrls.map((url, index) => ({
    product_id: productId,
    image_url: url,
    display_order: index,
  }));

  const { data, error } = await supabase
    .from('product_images')
    .insert(rows)
    .select();

  if (error) throw error;

  return data || [];
}

/**
 * جلب منتجات مستخدم معين
 */
/**
 * جلب منتجات المستخدم الحالي (كبائع)
 * نفس منطق getSellerOrders بالظبط: لازم نعمل Resolve لـ seller_profile_id
 * بتاعه عن طريق seller_profile_members الأول، لأن products.seller_id
 * بيشاور على seller_profiles.id مش على users.id مباشرة.
 */
export async function getUserProducts(userId) {
  try {
    const { data: membership, error: membershipError } = await supabase
      .from('seller_profile_members')
      .select('seller_profile_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (membershipError) throw membershipError;

    // المستخدم لسه معندوش seller_profile خالص -> يبقى أكيد مفيش منتجات ليه
    if (!membership?.seller_profile_id) {
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id, seller_id, category_id, title_en, title_ar,
        description_en, description_ar, price, currency,
        condition, status, size, color, brand, created_at,
        categories ( id, name_en, name_ar, slug ),
        product_images ( image_url, display_order )
      `
      )
      .eq('seller_id', membership.seller_profile_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log('getUserProducts error:', error.message);
    return [];
  }
}