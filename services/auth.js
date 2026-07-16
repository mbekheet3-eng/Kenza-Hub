import { supabase } from './supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

// لازم يتنادى مرة واحدة عشان يقفل نافذة المتصفح صح لما يرجع للتطبيق
WebBrowser.maybeCompleteAuthSession();

// رابط الرجوع للتطبيق بعد ما المستخدم يسجل دخول من جوجل
const redirectTo = Linking.createURL('auth/callback');

// بياخد الرابط اللي رجع بيه المستخدم للتطبيق ويطلع منه التوكنات ويفتح الجلسة
const createSessionFromUrl = async (url) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;

  if (!access_token) return null;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
  return data.session;
};

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

// تسجيل الدخول بجوجل (فعّال)
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(
    data?.url ?? '',
    redirectTo
  );

  if (result.type === 'success' && result.url) {
    const session = await createSessionFromUrl(result.url);
    return session;
  }

  // المستخدم لغى تسجيل الدخول أو قفل المتصفح - مش خطأ، بس مفيش نتيجة
  return null;
};

// تسجيل الدخول بأبل - جاهز بالكود بس متوقف مؤقتًا (isEnabled = false)
// لتفعيله لاحقًا: هيحتاج تثبيت expo-apple-authentication + تفعيل Apple كـ provider في Supabase
export const APPLE_LOGIN_ENABLED = false;
export const signInWithApple = async () => {
  throw new Error('تسجيل الدخول بأبل لسه مش مفعّل.');
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