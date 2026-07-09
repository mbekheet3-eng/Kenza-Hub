import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid, { MOCK_PRODUCTS } from '../components/ProductGrid';
import BottomNav from '../components/BottomNav';
import { supabase } from '../services/supabase';

export default function HomeScreen({ lang = 'ar', onNavigateProduct, onNavigateSell, onNavigateProfile, onNavigateChats, user }) {
  const isRTL = lang === 'ar';
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
        setProducts(data.map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          category: p.category,
          condition: p.condition,
          description: p.description,
          image: p.image_url || 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop',
          sellerName: p.seller_name,
        })));
      } else {
        setProducts(MOCK_PRODUCTS);
      }
    } catch {
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = searchQuery === '' || p.title.includes(searchQuery);
    return matchesSearch;
  });

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'sell') onNavigateSell();
    if (tab === 'profile') onNavigateProfile();
    if (tab === 'chat') onNavigateChats();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <SearchBar
          lang={lang}
          isRTL={isRTL}
          onSearch={(query) => setSearchQuery(query)}
        />
        <CategoryTabs
          lang={lang}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <View style={styles.gridSection}>
          <ProductGrid
            products={filteredProducts}
            onProductPress={(product) => onNavigateProduct(product)}
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
    paddingTop: 14,
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