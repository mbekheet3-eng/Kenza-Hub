import { supabase } from './supabase';

/**
 * جلب كل التصنيفات النشطة من جدول categories الحقيقي
 * (بديل عن القائمة المكتوبة يدويًا اللي كانت في CategoryTabs)
 */
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name_en, name_ar, slug, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log('getCategories error:', error.message);
    return [];
  }
}
