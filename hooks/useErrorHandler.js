import { useUIStore } from '../stores/uiStore';

/**
 * Custom hook للـ error handling
 * يقوم بمعالجة الأخطاء وعرضها للمستخدم
 */
export const useErrorHandler = () => {
  const { showToast } = useUIStore();

  const handleError = (error, userMessage) => {
    console.error('Error:', error);

    let message = userMessage || 'حدث خطأ ما، يرجى المحاولة لاحقاً';

    // Handle different error types
    if (error.message) {
      if (error.message.includes('Network')) {
        message = 'لا يوجد اتصال إنترنت';
      } else if (error.message.includes('auth')) {
        message = 'خطأ في المصادقة، يرجى تسجيل الدخول مرة أخرى';
      } else if (error.message.includes('timeout')) {
        message = 'انتهت مهلة الاتصال، يرجى المحاولة لاحقاً';
      }
    }

    showToast(message, 'error', 4000);

    return message;
  };

  const handleSuccess = (message = 'تم بنجاح') => {
    showToast(message, 'success', 3000);
  };

  const handleWarning = (message = 'تنبيه') => {
    showToast(message, 'warning', 3000);
  };

  return {
    handleError,
    handleSuccess,
    handleWarning,
  };
};
