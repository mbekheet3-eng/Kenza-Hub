import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useUIStore } from '../stores/uiStore';

/**
 * Toast Notification Component
 * يعرض الإشعارات في أعلى الشاشة
 */

export default function Toast() {
  const { toasts } = useUIStore();

  if (toasts.length === 0) {
    return null;
  }

  // عرض أول toast فقط
  const toast = toasts[0];

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return '#10B981'; // أخضر
      case 'error':
        return '#EF4444'; // أحمر
      case 'warning':
        return '#F59E0B'; // أصفر
      default:
        return '#3B82F6'; // أزرق
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={styles.message}>{toast.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 50,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  icon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 12,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
    fontWeight: '500',
  },
});
