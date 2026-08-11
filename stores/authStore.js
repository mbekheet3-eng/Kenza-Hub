import { create } from 'zustand';
import { supabase } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { immer } from 'zustand/middleware/immer';

/**
 * Auth Store - يدير حالة المستخدم والـ authentication
 * 
 * State:
 * - user: الـ user الحالي
 * - isLoading: جاري login
 * - error: رسالة الخطأ
 * - isAuthenticated: هل المستخدم logged in
 * 
 * Actions:
 * - signUp: إنشاء حساب جديد
 * - signIn: دخول
 * - signOut: خروج
 * - setUser: تعيين المستخدم
 * - clearError: حذف الخطأ
 */

export const useAuthStore = create(
  immer((set, get) => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,

    // Sign up
    signUp: async (email, password, firstName, lastName) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });

        if (error) throw error;

        set((state) => {
          state.user = data.user;
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        // Save to AsyncStorage
        await AsyncStorage.setItem('authUser', JSON.stringify(data.user));

        return { success: true };
      } catch (err) {
        set((state) => {
          state.error = err.message;
          state.isLoading = false;
          state.isAuthenticated = false;
        });
        return { success: false, error: err.message };
      }
    },

    // Sign in
    signIn: async (email, password) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        set((state) => {
          state.user = data.user;
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        // Save to AsyncStorage
        await AsyncStorage.setItem('authUser', JSON.stringify(data.user));

        return { success: true };
      } catch (err) {
        set((state) => {
          state.error = err.message;
          state.isLoading = false;
          state.isAuthenticated = false;
        });
        return { success: false, error: err.message };
      }
    },

    // Sign out
    signOut: async () => {
      set((state) => {
        state.isLoading = true;
      });

      try {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem('authUser');

        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
          state.isLoading = false;
        });

        return { success: true };
      } catch (err) {
        set((state) => {
          state.error = err.message;
          state.isLoading = false;
        });
        return { success: false, error: err.message };
      }
    },

    // Set user
    setUser: (user) => {
      set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
      });
    },

    // Check if user is logged in (on app start)
    checkAuthStatus: async () => {
      try {
        const savedUser = await AsyncStorage.getItem('authUser');
        if (savedUser) {
          set((state) => {
            state.user = JSON.parse(savedUser);
            state.isAuthenticated = true;
          });
        }
      } catch (err) {
        console.log('Error checking auth status:', err);
      }
    },

    // Clear error
    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);
