import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

const BANNERS = [
  {
    title: 'أكبر تشكيلة من البراندات الأصلية',
    subtitle: 'اكتشف عروضًا جديدة كل يوم بأسعار لا تُفوّت',
    color: '#6C63FF',
  },
  {
    title: 'بيع ملابسك بسهولة',
    subtitle: 'صوّر المنتج وارفعه في أقل من دقيقة',
    color: '#FF7A00',
  },
  {
    title: 'ابحث بالصورة',
    subtitle: 'اعثر على منتجات مشابهة باستخدام الكاميرا',
    color: '#00A884',
  },
];

export default function HomeBanner() {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (index + 1) % BANNERS.length;
      scrollRef.current?.scrollTo({
        x: next * (width - 36),
        animated: true,
      });
      setIndex(next);
    }, 3500);

    return () => clearInterval(timer);
  }, [index]);

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {BANNERS.map((item, i) => (
          <View
            key={i}
            style={[
              styles.banner,
              { backgroundColor: item.color },
            ]}
          >
            <Text style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.subtitle}>
              {item.subtitle}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: width - 36,
    height: 165,
    borderRadius: 22,
    marginHorizontal: 18,
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.95,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },

  activeDot: {
    width: 22,
    backgroundColor: COLORS.primary,
  },
});