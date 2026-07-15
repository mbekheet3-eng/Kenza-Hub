import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../theme/colors';
import { supabase } from '../services/supabase';
import { uploadMultipleImages } from '../services/uploadService';
import BRANDS from '../data/brands';

const MAX_IMAGES = 5;

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'مقاس حر'];
const COLORS_LIST = [
  'أسود', 'أبيض', 'رمادي', 'أزرق', 'كحلي', 'أحمر',
  'وردي', 'بنفسجي', 'أخضر', 'أصفر', 'بني', 'بيج',
];
const POPULAR_BRANDS = BRANDS.filter((b) => b.popular);

const L = {
  title: 'بيع منتج',
  addPhotos: 'أضف صور',
  fromCamera: 'كاميرا',
  fromGallery: 'معرض الصور',
  productName: 'اسم المنتج',
  productNamePlaceholder: 'مثال: جاكيت جينز أزرق',
  price: 'السعر (ج.م)',
  pricePlaceholder: 'مثال: 250',
  category: 'الفئة',
  condition: 'الحالة',
  size: 'المقاس (اختياري)',
  color: 'اللون (اختياري)',
  brand: 'البراند (اختياري)',
  description: 'الوصف',
  descriptionPlaceholder: 'اوصف المنتج بالتفصيل...',
  publish: 'انشر المنتج',
  fillAll: 'من فضلك اكمل اسم المنتج والسعر والفئة والحالة',
  addPhotoFirst: 'من فضلك أضف صورة واحدة على الأقل',
  success: 'تم نشر المنتج بنجاح',
  successMsg: 'المنتج اتضاف لقاعدة البيانات',
  loginRequired: 'لازم تسجل دخول عشان تبيع',
  conditions: ['جديد', 'ممتاز', 'كويس', 'مقبول'],
  maxImagesMsg: 'أقصى عدد صور ' + MAX_IMAGES,
  cameraPermission: 'محتاجين إذن الكاميرا عشان تصور المنتج',
  galleryPermission: 'محتاجين إذن الوصول للصور',
};

export default function SellScreen({ onBack, user }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    const { data, error } = await supabase
      .from('categories')
      .select('id, name_ar, name_en');

    if (error) {
      console.log('fetchCategories error:', error.message);
      Alert.alert('خطأ', 'مش قادرين نجيب الفئات دلوقتي');
    } else {
      setCategories(data || []);
    }
    setLoadingCategories(false);
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('', L.cameraPermission);
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('', L.galleryPermission);
      return false;
    }
    return true;
  };

  const addImageUri = (uri) => {
    setImages((prev) => [...prev, uri]);
  };

  const pickFromCamera = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert('', L.maxImagesMsg);
      return;
    }
    const ok = await requestCameraPermission();
    if (!ok) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        addImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('خطأ', 'مش قادر يفتح الكاميرا');
    }
  };

  const pickFromGallery = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert('', L.maxImagesMsg);
      return;
    }
    const ok = await requestGalleryPermission();
    if (!ok) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        addImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('خطأ', 'مش قادر يفتح معرض الصور');
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!user) {
      Alert.alert('', L.loginRequired);
      return;
    }
    if (images.length === 0) {
      Alert.alert('', L.addPhotoFirst);
      return;
    }
    if (!productName.trim() || !price || !selectedCategoryId || !selectedCondition) {
      Alert.alert('', L.fillAll);
      return;
    }

    setLoading(true);
    try {
      const { data: product, error: insertError } = await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          category_id: selectedCategoryId,
          title_ar: productName.trim(),
          title_en: productName.trim(),
          description_ar: description.trim(),
          description_en: description.trim(),
          price: parseFloat(price),
          currency: 'EGP',
          condition: selectedCondition,
          status: 'active',
          size: selectedSize,
          color: selectedColor,
          brand: selectedBrand,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const imageObjects = images.map((uri) => ({ uri }));
      const uploadedUrls = await uploadMultipleImages(imageObjects);

      if (uploadedUrls.length > 0) {
        const imageRows = uploadedUrls.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          display_order: index,
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageRows);

        if (imagesError) {
          console.log('product_images insert error:', imagesError.message);
        }
      }

      Alert.alert(L.success, L.successMsg);
      onBack && onBack();
    } catch (error) {
      Alert.alert('خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{L.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>
          {L.addPhotos} ({images.length}/{MAX_IMAGES})
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageThumbWrapper}>
              <Image source={{ uri }} style={styles.imageThumb} />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}

          {images.length < MAX_IMAGES && (
            <View style={styles.addImagesRow}>
              <TouchableOpacity style={styles.addImageBox} onPress={pickFromCamera}>
                <Text style={styles.addImageIcon}>📷</Text>
                <Text style={styles.addImageLabel}>{L.fromCamera}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addImageBox} onPress={pickFromGallery}>
                <Text style={styles.addImageIcon}>🖼️</Text>
                <Text style={styles.addImageLabel}>{L.fromGallery}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <Text style={styles.label}>{L.productName}</Text>
        <TextInput
          style={styles.input}
          placeholder={L.productNamePlaceholder}
          placeholderTextColor={COLORS.gray}
          value={productName}
          onChangeText={setProductName}
          textAlign="right"
        />

        <Text style={styles.label}>{L.price}</Text>
        <TextInput
          style={styles.input}
          placeholder={L.pricePlaceholder}
          placeholderTextColor={COLORS.gray}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          textAlign="right"
        />

        <Text style={styles.label}>{L.category}</Text>
        {loadingCategories ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <View style={styles.optionsRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.optionBtn,
                  selectedCategoryId === cat.id && styles.optionBtnActive,
                ]}
                onPress={() => setSelectedCategoryId(cat.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedCategoryId === cat.id && styles.optionTextActive,
                  ]}
                >
                  {cat.name_ar}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>{L.condition}</Text>
        <View style={styles.optionsRow}>
          {L.conditions.map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[
                styles.optionBtn,
                selectedCondition === cond && styles.optionBtnActive,
              ]}
              onPress={() => setSelectedCondition(cond)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedCondition === cond && styles.optionTextActive,
                ]}
              >
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{L.size}</Text>
        <View style={styles.optionsRow}>
          {SIZES.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionBtn,
                selectedSize === size && styles.optionBtnActive,
              ]}
              onPress={() => setSelectedSize(selectedSize === size ? null : size)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSize === size && styles.optionTextActive,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{L.color}</Text>
        <View style={styles.optionsRow}>
          {COLORS_LIST.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.optionBtn,
                selectedColor === color && styles.optionBtnActive,
              ]}
              onPress={() => setSelectedColor(selectedColor === color ? null : color)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedColor === color && styles.optionTextActive,
                ]}
              >
                {color}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{L.brand}</Text>
        <View style={styles.optionsRow}>
          {POPULAR_BRANDS.map((brand) => (
            <TouchableOpacity
              key={brand.id}
              style={[
                styles.optionBtn,
                selectedBrand === brand.name && styles.optionBtnActive,
              ]}
              onPress={() =>
                setSelectedBrand(selectedBrand === brand.name ? null : brand.name)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selectedBrand === brand.name && styles.optionTextActive,
                ]}
              >
                {brand.ar}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{L.description}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={L.descriptionPlaceholder}
          placeholderTextColor={COLORS.gray}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          textAlign="right"
        />

        <TouchableOpacity
          style={[styles.publishBtn, { opacity: loading ? 0.7 : 1 }]}
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.publishBtnText}>{L.publish}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row-reverse',
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
  scrollContent: { padding: 16, paddingBottom: 60 },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'right',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  textArea: { height: 100, paddingTop: 12 },
  optionsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 4,
  },
  optionBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: { fontSize: 14, color: COLORS.navy, fontWeight: '500' },
  optionTextActive: { color: COLORS.white },
  imageThumbWrapper: {
    position: 'relative',
    marginEnd: 10,
  },
  imageThumb: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: { color: COLORS.white, fontWeight: 'bold', lineHeight: 18 },
  addImagesRow: { flexDirection: 'row', gap: 10 },
  addImageBox: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 10,
  },
  addImageIcon: { fontSize: 22, marginBottom: 4 },
  addImageLabel: { fontSize: 11, color: COLORS.primary, textAlign: 'center' },
  publishBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  publishBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
