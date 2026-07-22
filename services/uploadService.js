import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

/**
 * Extract file extension from MIME type
 * Fallback chain: mimeType → fileName → jpg
 */
function getFileExtensionFromAsset(asset) {
  // Priority 1: Extract from mimeType
  if (asset.mimeType) {
    const mimeExt = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/heic': 'heic',
      'image/heif': 'heif',
    }[asset.mimeType];

    if (mimeExt) {
      return mimeExt;
    }
  }

  // Priority 2: Extract from fileName
  if (asset.fileName) {
    const parts = asset.fileName.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toLowerCase();
    }
  }

  // Priority 3: Default to jpg
  return 'jpg';
}

/**
 * رفع صورة إلى Storage - استخدام localUri + metadata
 * bucket: product-images
 * throws: Error with formatted Supabase details
 */
export async function uploadImage(asset, folder = 'products') {
  console.log('========== IMAGE UPLOAD START ==========');

  // STEP 1: Log asset object
  try {
    console.log('[STEP 1] Asset object received');
    console.log({
      uri: asset?.uri,
      localUri: asset?.localUri,
      mimeType: asset?.mimeType,
      fileName: asset?.fileName,
      fileSize: asset?.fileSize,
    });

    if (!asset || !asset.localUri) {
      throw new Error('No localUri in asset object');
    }
  } catch (error) {
    console.log('[STEP 1 ERROR]', error.message);
    throw error;
  }

  // STEP 2: Verify file exists at localUri
  try {
    console.log('[STEP 2] Checking if local file exists');
    const fileInfo = await FileSystem.getInfoAsync(asset.localUri);

    if (!fileInfo.exists) {
      throw new Error(`File does not exist at ${asset.localUri}`);
    }

    console.log('[STEP 2 SUCCESS] File exists');
    console.log({
      fileSize: fileInfo.size,
      isDirectory: fileInfo.isDirectory,
    });
  } catch (error) {
    console.log('[STEP 2 ERROR]', error.message);
    throw error;
  }

  // STEP 3: Extract file extension using fallback chain
  try {
    console.log('[STEP 3] Extracting file extension');
    const fileExt = getFileExtensionFromAsset(asset);
    console.log('[STEP 3 SUCCESS]', { fileExt });

    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const contentType = asset.mimeType || 'image/jpeg';

    console.log('[STEP 3] File parameters:');
    console.log({
      filePath,
      contentType,
      sourceUri: asset.localUri,
    });

    // STEP 4: Read file as base64
    console.log('[STEP 4] Reading file as base64');
    const base64Data = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('[STEP 4 SUCCESS]');
    console.log({
      base64Length: base64Data.length,
    });

    // STEP 5: Convert base64 to Blob
    console.log('[STEP 5] Creating Blob from base64');
    const blobResponse = await fetch(`data:${contentType};base64,${base64Data}`);
    const blob = await blobResponse.blob();

    console.log('[STEP 5 SUCCESS]');
    console.log({
      blobSize: blob.size,
      blobType: blob.type,
    });

    // STEP 6: Before upload to Supabase
    console.log('[STEP 6] Before supabase.storage.upload()');
    console.log({
      bucket: 'product-images',
      filePath,
      contentType,
      upsert: false,
      blobSize: blob.size,
    });

    // STEP 7: Upload to Supabase Storage
    console.log('[STEP 7] Calling supabase.storage.upload()...');
    const uploadResult = await supabase.storage
      .from('product-images')
      .upload(filePath, blob, {
        contentType,
        upsert: false,
      });

    console.log('[STEP 7] After upload()');
    console.log({
      data: uploadResult.data,
      error: uploadResult.error,
    });

    if (uploadResult.error) {
      console.log('[STEP 7 ERROR] Upload failed');
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

    console.log('[STEP 8] Upload successful, cleaning up cache');
    const publicUrl = data.publicUrl;

    // STEP 8: Delete local cache file
    try {
      await FileSystem.deleteAsync(asset.localUri, { idempotent: true });
      console.log('[STEP 8 SUCCESS] Local cache file deleted');
    } catch (deleteError) {
      console.log('[STEP 8 WARNING] Failed to delete cache file:', deleteError.message);
      // Don't fail the upload if cache deletion fails
    }

    console.log('========== IMAGE UPLOAD END (SUCCESS) ==========');
    return publicUrl;

  } catch (error) {
    console.log('========== IMAGE UPLOAD END (ERROR) ==========');
    console.log('[EXCEPTION]');
    console.log({
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
    });

    throw error;
  }
}

/**
 * رفع مجموعة صور
 * throws: Error from first failed upload
 */
export async function uploadMultipleImages(assets = []) {
  console.log('========== UPLOAD MULTIPLE START ==========');
  console.log('Total images to upload:', assets.length);

  try {
    const uploadedImages = [];

    for (let i = 0; i < assets.length; i++) {
      console.log(`\n--- Uploading image ${i + 1}/${assets.length} ---`);
      const url = await uploadImage(assets[i]);

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
