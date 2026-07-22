// screens/Sell/StepImages.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import styles from './SellStyles';
import { MAX_IMAGES } from './constants';

const LABELS = {
  ar: {
    title: 'صور المنتج',
    subtitle: 'اختار صورة من الكاميرا أو المعرض.',
    camera: 'كاميرا',
    gallery: 'معرض',
    maxReachedTitle: 'الحد الأقصى من الصور',
    maxReachedMsg: (max) => `أنت وصلت لـ ${max} صور.`,
    cameraPermission: 'احنا محتاجين نوصل للكاميرا عشان تصور المنتج',
    galleryPermission: 'احنا محتاجين نوصل لصورك عشان تضيف صور المنتج',
    permissionDenied: 'تم رفض الإذن.',
    copyFailed: 'فشل نسخ الصورة.',
  },
  en: {
    title: 'Product Photos',
    subtitle: 'Select photos from camera or gallery.',
    camera: 'Camera',
    gallery: 'Gallery',
    maxReachedTitle: 'Max Photos Reached',
    maxReachedMsg: (max) => `You have reached ${max} photos.`,
    cameraPermission: 'We need camera access to take photos.',
    galleryPermission: 'We need access to your photos.',
    permissionDenied: 'Permission was denied.',
    copyFailed: 'Failed to copy photo.',
  },
  fr: {
    title: 'Photos du produit',
    subtitle: 'Sélectionnez des photos depuis la caméra ou la galerie.',
    camera: 'Caméra',
    gallery: 'Galerie',
    maxReachedTitle: 'Maximum de photos atteint',
    maxReachedMsg: (max) => `Vous avez atteint ${max} photos.`,
    cameraPermission: 'Nous avons besoin d\'accéder à la caméra.',
    galleryPermission: 'Nous avons besoin d\'accéder à vos photos.',
    permissionDenied: 'Permission refusée.',
    copyFailed: 'Échec de la copie de la photo.',
  },
};

/**
 * Copy image from content:// or file:// URI to local cache directory
 * Returns full asset object with localUri
 */
async function copyImageToCache(asset) {
  try {
    // Create cache uploads directory if it doesn't exist
    const cacheDir = FileSystem.cacheDirectory + 'uploads/';
    const dirInfo = await FileSystem.getInfoAsync(cacheDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    }

    // Generate unique local filename
    const timestamp = Date.now();
    const filename = `image_${timestamp}.jpg`;
    const localUri = cacheDir + filename;

    // Copy file from original URI to cache
    await FileSystem.copyAsync({
      from: asset.uri,
      to: localUri,
    });

    // Verify the file was copied successfully
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
      throw new Error('File copy verification failed');
    }

    // Return complete asset with localUri
    return {
      uri: asset.uri,  // Original URI (for reference)
      localUri: localUri,  // Local cache URI (for upload)
      mimeType: asset.mimeType,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
      type: asset.type,
      assetId: asset.assetId,
      width: asset.width,
      height: asset.height,
    };
  } catch (error) {
    console.log('copyImageToCache error:', error.message);
    throw error;
  }
}

export default function StepImages({
  form,
  setForm,
  lang = 'ar',
}) {
  const l = LABELS[lang] || LABELS.ar;

  const pickImageFromCamera = async () => {
    if (form.images.length >= MAX_IMAGES) {
      Alert.alert(l.maxReachedTitle, l.maxReachedMsg(MAX_IMAGES));
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(l.permissionDenied, l.cameraPermission);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const asset = await copyImageToCache(result.assets[0]);
        setForm({
          ...form,
          images: [...form.images, asset],
        });
      } catch (error) {
        Alert.alert('Error', l.copyFailed);
        console.log('Camera image copy failed:', error.message);
      }
    }
  };

  const pickImageFromGallery = async () => {
    if (form.images.length >= MAX_IMAGES) {
      Alert.alert(l.maxReachedTitle, l.maxReachedMsg(MAX_IMAGES));
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(l.permissionDenied, l.galleryPermission);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const asset = await copyImageToCache(result.assets[0]);
        setForm({
          ...form,
          images: [...form.images, asset],
        });
      } catch (error) {
        Alert.alert('Error', l.copyFailed);
        console.log('Gallery image copy failed:', error.message);
      }
    }
  };

  const removeImage = (index) => {
    const images = [...form.images];
    const removed = images[index];

    // Attempt to delete local cache file (idempotent)
    if (removed.localUri) {
      FileSystem.deleteAsync(removed.localUri, { idempotent: true })
        .catch((err) => console.log('Failed to delete cached image:', err.message));
    }

    images.splice(index, 1);
    setForm({
      ...form,
      images,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>
        {l.title}
      </Text>

      <Text style={styles.subtitle}>
        {l.subtitle}
      </Text>

      <View style={[styles.row, { marginBottom: 20 }]}>
        <TouchableOpacity
          style={styles.chip}
          onPress={pickImageFromCamera}
        >
          <Text style={styles.chipText}>
            📷 {l.camera}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chip}
          onPress={pickImageFromGallery}
        >
          <Text style={styles.chipText}>
            🖼️ {l.gallery}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        {form.images.map((image, index) => (
          <View key={index} style={{ marginRight: 10, position: 'relative' }}>
            <Image
              source={{ uri: image.localUri }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 10,
              }}
            />

            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: 'rgba(255, 0, 0, 0.7)',
                borderRadius: 50,
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => removeImage(index)}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                ×
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {form.images.length < MAX_IMAGES && (
        <Text style={styles.subtitle}>
          {form.images.length}/{MAX_IMAGES}
        </Text>
      )}
    </View>
  );
}
