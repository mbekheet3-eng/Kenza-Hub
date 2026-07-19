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

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`
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
export async function getUserProducts(userId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log('getUserProducts error:', error.message);
    return [];
  }
}