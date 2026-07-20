// screens/sell/StepCategory.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import styles from './SellStyles';
import { supabase } from '../../services/supabase';

const LABELS = {
  ar: { title: 'اختار التصنيف', subtitle: 'اختار التصنيف الأنسب للقطعة بتاعتك.' },
  en: { title: 'Choose Category', subtitle: 'Select the category that best matches your item.' },
  fr: { title: 'Choisir la catégorie', subtitle: 'Sélectionnez la catégorie qui correspond le mieux à votre article.' },
};

export default function StepCategory({
  form,
  setForm,
  lang = 'ar',
}) {
  const l = LABELS[lang] || LABELS.ar;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name_en, name_ar, slug')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (isMounted) {
        if (!error && data) {
          setCategories(data);
        }
        setLoading(false);
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // الفئات جاية من الداتابيز وعندها عربي/إنجليزي بس (مفيش عمود فرنساوي)،
  // فبالنسبة للفرنساوي بنستخدم الإنجليزي كبديل.
  const categoryName = (category) =>
    lang === 'ar' ? (category.name_ar || category.name_en) : (category.name_en || category.name_ar);

  const selectCategory = (category) => {
    setForm({
      ...form,
      categoryId: category.id,
      category: category.name_ar || category.name_en,
    });
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>
        {l.title}
      </Text>

      <Text style={styles.subtitle}>
        {l.subtitle}
      </Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.row}>
          {categories.map((category) => {
            const selected = form.categoryId === category.id;

            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.chip,
                  selected && styles.chipSelected,
                ]}
                onPress={() => selectCategory(category)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected && styles.chipTextSelected,
                  ]}
                >
                  {categoryName(category)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
