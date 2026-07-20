// screens/sell/StepImages.js

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from './SellStyles';
import { COLORS } from '../../theme/colors';
import { MAX_IMAGES } from './constants';

const LABELS = {
  ar: {
    title: 'ضيف صور المنتج',
    subtitle: 'ارفع صور واضحة للمنتج بتاعك.',
    maxReachedTitle: 'وصلت للحد الأقصى',
    maxReachedMsg: (n) => `تقدر ترفع لغاية ${n} صور.`,
    permissionTitle: 'محتاجين إذن',
    permissionMsg: 'من فضلك اسمح بالوصول لمعرض الصور.',
    addPhoto: 'إضافة صورة',
  },
  en: {
    title: 'Add Product Photos',
    subtitle: 'Upload clear images of your product.',
    maxReachedTitle: 'Maximum reached',
    maxReachedMsg: (n) => `You can upload up to ${n} images.`,
    permissionTitle: 'Permission required',
    permissionMsg: 'Please allow photo library access.',
    addPhoto: 'Add Photo',
  },
  fr: {
    title: 'Ajouter des photos du produit',
    subtitle: 'Téléchargez des photos claires de votre produit.',
    maxReachedTitle: 'Maximum atteint',
    maxReachedMsg: (n) => `Vous pouvez télécharger jusqu'à ${n} photos.`,
    permissionTitle: 'Autorisation requise',
    permissionMsg: 'Veuillez autoriser l\'accès à la galerie de photos.',
    addPhoto: 'Ajouter une photo',
  },
};

export default function StepImages({ form, setForm, lang = 'ar' }) {
  const l = LABELS[lang] || LABELS.ar;

  const pickImage = async () => {
    if (form.images.length >= MAX_IMAGES) {
      Alert.alert(l.maxReachedTitle, l.maxReachedMsg(MAX_IMAGES));
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(l.permissionTitle, l.permissionMsg);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        images: [...form.images, result.assets[0].uri],
      });
    }
  };

  const removeImage = (index) => {
    const images = [...form.images];
    images.splice(index, 1);

    setForm({
      ...form,
      images,
    });
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>
        {l.title}
      </Text>

      <Text style={styles.subtitle}>
        {l.subtitle}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {form.images.map((uri, index) => (
          <View
            key={index}
            style={styles.imageBox}
          >
            <Image
              source={{ uri }}
              style={styles.image}
            />

            <TouchableOpacity
              onPress={() => removeImage(index)}
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 2,
              }}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color="red"
              />
            </TouchableOpacity>
          </View>
        ))}

        {form.images.length < MAX_IMAGES && (
          <TouchableOpacity
            style={[styles.imageBox, styles.addImage]}
            onPress={pickImage}
          >
            <Ionicons
              name="camera"
              size={34}
              color={COLORS.primary}
            />

            <Text style={styles.addImageText}>
              {l.addPhoto}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
