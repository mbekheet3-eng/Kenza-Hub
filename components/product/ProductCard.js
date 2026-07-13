import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');

const CARD_WIDTH = (width - 52) / 2;

export default function ProductCard({
  product,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => onPress(product)}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.image}
      />

      <View style={styles.info}>

        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {product.title}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            {product.price} ج.م
          </Text>

          <Ionicons
            name="heart-outline"
            size={20}
            color="#999"
          />
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  image: {
    width: '100%',
    height: CARD_WIDTH * 1.35,
    backgroundColor: '#F5F5F5',
  },

  info: {
    padding: 12,
  },

  title: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
    lineHeight: 21,
    minHeight: 42,
    textAlign: 'right',
  },

  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

});