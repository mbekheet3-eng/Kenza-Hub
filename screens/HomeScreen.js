import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import HomeHeader from '../components/HomeHeader';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid, { MOCK_PRODUCTS } from '../components/ProductGrid';
import BottomNav from '../components/BottomNav';
import { supabase } from '../services/supabase';

export default function HomeScreen({
  lang = 'ar',
  onNavigateProduct,
  onNavigateSell,
  onNavigateProfile,
  onNavigateChats,
  user,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            category: p.category,
            condition: p.condition,
            description: p.description,
            image:
              p.image_url ||
              'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop',
            sellerName: p.seller_name,
          }))
        );
      } else {
        setProducts(MOCK_PRODUCTS);
      }
    } catch (e) {
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();

    return (
      product.title?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.sellerName?.toLowerCase().includes(query)
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

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <HomeHeader
          lang={lang}
          user={user}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        <CategoryTabs
          lang={lang}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
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
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginBottom: 6,
  },

  gridSection: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
