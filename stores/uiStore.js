import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * UI Store - يدير حالة الـ UI والـ notifications
 * 
 * State:
 * - toasts: رسائل الـ toast
 * - globalLoading: جاري تحميل عام
 * - modalStack: stack من الـ modals المفتوحة
 * - selectedLanguage: اللغة المختارة
 * 
 * Actions:
 * - showToast: عرض رسالة
 * - hideToast: إخفاء رسالة
 * - openModal: فتح modal
 * - closeModal: إغلاق modal
 * - setLanguage: تغيير اللغة
 */

export const useUIStore = create(
  immer((set, get) => ({
    toasts: [],
    globalLoading: false,
    modalStack: [],
    selectedLanguage: 'ar',

    // Show toast notification
    showToast: (message, type = 'info', duration = 3000) => {
      const id = Date.now().toString();

      set((state) => {
        state.toasts.push({
          id,
          message,
          type, // 'success', 'error', 'warning', 'info'
        });
      });

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          get().hideToast(id);
        }, duration);
      }

      return id;
    },

    // Hide toast notification
    hideToast: (id) => {
      set((state) => {
        state.toasts = state.toasts.filter((toast) => toast.id !== id);
      });
    },

    // Hide all toasts
    clearAllToasts: () => {
      set((state) => {
        state.toasts = [];
      });
    },

    // Open modal
    openModal: (modalName, data = {}) => {
      set((state) => {
        state.modalStack.push({
          name: modalName,
          data,
        });
      });
    },

    // Close modal
    closeModal: () => {
      set((state) => {
        if (state.modalStack.length > 0) {
          state.modalStack.pop();
        }
      });
    },

    // Close specific modal
    closeModalByName: (modalName) => {
      set((state) => {
        state.modalStack = state.modalStack.filter((m) => m.name !== modalName);
      });
    },

    // Get active modal
    getActiveModal: () => {
      const stack = get().modalStack;
      return stack.length > 0 ? stack[stack.length - 1] : null;
    },

    // Set global loading
    setGlobalLoading: (isLoading) => {
      set((state) => {
        state.globalLoading = isLoading;
      });
    },

    // Set language
    setLanguage: (language) => {
      set((state) => {
        state.selectedLanguage = language;
      });
    },

    // Get language
    getLanguage: () => get().selectedLanguage,

    // Is RTL
    isRTL: () => get().selectedLanguage === 'ar',
  }))
);
