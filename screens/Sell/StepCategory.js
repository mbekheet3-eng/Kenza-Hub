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

export default function StepCategory({
  form,
  setForm,
}) {
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
        Choose Category
      </Text>

      <Text style={styles.subtitle}>
        Select the category that best matches your item.
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
                  {category.name_ar || category.name_en}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
