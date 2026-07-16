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
import { addProduct } from '../../services/productService';
import { uploadMultipleImages } from '../../services/uploadService';

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

export default function SellWizardScreen({ lang, user, onBack, onPublished }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const CurrentStep = STEP_COMPONENTS[step];
  const isLastStep = step === STEP_COMPONENTS.length - 1;

  const goNext = () => {
    const error = validateStep(step, form);
    if (error) {
      Alert.alert('تنبيه', error);
      return;
    }
    if (!isLastStep) setStep(step + 1);
  };

  const goBack = () => {
    if (step === 0) {
      onBack && onBack();
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('تنبيه', 'لازم تسجل دخول الأول عشان تنشر منتج.');
      return;
    }

    setLoading(true);

    try {
      // form.images عبارة عن مصفوفة URIs محلية من الجهاز - لازم نرفعها الأول
      const imageFiles = form.images.map((uri) => ({ uri }));
      const uploadedUrls = await uploadMultipleImages(imageFiles);

      if (uploadedUrls.length === 0) {
        Alert.alert('خطأ', 'حصلت مشكلة في رفع الصور. حاول تاني.');
        setLoading(false);
        return;
      }

      const product = {
        user_id: user.id,
        title: form.title,
        category: form.category,
        brand: form.brand,
        size: form.size,
        color: form.color,
        condition: form.condition,
        description: form.description,
        price: Number(form.price),
        currency: form.currency,
        images: uploadedUrls,
      };

      const created = await addProduct(product);

      setLoading(false);

      if (created) {
        Alert.alert('تم', 'اتنشر المنتج بنجاح!');
        setForm(INITIAL_FORM);
        setStep(0);
        onPublished ? onPublished(created) : (onBack && onBack());
      } else {
        Alert.alert('خطأ', 'حصلت مشكلة في نشر المنتج. حاول تاني.');
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('خطأ', err.message || 'حصلت مشكلة غير متوقعة.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <SellProgress step={step} />
        <CurrentStep form={form} setForm={setForm} />
      </ScrollView>

      <SellButtons
        step={step}
        totalSteps={STEP_COMPONENTS.length}
        loading={loading}
        onBack={goBack}
        onNext={goNext}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}
