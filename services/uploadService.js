import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

/**
 * رفع صورة إلى Storage - TRACING VERSION
 * bucket: product-images
 * Detailed logging after EVERY step
 */
export async function uploadImage(file, folder = 'products') {
  console.log('========== IMAGE UPLOAD START ==========');

  // STEP 1: Log selected image object
  try {
    console.log('[STEP 1] Selected image object');
    console.log({
      uri: file?.uri,
      mimeType: file?.mimeType,
      fileName: file?.fileName,
      fileSize: file?.fileSize,
    });

    if (!file || !file.uri) {
      throw new Error('No file URI received');
    }
  } catch (error) {
    console.log('[STEP 1 ERROR]', error.message, error.stack);
    throw error;
  }

  // STEP 2: Before FileSystem.readAsStringAsync()
  try {
    console.log('[STEP 2] Before FileSystem.readAsStringAsync()');
    console.log('Attempting to read:', file.uri);

    // STEP 3: After readAsStringAsync()
    const base64Data = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('[STEP 3] After readAsStringAsync()');
    console.log({
      base64Length: base64Data.length,
      base64Preview: base64Data.substring(0, 50) + '...',
    });

    // STEP 4: Before Blob creation
    console.log('[STEP 4] Before Blob creation');
    const dataUri = `data:${file.mimeType || 'image/jpeg'};base64,${base64Data}`;
    console.log('Data URI length:', dataUri.length);

    const blobResponse = await fetch(dataUri);
    console.log('Fetch response status:', blobResponse.status);

    const blob = await blobResponse.blob();

    // STEP 5: After Blob creation
    console.log('[STEP 5] After Blob creation');
    console.log({
      blobSize: blob.size,
      blobType: blob.type,
    });

    // STEP 6: Immediately before supabase.storage.upload()
    const fileExt = file.uri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log('[STEP 6] Immediately before supabase.storage.upload()');
    console.log({
      bucket: 'product-images',
      filePath: filePath,
      contentType: file.mimeType || 'image/jpeg',
      upsert: false,
      blobSize: blob.size,
    });

    // STEP 7: Immediately after upload()
    console.log('[STEP 7] Calling supabase.storage.upload()...');
    const uploadResult = await supabase.storage
      .from('product-images')
      .upload(filePath, blob, {
        contentType: file.mimeType || 'image/jpeg',
        upsert: false,
      });

    console.log('[STEP 7] After supabase.storage.upload()');
    console.log({
      data: uploadResult.data,
      error: uploadResult.error,
    });

    if (uploadResult.error) {
      console.log('[STEP 7 ERROR] Upload failed with error:');
      console.log({
        message: uploadResult.error.message,
        statusCode: uploadResult.error.statusCode,
        error: uploadResult.error.error,
        details: uploadResult.error.details,
        hint: uploadResult.error.hint,
      });

      const err = new Error();
      err.uploadError = {
        message: uploadResult.error.message,
        statusCode: uploadResult.error.statusCode,
        error: uploadResult.error.error,
        details: uploadResult.error.details,
        hint: uploadResult.error.hint,
      };
      throw err;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log('[SUCCESS] Upload completed');
    console.log({
      publicUrl: data.publicUrl,
    });

    console.log('========== IMAGE UPLOAD END (SUCCESS) ==========');
    return data.publicUrl;

  } catch (error) {
    // STEP 8: If ANY exception happens
    console.log('========== IMAGE UPLOAD END (ERROR) ==========');
    console.log('[STEP 8 EXCEPTION]');
    console.log({
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
    });

    // Try to extract line number from stack
    const stackLines = (error.stack || '').split('\n');
    console.log('[STEP 8] Full stack trace:');
    stackLines.forEach((line, index) => {
      console.log(`  Line ${index}: ${line}`);
    });

    throw error;
  }
}

/**
 * رفع مجموعة صور - TRACING VERSION
 */
export async function uploadMultipleImages(images = []) {
  console.log('========== UPLOAD MULTIPLE START ==========');
  console.log('Total images to upload:', images.length);

  try {
    const uploadedImages = [];

    for (let i = 0; i < images.length; i++) {
      console.log(`\n--- Uploading image ${i + 1}/${images.length} ---`);
      const url = await uploadImage(images[i]);

      if (url) {
        uploadedImages.push(url);
        console.log(`Image ${i + 1} uploaded successfully`);
      }
    }

    console.log('========== UPLOAD MULTIPLE END (SUCCESS) ==========');
    console.log('Total successfully uploaded:', uploadedImages.length);
    return uploadedImages;

  } catch (error) {
    console.log('========== UPLOAD MULTIPLE END (ERROR) ==========');
    console.log('Upload failed at image index');
    console.log({
      errorMessage: error.message,
      errorStack: error.stack,
    });
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
