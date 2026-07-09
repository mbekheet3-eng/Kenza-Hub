import React, { useState } from 'react';
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

const LABELS = {
  ar: {
    title: 'بيع منتج',
    back: 'رجوع',
    addPhoto: 'أضف صورة',
    changePhoto: 'غير الصورة',
    productName: 'اسم المنتج',
    productNamePlaceholder: 'مثال: جاكيت جينز أزرق',
    price: 'السعر (ج.م)',
    pricePlaceholder: 'مثال: 250',
    category: 'الفئة',
    condition: 'الحالة',
    description: 'الوصف',
    descriptionPlaceholder: 'اوصف المنتج بالتفصيل...',
    publish: 'انشر المنتج',
    fillAll: 'من فضلك اكمل كل الحقول',
    addPhotoFirst: 'من فضلك أضف صورة للمنتج',
    success: 'تم نشر المنتج بنجاح',
    successMsg: 'المنتج اتضاف لقاعدة البيانات',
    loginRequired: 'لازم تسجل دخول عشان تبيع',
    categories: ['سيدات', 'رجال', 'أطفال'],
    categoryKeys: ['women', 'men', 'kids'],
    conditions: ['جديد', 'ممتاز', 'كويس', 'مقبول'],
    conditionKeys: ['new', 'excellent', 'good', 'fair'],
  },
  en: {
    title: 'Sell an Item',
    back: 'Back',
    addPhoto: 'Add Photo',
    changePhoto: 'Change Photo',
    productName: 'Product Name',
    productNamePlaceholder: 'e.g. Blue Denim Jacket',
    price: 'Price (EGP)',
    pricePlaceholder: 'e.g. 250',
    category: 'Category',
    condition: 'Condition',
    description: 'Description',
    descriptionPlaceholder: 'Describe your item in detail...',
    publish: 'Publish Item',
    fillAll: 'Please fill all fields',
    addPhotoFirst: 'Please add a photo of your item',
    success: 'Item published successfully',
    successMsg: 'Product added to database',
    loginRequired: 'You need to log in to sell',
    categories: ['Women', 'Men', 'Kids'],
    categoryKeys: ['women', 'men', 'kids'],
    conditions: ['New', 'Excellent', 'Good', 'Fair'],
    conditionKeys: ['new', 'excellent', 'good', 'fair'],
  },
  fr: {
    title: 'Vendre un article',
    back: 'Retour',
    addPhoto: 'Ajouter une photo',
    changePhoto: 'Changer la photo',
    productName: "Nom de l'article",
    productNamePlaceholder: 'ex. Veste en jean bleue',
    price: 'Prix (EGP)',
    pricePlaceholder: 'ex. 250',
    category: 'Catégorie',
    condition: 'État',
    description: 'Description',
    descriptionPlaceholder: "Décrivez votre article en détail...",
    publish: "Publier l'article",
    fillAll: 'Veuillez remplir tous les champs',
    addPhotoFirst: 'Veuillez ajouter une photo de votre article',
    success: 'Article publié avec succès',
    successMsg: 'Produit ajouté à la base de données',
    loginRequired: 'Vous devez vous connecter pour vendre',
    categories: ['Femmes', 'Hommes', 'Enfants'],
    categoryKeys: ['women', 'men', 'kids'],
    conditions: ['Neuf', 'Excellent', 'Bon', 'Acceptable'],
    conditionKeys: ['new', 'excellent', 'good', 'fair'],
  },
};

export default function SellScreen({ lang = 'ar', onBack, user }) {
  const isRTL = lang === 'ar';
  const l = LABELS[lang];

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('', 'محتاجين إذن الوصول للصور');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('خطأ', 'مش قادر يفتح الصور');
    }
  };

  const handlePublish = async () => {
    if (!user) {
      Alert.alert('', l.loginRequired);
      return;
    }
    if (!imageUri) {
      Alert.alert('', l.addPhotoFirst);
      return;
    }
    if (!productName || !price || selectedCategory === null || selectedCondition === null) {
      Alert.alert('', l.fillAll);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('products').insert({
        title: productName,
        price: parseInt(price),
        category: l.categoryKeys[selectedCategory],
        condition: l.conditionKeys[selectedCondition],
        description: description,
        seller_id: user.id,
        seller_name: user.user_metadata?.full_name || user.email,
        image_url: imageUri,
      });

      if (error) throw error;
      Alert.alert(l.success, l.successMsg);
      onBack();
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
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{l.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* رفع الصورة */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageIcon}>📷</Text>
              <Text style={styles.imageText}>{l.addPhoto}</Text>
            </View>
          )}
        </TouchableOpacity>

        {imageUri && (
          <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage}>
            <Text style={styles.changePhotoText}>{l.changePhoto}</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
          {l.productName}
        </Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder={l.productNamePlaceholder}
          placeholderTextColor={COLORS.gray}
          value={productName}
          onChangeText={setProductName}
        />

        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
          {l.price}
        </Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder={l.pricePlaceholder}
          placeholderTextColor={COLORS.gray}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
          {l.category}
        </Text>
        <View style={[styles.optionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {l.categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionBtn, selectedCategory === index && styles.optionBtnActive]}
              onPress={() => setSelectedCategory(index)}
            >
              <Text style={[styles.optionText, selectedCategory === index && styles.optionTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
          {l.condition}
        </Text>
        <View style={[styles.optionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap' }]}>
          {l.conditions.map((cond, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionBtn, selectedCondition === index && styles.optionBtnActive]}
              onPress={() => setSelectedCondition(index)}
            >
              <Text style={[styles.optionText, selectedCondition === index && styles.optionTextActive]}>
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
          {l.description}
        </Text>
        <TextInput
          style={[styles.input, styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder={l.descriptionPlaceholder}
          placeholderTextColor={COLORS.gray}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.publishBtn, { opacity: loading ? 0.7 : 1 }]}
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.publishBtnText}>{l.publish}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: { padding: 16, paddingBottom: 60 },

  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderStyle: 'dashed',
  },
  selectedImage: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  imageIcon: { fontSize: 40, marginBottom: 8 },
  imageText: { fontSize: 15, color: COLORS.gray, fontWeight: '500' },
  changePhotoBtn: { alignSelf: 'center', marginBottom: 8 },
  changePhotoText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 8,
    marginTop: 16,
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
  optionsRow: { flexWrap: 'wrap', gap: 8 },
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
  publishBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  publishBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});