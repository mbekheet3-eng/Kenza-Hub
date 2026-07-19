import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getBuyerOrders, getSellerOrders } from '../services/orders';

const LABELS = {
  ar: {
    title: 'طلباتي',
    back: 'رجوع',
    asbuyer: 'كمشتري',
    asseller: 'كبائع',
    noOrders: 'مفيش طلبات لسه',
    noOrdersMsg: 'لما تشتري أو تبيع حاجة هتظهر هنا',
    currency: 'ج.م',
    status: {
      pending: 'في الانتظار',
      collected: 'تم التحصيل',
      delivered: 'تم التسليم',
      completed: 'مكتمل',
      cancelled: 'ملغي',
    },
  },
  en: {
    title: 'My Orders',
    back: 'Back',
    asbuyer: 'As Buyer',
    asseller: 'As Seller',
    noOrders: 'No orders yet',
    noOrdersMsg: 'When you buy or sell something it will appear here',
    currency: 'EGP',
    status: {
      pending: 'Pending',
      collected: 'Collected',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
  },
  fr: {
    title: 'Mes commandes',
    back: 'Retour',
    asbuyer: 'En tant qu\'acheteur',
    asseller: 'En tant que vendeur',
    noOrders: 'Pas encore de commandes',
    noOrdersMsg: 'Quand vous achetez ou vendez quelque chose, cela apparaîtra ici',
    currency: 'EGP',
    status: {
      pending: 'En attente',
      collected: 'Collecté',
      delivered: 'Livré',
      completed: 'Terminé',
      cancelled: 'Annulé',
    },
  },
};

const STATUS_COLORS = {
  pending: '#F59E0B',
  collected: '#3B82F6',
  delivered: '#8B5CF6',
  completed: '#10B981',
  cancelled: '#EF4444',
};

export default function OrdersScreen({ lang = 'ar', onBack, user }) {
  const isRTL = lang === 'ar';
  const l = LABELS[lang];
  const [activeTab, setActiveTab] = useState('buyer');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = activeTab === 'buyer'
        ? await getBuyerOrders(user.id)
        : await getSellerOrders(user.id);

      setOrders(data || []);
    } catch (error) {
      console.log('fetchOrders error:', error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const renderOrder = ({ item }) => {
    const title = lang === 'ar' ? item.products?.title_ar : item.products?.title_en;
    const images = (item.products?.product_images || [])
      .slice()
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    const image =
      images[0]?.image_url ||
      'https://placehold.co/160x160/F5F5F5/999999?text=Kenza';

    return (
      <View style={styles.orderCard}>
        <Image source={{ uri: image }} style={styles.orderImage} />
        <View style={styles.orderInfo}>
          <Text style={[styles.orderTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {title}
          </Text>
          <Text style={[styles.orderPrice, { textAlign: isRTL ? 'right' : 'left' }]}>
            {item.total_amount} {item.currency || l.currency}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: (STATUS_COLORS[item.status] || COLORS.gray) + '20',
              alignSelf: isRTL ? 'flex-end' : 'flex-start' }
          ]}>
            <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || COLORS.gray }]}>
              {l.status[item.status] || item.status}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{l.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* تبويبات مشتري/بائع */}
      <View style={[styles.tabs, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'buyer' && styles.tabActive]}
          onPress={() => setActiveTab('buyer')}
        >
          <Text style={[styles.tabText, activeTab === 'buyer' && styles.tabTextActive]}>
            {l.asbuyer}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'seller' && styles.tabActive]}
          onPress={() => setActiveTab('seller')}
        >
          <Text style={[styles.tabText, activeTab === 'seller' && styles.tabTextActive]}>
            {l.asseller}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>{l.noOrders}</Text>
          <Text style={styles.emptySubText}>{l.noOrdersMsg}</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 22, color: COLORS.navy },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.navy },

  tabs: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  tabTextActive: {
    color: COLORS.primary,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navy,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },

  list: { padding: 16 },

  orderCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 12,
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  orderInfo: { flex: 1, justifyContent: 'space-between' },
  orderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 4,
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  orderPerson: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});