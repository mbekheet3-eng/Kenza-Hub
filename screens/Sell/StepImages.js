// screens/Sell/StepImages.js

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
    cameraPermissionTitle: 'محتاجين إذن',
    cameraPermissionMsg: 'من فضلك اسمح بالوصول للكاميرا.',
    libraryPermissionTitle: 'محتاجين إذن',
    libraryPermissionMsg: 'من فضلك اسمح بالوصول لمعرض الصور.',
    camera: 'كاميرا',
    gallery: 'معرض',
  },
  en: {
    title: 'Add Product Photos',
    subtitle: 'Upload clear images of your product.',
    maxReachedTitle: 'Maximum reached',
    maxReachedMsg: (n) => `You can upload up to ${n} images.`,
    cameraPermissionTitle: 'Permission required',
    cameraPermissionMsg: 'Please allow camera access.',
    libraryPermissionTitle: 'Permission required',
    libraryPermissionMsg: 'Please allow photo library access.',
    camera: 'Camera',
    gallery: 'Gallery',
  },
  fr: {
    title: 'Ajouter des photos du produit',
    subtitle: 'Téléchargez des photos claires de votre produit.',
    maxReachedTitle: 'Maximum atteint',
    maxReachedMsg: (n) => `Vous pouvez télécharger jusqu'à ${n} photos.`,
    cameraPermissionTitle: 'Autorisation requise',
    cameraPermissionMsg: 'Veuillez autoriser l\'accès à la caméra.',
    libraryPermissionTitle: 'Autorisation requise',
    libraryPermissionMsg: 'Veuillez autoriser l\'accès à la galerie de photos.',
    camera: 'Caméra',
    gallery: 'Galerie',
  },
};

export default function StepImages({ form, setForm, lang = 'ar' }) {
  const l = LABELS[lang] || LABELS.ar;

  const pickImageFromCamera = async () => {
    if (form.images.length >= MAX_IMAGES) {
      Alert.alert(l.maxReachedTitle, l.maxReachedMsg(MAX_IMAGES));
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(l.cameraPermissionTitle, l.cameraPermissionMsg);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
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

  const pickImageFromGallery = async () => {
    if (form.images.length >= MAX_IMAGES) {
      Alert.alert(l.maxReachedTitle, l.maxReachedMsg(MAX_IMAGES));
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(l.libraryPermissionTitle, l.libraryPermissionMsg);
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
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[styles.imageBox, styles.addImage]}
              onPress={pickImageFromCamera}
            >
              <Ionicons
                name="camera"
                size={34}
                color={COLORS.primary}
              />

              <Text style={styles.addImageText}>
                {l.camera}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageBox, styles.addImage]}
              onPress={pickImageFromGallery}
            >
              <Ionicons
                name="image"
                size={34}
                color={COLORS.primary}
              />

              <Text style={styles.addImageText}>
                {l.gallery}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
