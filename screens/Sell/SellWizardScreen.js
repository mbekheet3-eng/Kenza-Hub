// screens/Sell/SellWizardScreen.js
// الحاوية الرئيسية لويزارد البيع - بتجمع كل الخطوات مع بعض

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Alert } from 'react-native';

import SellProgress from './SellProgress';
import SellButtons from './SellButtons';
import StepImages from './StepImages';
import StepCategory from './StepCategory';
import StepBrand from './StepBrand';
import StepDetails from './StepDetails';
import StepDescription from './StepDescription';
import StepPrice from './StepPrice';
import StepReview from './StepReview';
import { validateStep } from './validation';
import { INITIAL_FORM } from './constants';
import { addProduct, addProductImages } from '../../services/productService';
import { getOrCreateSellerProfileId } from '../../services/sellerProfile';
import { uploadMultipleImages } from '../../services/uploadService';
import { isHomeCategory } from '../../data/sizes';

// ترتيب الخطوات لازم يتطابق مع STEPS في SellProgress.js
// ومع رقم الخطوة (index) في validateStep داخل validation.js
const STEP_COMPONENTS = [
  StepImages,      // 0 - Photos
  StepCategory,    // 1 - Category
  StepBrand,        // 2 - Brand
  StepDetails,      // 3 - Details
  StepDescription,  // 4 - Description
  StepPrice,        // 5 - Price
  StepReview,        // 6 - Review
];

const ALERTS = {
  ar: {
    notice: 'تنبيه',
    error: 'خطأ',
    done: 'تم',
    loginRequired: 'لازم تسجل دخول الأول عشان تنشر منتج.',
    uploadFailed: 'حصلت مشكلة في رفع الصور. حاول تاني.',
    publishFailed: 'حصلت مشكلة في نشر المنتج. حاول تاني.',
    published: 'اتنشر المنتج بنجاح!',
    unexpected: 'حصلت مشكلة غير متوقعة.',
  },
  en: {
    notice: 'Notice',
    error: 'Error',
    done: 'Done',
    loginRequired: 'You need to log in first to publish a product.',
    uploadFailed: 'There was a problem uploading the photos. Try again.',
    publishFailed: 'There was a problem publishing the product. Try again.',
    published: 'Product published successfully!',
    unexpected: 'Something unexpected happened.',
  },
  fr: {
    notice: 'Avis',
    error: 'Erreur',
    done: 'Terminé',
    loginRequired: 'Vous devez vous connecter avant de publier un produit.',
    uploadFailed: 'Un problème est survenu lors du téléchargement des photos. Réessayez.',
    publishFailed: 'Un problème est survenu lors de la publication du produit. Réessayez.',
    published: 'Produit publié avec succès !',
    unexpected: 'Une erreur inattendue est survenue.',
  },
};

/**
 * Format upload error into a readable message for user
 * Extracts: message, statusCode, error, details, hint
 */
function formatUploadError(err) {
  console.log('[ERROR] Full error object:', JSON.stringify(err, null, 2));

  // Extract upload error details if available
  const uploadErr = err.uploadError || {};
  
  // Build formatted message with available fields only
  const parts = [];

  if (uploadErr.message) {
    parts.push(`Message:\n${uploadErr.message}`);
  }

  if (uploadErr.statusCode) {
    parts.push(`Status: ${uploadErr.statusCode}`);
  }

  if (uploadErr.error) {
    parts.push(`Error: ${uploadErr.error}`);
  }

  if (uploadErr.details) {
    parts.push(`Details:\n${uploadErr.details}`);
  }

  if (uploadErr.hint) {
    parts.push(`Hint:\n${uploadErr.hint}`);
  }

  // If no structured error, use message
  if (parts.length === 0) {
    return err.message || 'Unknown error occurred';
  }

  return parts.join('\n\n');
}

export default function SellWizardScreen({ lang = 'ar', user, onBack, onPublished }) {
  const a = ALERTS[lang] || ALERTS.ar;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const CurrentStep = STEP_COMPONENTS[step];
  const isLastStep = step === STEP_COMPONENTS.length - 1;

  const goNext = () => {
    const error = validateStep(step, form, lang);
    if (error) {
      Alert.alert(a.notice, error);
      return;
    }

    let nextStep = step + 1;

    // Skip StepBrand (step 2) if home category
    // Jump directly from StepCategory (step 1) to StepDetails (step 3)
    if (step === 1 && isHomeCategory(form.categoryId)) {
      nextStep = 3;
    }

    if (nextStep < STEP_COMPONENTS.length) {
      setStep(nextStep);
    }
  };

  const goBack = () => {
    if (step === 0) {
      onBack && onBack();
    } else {
      // When going back from StepDetails (step 3) after home category,
      // return to StepCategory (step 1), skipping StepBrand (step 2)
      let previousStep = step - 1;

      if (step === 3 && isHomeCategory(form.categoryId)) {
        previousStep = 1;
      }

      setStep(previousStep);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert(a.notice, a.loginRequired);
      return;
    }

    setLoading(true);

    try {
      // 1) لازم يكون عنده seller_profile — لو مفيش، بينشئ واحد تلقائيًا
      const sellerProfileId = await getOrCreateSellerProfileId(user);

      // 2) form.images عبارة عن مصفوفة URIs محلية من الجهاز - لازم نرفعها الأول
      const imageFiles = form.images.map((uri) => ({ uri }));
      const uploadedUrls = await uploadMultipleImages(imageFiles);

      if (uploadedUrls.length === 0) {
        Alert.alert(a.error, a.uploadFailed);
        setLoading(false);
        return;
      }

      // 3) الأعمدة الفعلية في جدول products (title/description ثنائية اللغة،
      // مفيش عمود images - الصور بتتحفظ في product_images بعد الإنشاء)
      const product = {
        seller_id: sellerProfileId,
        category_id: form.categoryId,
        title_en: form.title,
        title_ar: form.title,
        description_en: form.description,
        description_ar: form.description,
        price: Number(form.price),
        currency: form.currency,
        condition: form.condition,
        size: form.size,
        color: form.color,
        brand: form.brand,
      };

      const created = await addProduct(product);

      if (!created) {
        Alert.alert(a.error, a.publishFailed);
        setLoading(false);
        return;
      }

      // 4) حفظ روابط الصور في product_images بعد ما المنتج اتنشأ
      await addProductImages(created.id, uploadedUrls);

      setLoading(false);
      Alert.alert(a.done, a.published);
      setForm(INITIAL_FORM);
      setStep(0);
      onPublished ? onPublished(created) : (onBack && onBack());
    } catch (err) {
      setLoading(false);
      
      // Format and display the error
      const errorMessage = formatUploadError(err);
      
      console.log('[handleSubmit] Caught error, displaying to user');
      
      Alert.alert(a.error, errorMessage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <SellProgress step={step} lang={lang} />
        <CurrentStep form={form} setForm={setForm} lang={lang} />
      </ScrollView>

      <SellButtons
        step={step}
        totalSteps={STEP_COMPONENTS.length}
        loading={loading}
        onBack={goBack}
        onNext={goNext}
        onSubmit={handleSubmit}
        lang={lang}
      />
    </SafeAreaView>
  );
}
