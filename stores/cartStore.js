import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cart Store - يدير السلة والـ checkout
 * 
 * State:
 * - items: مصفوفة منتجات في السلة
 * - total: الإجمالي
 * - quantity: عدد المنتجات
 * 
 * Actions:
 * - addItem: إضافة منتج
 * - removeItem: حذف منتج
 * - updateQuantity: تحديث الكمية
 * - clearCart: تفريغ السلة
 * - getTotalPrice: حساب الإجمالي
 */

export const useCartStore = create(
  immer((set, get) => ({
    items: [],
    total: 0,
    quantity: 0,

    // Add item to cart
    addItem: async (product) => {
      set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({
            ...product,
            quantity: 1,
          });
        }

        // Recalculate total
        state.quantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });

      // Persist to storage
      await get().saveToStorage();
    },

    // Remove item from cart
    removeItem: async (productId) => {
      set((state) => {
        state.items = state.items.filter((item) => item.id !== productId);

        // Recalculate
        state.quantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });

      await get().saveToStorage();
    },

    // Update quantity
    updateQuantity: async (productId, newQuantity) => {
      set((state) => {
        const item = state.items.find((item) => item.id === productId);
        if (item) {
          if (newQuantity <= 0) {
            state.items = state.items.filter((item) => item.id !== productId);
          } else {
            item.quantity = newQuantity;
          }
        }

        // Recalculate
        state.quantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });

      await get().saveToStorage();
    },

    // Clear cart
    clearCart: async () => {
      set((state) => {
        state.items = [];
        state.quantity = 0;
        state.total = 0;
      });

      await AsyncStorage.removeItem('cart');
    },

    // Get cart items
    getItems: () => get().items,

    // Get total
    getTotal: () => get().total,

    // Get quantity
    getQuantity: () => get().quantity,

    // Save to storage
    saveToStorage: async () => {
      try {
        const state = get();
        await AsyncStorage.setItem(
          'cart',
          JSON.stringify({
            items: state.items,
            total: state.total,
            quantity: state.quantity,
          })
        );
      } catch (err) {
        console.log('Error saving cart:', err);
      }
    },

    // Load from storage
    loadFromStorage: async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          const { items, total, quantity } = JSON.parse(savedCart);
          set((state) => {
            state.items = items;
            state.total = total;
            state.quantity = quantity;
          });
        }
      } catch (err) {
        console.log('Error loading cart:', err);
      }
    },
  }))
);
