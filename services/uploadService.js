import { supabase } from './supabase';

/**
 * رفع صورة إلى Storage
 * bucket: product-images
 * throws: Error with formatted Supabase details
 */
export async function uploadImage(file, folder = 'products') {
  console.log('START IMAGE UPLOAD');
  console.log('BUCKET: product-images');
  console.log('FILE:', file?.uri);

  try {
    if (!file) {
      console.log('UPLOAD FAILED: no file object received');
      throw new Error('No file object received');
    }

    console.log('FILE OBJECT:', JSON.stringify(file, null, 2));

    const fileExt = file.uri.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    console.log('FILE EXT:', fileExt);
    console.log('FILE PATH:', filePath);
    console.log('CONTENT TYPE:', file.mimeType || 'image/jpeg');

    // تحويل الصورة إلى Blob
    const response = await fetch(file.uri);
    console.log('FETCH STATUS:', response.status);
    console.log('FETCH OK:', response.ok);
    const blob = await response.blob();
    console.log('BLOB SIZE:', blob.size, 'BLOB TYPE:', blob.type);

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, blob, {
        contentType: file.mimeType || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.log('UPLOAD FAILED - Supabase Error:');
      console.log('Full error object:', JSON.stringify(error, null, 2));
      console.log('  message:', error.message);
      console.log('  statusCode:', error.statusCode);
      console.log('  error:', error.error);
      console.log('  details:', error.details);
      console.log('  hint:', error.hint);
      
      // Create error object with all fields for caller to format
      const err = new Error();
      err.uploadError = {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error,
        details: error.details,
        hint: error.hint,
      };
      throw err;
    }

    console.log('UPLOAD SUCCESS:', filePath);

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;

  } catch (error) {
    console.log('UPLOAD FAILED (catch):', error.message);
    console.log('Full error object:', JSON.stringify(error, null, 2));
    // Re-throw the error so caller can handle it
    throw error;
  }
}

/**
 * رفع مجموعة صور
 * throws: Error from first failed upload, or from uploadImage
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
    console.log('Full error object:', JSON.stringify(error, null, 2));
    // Re-throw the error so handleSubmit can catch and display it
    throw error;
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
