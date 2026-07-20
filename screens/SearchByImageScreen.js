import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const LABELS = {
  ar: {
    title: 'البحث بالصورة',
    searchSimilar: 'البحث عن منتجات مشابهة',
    changeImage: 'اختيار صورة أخرى',
    heroTitle: 'ابحث عن منتج بصورة واحدة',
    heroDesc: 'التقط صورة أو اختر صورة من المعرض\nللعثور على منتجات مشابهة.',
    takePhoto: 'التقاط صورة',
    pickGallery: 'اختيار من المعرض',
  },
  en: {
    title: 'Search by Image',
    searchSimilar: 'Search for similar products',
    changeImage: 'Choose another photo',
    heroTitle: 'Find a product with one photo',
    heroDesc: 'Take a photo or pick one from your\ngallery to find similar products.',
    takePhoto: 'Take a Photo',
    pickGallery: 'Choose from Gallery',
  },
  fr: {
    title: 'Recherche par image',
    searchSimilar: 'Rechercher des produits similaires',
    changeImage: 'Choisir une autre photo',
    heroTitle: 'Trouvez un produit avec une photo',
    heroDesc: 'Prenez une photo ou choisissez-en\nune pour trouver des produits similaires.',
    takePhoto: 'Prendre une photo',
    pickGallery: 'Choisir depuis la galerie',
  },
};

export default function SearchByImageScreen({ navigateTo, lang = 'ar' }) {
  const l = LABELS[lang] || LABELS.ar;
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result =
      await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 5],
        quality: 1,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const searchImage = () => {
    if (!image) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      navigateTo('searchPreview', {
        imageUri: image,
      });
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigateTo('home')}
          style={styles.back}
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color="#222"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          {l.title}
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {image ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: image }}
            style={styles.preview}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchImage}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="search"
                  size={22}
                  color="#fff"
                />

                <Text style={styles.searchText}>
                  {l.searchSimilar}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setImage(null)}
          >
            <Text style={styles.changeText}>
              {l.changeImage}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.hero}>
            <Ionicons
              name="scan-outline"
              size={70}
              color="#6C63FF"
            />

            <Text style={styles.heroTitle}>
              {l.heroTitle}
            </Text>

            <Text style={styles.heroDesc}>
              {l.heroDesc}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.card}
            onPress={openCamera}
          >
            <Ionicons
              name="camera-outline"
              size={55}
              color="#6C63FF"
            />

            <Text style={styles.cardTitle}>
              {l.takePhoto}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={pickImage}
          >
            <Ionicons
              name="images-outline"
              size={55}
              color="#FF7A00"
            />

            <Text style={styles.cardTitle}>
              {l.pickGallery}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F8F8F8',
    padding:20,
  },

  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:30,
  },

  back:{
    width:40,
    height:40,
    borderRadius:20,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center',
  },

  title:{
    fontSize:22,
    fontWeight:'700',
    color:'#222',
  },

  hero:{
    alignItems:'center',
    marginBottom:30,
  },

  heroTitle:{
    fontSize:24,
    fontWeight:'700',
    marginTop:15,
  },

  heroDesc:{
    textAlign:'center',
    color:'#777',
    marginTop:10,
    lineHeight:22,
  },  card:{
    backgroundColor:'#fff',
    borderRadius:22,
    height:150,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:20,
    elevation:4,
  },

  cardTitle:{
    fontSize:20,
    fontWeight:'700',
    marginTop:12,
  },

  previewContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },

  preview:{
    width:'90%',
    height:420,
    borderRadius:20,
    backgroundColor:'#eee',
  },

  searchButton:{
    marginTop:25,
    backgroundColor:'#6C63FF',
    paddingHorizontal:25,
    paddingVertical:15,
    borderRadius:30,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },

  searchText:{
    color:'#fff',
    fontSize:16,
    fontWeight:'700',
    marginLeft:10,
  },

  changeButton:{
    marginTop:20,
    paddingVertical:12,
  },

  changeText:{
    color:'#6C63FF',
    fontSize:16,
    fontWeight:'700',
  },
});