import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../services/supabase';

/**
 * Products Store - يدير المنتجات والـ search
 * 
 * State:
 * - products: مصفوفة المنتجات
 * - favorites: المنتجات المفضلة
 * - selectedProduct: المنتج المختار
 * - isLoading: جاري التحميل
 * - error: رسالة الخطأ
 * 
 * Actions:
 * - fetchProducts: جلب المنتجات
 * - fetchProductDetails: جلب تفاصيل المنتج
 * - addToFavorites: إضافة للمفضلة
 * - removeFromFavorites: حذف من المفضلة
 * - searchProducts: البحث
 * - filterProducts: الترشيح
 */

export const useProductsStore = create(
  immer((set, get) => ({
    products: [],
    favorites: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
    searchQuery: '',
    filters: {
      categoryId: null,
      minPrice: 0,
      maxPrice: 10000,
      condition: null,
    },

    // Fetch products
    fetchProducts: async (filters = {}) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        let query = supabase.from('products').select(`
          *,
          product_images (id, image_url),
          categories (id, name_en, name_ar),
          seller_profiles (id, display_name, rating)
        `);

        // Apply filters
        if (filters.categoryId) {
          query = query.eq('category_id', filters.categoryId);
        }

        if (filters.condition) {
          query = query.eq('condition_id', filters.condition);
        }

        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice);
        }

        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }

        // Search
        if (filters.searchQuery) {
          query = query.or(
            `title_en.ilike.%${filters.searchQuery}%,title_ar.ilike.%${filters.searchQuery}%`
          );
        }

        const { data, error } = await query;

        if (error) throw error;

        set((state) => {
          state.products = data || [];
          state.isLoading = false;
        });

        return { success: true, data };
      } catch (err) {
        set((state) => {
          state.error = err.message;
          state.isLoading = false;
        });
        return { success: false, error: err.message };
      }
    },

    // Fetch single product details
    fetchProductDetails: async (productId) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (id, image_url, display_order),
            categories (id, name_en, name_ar),
            seller_profiles (id, display_name, rating, total_sales),
            product_conditions (id, label_en, label_ar),
            product_colors (id, label_en, label_ar),
            product_sizes (id, label_en, label_ar)
          `)
          .eq('id', productId)
          .single();

        if (error) throw error;

        set((state) => {
          state.selectedProduct = data;
          state.isLoading = false;
        });

        return { success: true, data };
      } catch (err) {
        set((state) => {
          state.error = err.message;
          state.isLoading = false;
        });
        return { success: false, error: err.message };
      }
    },

    // Add to favorites
    addToFavorites: async (productId, userId) => {
      try {
        const { error } = await supabase.from('favorites').insert({
          product_id: productId,
          user_id: userId,
        });

        if (error) throw error;

        set((state) => {
          if (!state.favorites.includes(productId)) {
            state.favorites.push(productId);
          }
        });

        return { success: true };
      } catch (err) {
        set((state) => {
          state.error = err.message;
        });
        return { success: false, error: err.message };
      }
    },

    // Remove from favorites
    removeFromFavorites: async (productId, userId) => {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', userId);

        if (error) throw error;

        set((state) => {
          state.favorites = state.favorites.filter((id) => id !== productId);
        });

        return { success: true };
      } catch (err) {
        set((state) => {
          state.error = err.message;
        });
        return { success: false, error: err.message };
      }
    },

    // Check if product is favorite
    isFavorite: (productId) => {
      return get().favorites.includes(productId);
    },

    // Search products
    searchProducts: async (query) => {
      set((state) => {
        state.searchQuery = query;
      });

      if (query.trim() === '') {
        set((state) => {
          state.products = [];
        });
        return;
      }

      await get().fetchProducts({ ...get().filters, searchQuery: query });
    },

    // Filter products
    setFilters: async (newFilters) => {
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
      });

      await get().fetchProducts(get().filters);
    },

    // Clear error
    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    // Clear selected product
    clearSelectedProduct: () => {
      set((state) => {
        state.selectedProduct = null;
      });
    },
  }))
);
