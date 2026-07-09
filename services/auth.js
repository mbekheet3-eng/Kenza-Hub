import { supabase } from './supabase';

// تسجيل حساب جديد
export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });
  if (error) throw error;
  return data;
};

// تسجيل الدخول
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

// تسجيل الخروج
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// جلب المستخدم الحالي
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// الاستماع لتغييرات حالة التسجيل
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
};