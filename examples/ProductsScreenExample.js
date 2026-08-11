import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useProductsStore } from '../stores/productsStore';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { useErrorHandler } from '../hooks/useErrorHandler';

/**
 * Example: كيفية استخدام Zustand stores في الـ screens
 * هذا مثال لشاشة المنتجات
 */

export default function ProductsScreenExample({ navigation }) {
  // استخدام الـ stores
  const { products, isLoading, error, fetchProducts } = useProductsStore();
  const { addItem } = useCartStore();
  const { showToast } = useUIStore();
  const { handleError, handleSuccess } = useErrorHandler();

  // جلب المنتجات عند فتح الشاشة
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await fetchProducts();

    if (!result.success) {
      handleError(new Error(result.error));
    }
  };

  // عند إضافة للسلة
  const handleAddToCart = async (product) => {
    try {
      await addItem(product);
      handleSuccess('تمت إضافة المنتج للسلة');
    } catch (err) {
      handleError(err, 'فشل إضافة المنتج');
    }
  };

  // عند الضغط على المنتج
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  // Render loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>جاري التحميل...</Text>
      </View>
    );
  }

  // Render error
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={loadProducts}
        >
          <Text style={styles.retryBtnText}>إعادة محاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render products list
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item)}
          >
            <View style={styles.imageContainer}>
              {item.product_images && item.product_images[0] && (
                <Image
                  source={{ uri: item.product_images[0].image_url }}
                  style={styles.image}
                />
              )}
            </View>

            <View style={styles.info}>
              <Text numberOfLines={2} style={styles.title}>
                {item.title_ar}
              </Text>

              <Text style={styles.price}>{item.price} EGP</Text>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.addBtnText}>أضف للسلة</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  productCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
