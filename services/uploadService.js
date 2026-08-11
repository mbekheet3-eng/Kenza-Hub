import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';

/**
 * Extract file extension from MIME type
 * Priority: mimeType → fileName → default 'jpg'
 */
function getFileExtension(mimeType, fileName) {
  // Priority 1: Extract from mimeType
  if (mimeType) {
    const mimeMap = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/heic': 'heic',
      'image/heif': 'heif',
      'image/bmp': 'bmp',
      'image/tiff': 'tiff',
    };

    const ext = mimeMap[mimeType.toLowerCase()];
    if (ext) return ext;
  }

  // Priority 2: Extract from fileName
  if (fileName) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext && ext.length > 0 && ext.length < 10) {
      return ext;
    }
  }

  // Priority 3: Default
  return 'jpg';
}

/**
 * رفع صورة إلى Storage
 * bucket: product-images
 * Uses localUri (cached file copy)
 * Cleans up local cache after successful upload
 */
/**
 * Check network connectivity before upload
 */
async function checkNetworkConnectivity() {
  try {
    const { isConnected } = await Network.getNetworkStateAsync();
    console.log('[NETWORK CHECK]', { isConnected });
    
    if (!isConnected) {
      throw new Error('NO_INTERNET: No internet connection available');
    }
    
    return true;
  } catch (err) {
    console.log('[NETWORK CHECK ERROR]', err.message);
    throw new Error(`Network check failed: ${err.message}`);
  }
}

/**
 * DIAGNOSTIC: Check if file has localUri before upload
 */
function validateFileObject(file) {
  console.log('[DIAGNOSTIC] File object validation:');
  console.log({
    hasUri: !!file?.uri,
    hasLocalUri: !!file?.localUri,
    hasMimeType: !!file?.mimeType,
    hasFileName: !!file?.fileName,
    fileSize: file?.fileSize,
  });

  if (!file?.localUri) {
    console.log('[DIAGNOSTIC ERROR] ⚠️ Missing localUri! This is the root cause!');
    console.log('File object keys:', Object.keys(file || {}));
    console.log('StepImages.copyImageToCache might not have been called');
    return false;
  }
  return true;
}

export async function uploadImage(file, folder = 'products') {
  console.log('========== IMAGE UPLOAD START ==========');

  // Pre-check 0: Network connectivity
  try {
    await checkNetworkConnectivity();
  } catch (netErr) {
    console.log('[STEP 0 ERROR]', netErr.message);
    throw netErr;
  }

  // Pre-check: Validate file has localUri
  if (!validateFileObject(file)) {
    throw new Error('FILE_MISSING_LOCAL_URI: Check StepImages.copyImageToCache was called');
  }

  // STEP 1: Log asset details
  try {
    console.log('[STEP 1] Asset object');
    console.log({
      uri: file?.uri,
      localUri: file?.localUri,
      mimeType: file?.mimeType,
      fileName: file?.fileName,
      fileSize: file?.fileSize,
    });

    if (!file || !file.localUri) {
      throw new Error('No localUri provided');
    }
  } catch (error) {
    console.log('[STEP 1 ERROR]', error.message);
    throw error;
  }

  try {
    // STEP 2: Verify local file exists
    console.log('[STEP 2] Verifying local file exists');
    console.log('[STEP 2] Checking localUri:', file.localUri);
    
    const fileInfo = await FileSystem.getInfoAsync(file.localUri);
    
    console.log('[STEP 2] File info:', {
      exists: fileInfo.exists,
      isDirectory: fileInfo.isDirectory,
      size: fileInfo.size,
      modificationTime: fileInfo.modificationTime,
    });
    
    if (!fileInfo.exists) {
      throw new Error(`LOCAL_FILE_DELETED: File was deleted before upload. Path: ${file.localUri}`);
    }

    console.log('[STEP 2 SUCCESS]', {
      exists: fileInfo.exists,
      size: fileInfo.size,
    });

    // STEP 3: Extract file extension (mimeType → fileName → jpg)
    console.log('[STEP 3] Extracting file extension');
    const fileExt = getFileExtension(file.mimeType, file.fileName);
    const timestamp = Date.now();
    const fileName = `${timestamp}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log('[STEP 3 SUCCESS]', {
      mimeType: file.mimeType,
      fileName: file.fileName,
      extractedExt: fileExt,
      filePath: filePath,
    });

    // STEP 4: Read file as base64
    console.log('[STEP 4] Reading file as base64');
    const base64Data = await FileSystem.readAsStringAsync(file.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('[STEP 4 SUCCESS]', {
      base64Length: base64Data.length,
    });

    // STEP 5: Create Blob
    console.log('[STEP 5] Creating Blob');
    const contentType = file.mimeType || 'image/jpeg';
    const blobResponse = await fetch(
      `data:${contentType};base64,${base64Data}`
    );
    const blob = await blobResponse.blob();

    console.log('[STEP 5 SUCCESS]', {
      blobSize: blob.size,
      blobType: blob.type,
    });

    // STEP 6: Upload to Supabase Storage (with retry)
    console.log('[STEP 6] Uploading to Supabase Storage');
    console.log({
      bucket: 'product-images',
      filePath: filePath,
      contentType: contentType,
      upsert: false,
      blobSize: blob.size,
    });

    let data, error;
    let retries = 3;
    let lastError = null;

    while (retries > 0) {
      try {
        console.log(`[STEP 6] Upload attempt (${4 - retries}/3)`);
        
        const uploadPromise = supabase.storage
          .from('product-images')
          .upload(filePath, blob, {
            contentType: contentType,
            upsert: false,
          });

        // Add timeout (30 seconds)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Upload timeout after 30s')), 30000)
        );

        const result = await Promise.race([uploadPromise, timeoutPromise]);
        data = result.data;
        error = result.error;
        
        if (!error) {
          console.log('[STEP 6 SUCCESS] Upload completed');
          break;
        } else {
          throw new Error(error.message || 'Upload failed');
        }
      } catch (err) {
        lastError = err;
        retries--;
        console.log(`[STEP 6 RETRY] Failed: ${err.message}, Retries left: ${retries}`);
        
        if (retries > 0) {
          // Wait before retry (exponential backoff)
          const waitTime = (3 - retries) * 2000; // 2s, 4s
          console.log(`[STEP 6] Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          error = lastError;
        }
      }
    }

    // STEP 7: Check upload result
    console.log('[STEP 7] Upload response');
    console.log({
      data: data,
      error: error,
    });

    if (error) {
      console.log('[STEP 7 ERROR] Supabase upload failed');
      console.log({
        message: error.message,
        statusCode: error.statusCode,
        error: error.error,
        details: error.details,
        hint: error.hint,
      });

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

    // STEP 8: Get public URL
    console.log('[STEP 8] Getting public URL');
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log('[STEP 8 SUCCESS]', {
      publicUrl: urlData.publicUrl,
    });

    // STEP 9: Clean up local cache file
    console.log('[STEP 9] Cleaning up local cache file');
    try {
      await FileSystem.deleteAsync(file.localUri, { idempotent: true });
      console.log('[STEP 9 SUCCESS] Local file deleted');
    } catch (deleteErr) {
      console.log('[STEP 9 WARNING] Failed to delete local file:', deleteErr.message);
      // Don't throw - upload succeeded, just couldn't clean up
    }

    console.log('========== IMAGE UPLOAD END (SUCCESS) ==========');
    return urlData.publicUrl;

  } catch (error) {
    console.log('========== IMAGE UPLOAD END (ERROR) ==========');
    console.log('[EXCEPTION]', {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
    });

    throw error;
  }
}

/**
 * رفع مجموعة صور
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
    console.log('Upload failed:', error.message);
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
