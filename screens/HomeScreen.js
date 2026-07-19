import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';

import HomeHeader from '../components/common/HomeHeader';
import CategoryTabs from '../components/home/CategoryTabs';
import ProductGrid from '../components/product/ProductGrid';
import BottomNav from '../components/common/BottomNav';

import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

const EMPTY_LABELS = {
  ar: { title: 'مفيش منتجات لسه', subtitle: 'أول ما حد ينشر منتج هيظهر هنا' },
  en: { title: 'No products yet', subtitle: 'Once someone lists an item it will show up here' },
  fr: { title: 'Pas encore de produits', subtitle: 'Dès qu\'un article est publié, il apparaîtra ici' },
};

// بيحول صف المنتج (بعد الـ join مع categories و product_images) لشكل
// ProductCard / ProductGrid المتوقع
function mapProductForCard(p, lang) {
  const images = (p.product_images || [])
    .slice()
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return {
    id: p.id,
    title: lang === 'ar' ? p.title_ar : p.title_en,
    description: lang === 'ar' ? p.description_ar : p.description_en,
    price: p.price,
    currency: p.currency,
    condition: p.condition,
    size: p.size,
    color: p.color,
    brand: p.brand,
    seller_id: p.seller_id,
    category_id: p.category_id,
    image: images[0]?.image_url || null,
    raw: p,
  };
}

export default function HomeScreen({
  lang = 'ar',
  onNavigateProduct,
  onNavigateSell,
  onNavigateProfile,
  onNavigateChats,
  navigateTo,
  user,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    const categoryId = selectedCategory !== 'all' ? selectedCategory : undefined;
    const data = await getProducts({ categoryId });

    setProducts(data.map((p) => mapProductForCard(p, lang)));
    setLoading(false);
  }, [selectedCategory, lang]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();

    return (
      product.title?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  const handleTabPress = (tab) => {
    setActiveTab(tab);

    switch (tab) {
      case 'sell':
        onNavigateSell();
        break;

      case 'profile':
        onNavigateProfile();
        break;

      case 'chat':
        onNavigateChats();
        break;

      default:
        break;
    }
  };

  const emptyLabels = EMPTY_LABELS[lang] || EMPTY_LABELS.en;

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <HomeHeader
          lang={lang}
          user={user}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          navigateTo={navigateTo}
        />

        <CategoryTabs
          lang={lang}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyTitle}>{emptyLabels.title}</Text>
          <Text style={styles.emptySubtitle}>{emptyLabels.subtitle}</Text>
        </View>
      ) : (
        <View style={styles.gridSection}>
          <ProductGrid
            products={filteredProducts}
            onProductPress={onNavigateProduct}
          />
        </View>
      )}

      <BottomNav
        lang={lang}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  topSection: {
    backgroundColor: COLORS.white,
    paddingBottom: 10,
  },

  gridSection: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 6,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});
