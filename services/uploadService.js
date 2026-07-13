import { supabase } from './supabase';


/**
 * رفع صورة إلى Storage
 * bucket: product-images
 */
export async function uploadImage(file, folder = 'products') {
  try {
    if (!file) {
      return null;
    }

    const fileExt = file.uri.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;


    // تحويل الصورة إلى Blob
    const response = await fetch(file.uri);
    const blob = await response.blob();


    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, blob, {
        contentType: file.mimeType || 'image/jpeg',
        upsert: false,
      });


    if (error) throw error;


    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);


    return data.publicUrl;


  } catch (error) {
    console.log('uploadImage error:', error.message);
    return null;
  }
}


/**
 * رفع مجموعة صور
 */
export async function uploadMultipleImages(images = []) {
  try {
    const uploadedImages = [];

    for (const image of images) {
      const url = await uploadImage(image);

      if (url) {
        uploadedImages.push(url);
      }
    }

    return uploadedImages;

  } catch (error) {
    console.log('uploadMultipleImages error:', error.message);
    return [];
  }
}


/**
 * حذف صورة من Storage
 */
export async function deleteImage(url) {
  try {
    if (!url) return false;


    const path = url.split('/product-images/')[1];

    if (!path) return false;


    const { error } = await supabase.storage
      .from('product-images')
      .remove([path]);


    if (error) throw error;


    return true;


  } catch (error) {
    console.log('deleteImage error:', error.message);
    return false;
  }
}