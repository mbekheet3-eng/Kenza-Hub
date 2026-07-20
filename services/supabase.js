import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://qvqfzujvcnmquohieevl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_k6-4t7JwPfhKmkX8yym6fw_3GqY-GAB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // detectSessionInUrl لازم تكون false في React Native (مفيش browser URL
    // نتابعه زي الويب)، وده منفصل عن OAuth flow بتاع signInWithGoogle
    // اللي بيتعامل مع الـ redirect يدويًا في services/auth.js
    detectSessionInUrl: false,
  },
});