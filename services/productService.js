import { supabase } from './supabase';

/**
 * جلب كل المنتجات
 */
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

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