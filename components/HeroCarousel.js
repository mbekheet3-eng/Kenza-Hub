import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1595995477361-41d9a34e7a38?w=200&h=280&fit=crop',
];

const IMAGE_WIDTH = 148;
const SCROLL_WIDTH = PRODUCT_IMAGES.length * IMAGE_WIDTH;

// كومبوننت صغير بيحاول يحمّل الصورة تاني تلقائي لو فشلت
function RetryImage({ uri, style }) {
  const [attempt, setAttempt] = useState(0);
  const maxRetries = 3;

  return (
    <Image
      key={attempt}
      source={{ uri: `${uri}&retry=${attempt}` }}
      style={style}
      onError={() => {
        if (attempt < maxRetries) {
          setTimeout(() => setAttempt((a) => a + 1), 800);
        }
      }}
    />
  );
}

export default function HeroCarousel() {
  const scrollAnim1 = useRef(new Animated.Value(0)).current;
  const scrollAnim2 = useRef(new Animated.Value(-SCROLL_WIDTH)).current;

  useEffect(() => {
    const animate = () => {
      scrollAnim1.setValue(0);
      Animated.timing(scrollAnim1, {
        toValue: -SCROLL_WIDTH,
        duration: 30000,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, [scrollAnim1]);

  useEffect(() => {
    const animate = () => {
      scrollAnim2.setValue(-SCROLL_WIDTH);
      Animated.timing(scrollAnim2, {
        toValue: 0,
        duration: 30000,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, [scrollAnim2]);

  const renderImages = (images) => (
    <>
      {images.map((uri, i) => (
        <RetryImage key={`img-1-${i}`} uri={uri} style={styles.scrollImage} />
      ))}
      {images.map((uri, i) => (
        <RetryImage key={`img-2-${i}`} uri={uri} style={styles.scrollImage} />
      ))}
    </>
  );

  return (
    <View style={styles.gridSection}>
      <View style={styles.scrollRow}>
        <Animated.View style={[{ flexDirection: 'row' }, { transform: [{ translateX: scrollAnim1 }] }]}>
          {renderImages(PRODUCT_IMAGES)}
        </Animated.View>
      </View>
      <View style={styles.scrollRow}>
        <Animated.View style={[{ flexDirection: 'row' }, { transform: [{ translateX: scrollAnim2 }] }]}>
          {renderImages(PRODUCT_IMAGES)}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
gridSection: {
  flex: 1.2,
  backgroundColor: COLORS.white,
  justifyContent: 'center',
  paddingVertical: 6,      // كان 10
},

scrollRow: {
  height: 170,             // كان 180
  marginVertical: 6,
  overflow: 'hidden',
},

scrollImage: {
  width: 140,
  height: 170,             // كان 180
  marginRight: 8,
  borderRadius: 12,
  backgroundColor: COLORS.lightGray,
},
});
