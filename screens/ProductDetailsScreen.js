import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { createOrder } from '../services/orders';
import { getOrCreateChat } from '../services/chat';

const { width } = Dimensions.get('window');

const CONDITION_LABELS = {
  ar: { new: 'جديد', excellent: 'ممتاز', good: 'كويس', fair: 'مقبول' },
  en: { new: 'New', excellent: 'Excellent', good: 'Good', fair: 'Fair' },
  fr: { new: 'Neuf', excellent: 'Excellent', good: 'Bon', fair: 'Acceptable' },
};

const LABELS = {
  ar: {
    buy: 'اشتري دلوقتي',
    contact: 'تواصل مع البائع',
    condition: 'الحالة',
    description: 'الوصف',
    seller: 'البائع',
    back: 'رجوع',
    currency: 'ج.م',
    loginRequired: 'سجل دخولك عشان تشتري',
    cantBuyOwn: 'مش تقدر تشتري منتجك انت',
    orderSuccess: 'تم الطلب بنجاح',
    orderSuccessMsg: 'هيتواصل معاك البائع قريبًا',
    noDescription: 'لا يوجد وصف متاح.',
  },
  en: {
    buy: 'Buy Now',
    contact: 'Contact Seller',
    condition: 'Condition',
    description: 'Description',
    seller: 'Seller',
    back: 'Back',
    currency: 'EGP',
    loginRequired: 'Log in to buy',
    cantBuyOwn: "You can't buy your own product",
    orderSuccess: 'Order placed successfully',
    orderSuccessMsg: 'The seller will contact you soon',
    noDescription: 'No description available.',
  },
  fr: {
    buy: 'Acheter maintenant',
    contact: 'Contacter le vendeur',
    condition: 'État',
    description: 'Description',
    seller: 'Vendeur',
    back: 'Retour',
    currency: 'EGP',
    loginRequired: 'Connectez-vous pour acheter',
    cantBuyOwn: 'Vous ne pouvez pas acheter votre propre produit',
    orderSuccess: 'Commande passée avec succès',
    orderSuccessMsg: 'Le vendeur vous contactera bientôt',
    noDescription: 'Aucune description disponible.',
  },
};

export default function ProductDetailsScreen({ product, lang = 'ar', onBack, user, onBuy, onChat }) {
  const isRTL = lang === 'ar';
  const l = LABELS[lang];
  const conditions = CONDITION_LABELS[lang];
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleBuy = async () => {
    if (!user) {
      Alert.alert('', l.loginRequired);
      return;
    }

    setLoading(true);
    try {
      await createOrder(product, user);
      Alert.alert(l.orderSuccess, l.orderSuccessMsg, [
        { text: 'OK', onPress: () => onBuy(product) }
      ]);
    } catch (error) {
      Alert.alert('خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!user) {
      Alert.alert('', l.loginRequired);
      return;
    }
    try {
      const chat = await getOrCreateChat(user.id, product.seller_id, product.id);
      onChat({
        id: chat.id,
        title: product.title,
        image: product.image,
      });
    } catch (error) {
      Alert.alert('خطأ', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backIcon}>{isRTL ? '→' : '←'}</Text>
        <Text style={styles.backText}>{l.back}</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.detailsContainer}>
          <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productPrice}>{product.price} {l.currency}</Text>
          </View>

          <View style={[styles.conditionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
              {l.condition}:
            </Text>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>
                {conditions[product.condition || 'good']}
              </Text>
            </View>
          </View>

          <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
            {l.description}
          </Text>
          <Text style={[styles.description, { textAlign: isRTL ? 'right' : 'left' }]}>
            {product.description || l.noDescription}
          </Text>

          <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left', marginTop: 16 }]}>
            {l.seller}
          </Text>
          <View style={[styles.sellerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {(product.sellerName || 'K')[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.sellerName}>
              {product.sellerName || 'كنزة مستخدم'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={handleContact}
        >
          <Text style={styles.contactBtnText}>{l.contact}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buyBtn, { opacity: loading ? 0.7 : 1 }]}
          onPress={handleBuy}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buyBtnText}>{l.buy}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  backIcon: { fontSize: 20, color: COLORS.navy },
  backText: { fontSize: 15, color: COLORS.navy, fontWeight: '500' },

  productImage: {
    width: width,
    height: width * 1.1,
    backgroundColor: COLORS.lightGray,
  },

  detailsContainer: { padding: 16 },

  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.navy,
    flex: 1,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginHorizontal: 8,
  },

  conditionRow: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  conditionBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  conditionText: {
    fontSize: 13,
    color: COLORS.navy,
    fontWeight: '500',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
    marginBottom: 8,
  },

  sellerRow: {
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  sellerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sellerName: {
    fontSize: 15,
    color: COLORS.navy,
    fontWeight: '500',
  },

  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  contactBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  contactBtnText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '600',
  },
  buyBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buyBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});