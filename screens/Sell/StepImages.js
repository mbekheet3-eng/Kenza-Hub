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

export default function StepImages({ form, setForm }) {
  const pickImage = async () => {
    if (form.images.length >= MAX_IMAGES) {
      Alert.alert(
        'Maximum reached',
        `You can upload up to ${MAX_IMAGES} images.`
      );
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Please allow photo library access.'
      );
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
        Add Product Photos
      </Text>

      <Text style={styles.subtitle}>
        Upload clear images of your product.
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
              Add Photo
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}