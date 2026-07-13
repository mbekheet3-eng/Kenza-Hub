import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchPreviewScreen({
  imageUri,
  navigateTo,
}) {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigateTo('searchByImage')}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#222"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          معاينة الصورة
        </Text>

        <View style={{ width: 40 }} />

      </View>

      <View style={styles.imageContainer}>

        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />

      </View>

      <Text style={styles.description}>
        تأكد أن الصورة واضحة للحصول على أفضل النتائج.
      </Text>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() =>
          navigateTo('searching', {
            imageUri,
          })
        }
      >
        <Ionicons
          name="search"
          size={22}
          color="#fff"
        />

        <Text style={styles.searchText}>
          ابدأ البحث
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.changeButton}
        onPress={() => navigateTo('searchByImage')}
      >
        <Text style={styles.changeText}>
          اختيار صورة أخرى
        </Text>
      </TouchableOpacity>

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
    marginBottom:20,
  },

  backButton:{
    width:40,
    height:40,
    borderRadius:20,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center',
    elevation:2,
  },

  title:{
    fontSize:22,
    fontWeight:'700',
    color:'#222',
  },

  imageContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },  image:{
    width:'92%',
    height:430,
    borderRadius:20,
    backgroundColor:'#FFFFFF',
  },

  description:{
    textAlign:'center',
    color:'#666',
    fontSize:15,
    lineHeight:24,
    marginTop:20,
    marginBottom:25,
  },

  searchButton:{
    height:56,
    backgroundColor:'#6C63FF',
    borderRadius:16,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:14,
  },

  searchText:{
    color:'#fff',
    fontSize:17,
    fontWeight:'700',
    marginLeft:10,
  },

  changeButton:{
    height:54,
    borderRadius:16,
    borderWidth:1,
    borderColor:'#6C63FF',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:20,
    backgroundColor:'#fff',
  },

  changeText:{
    color:'#6C63FF',
    fontSize:16,
    fontWeight:'700',
  },

});