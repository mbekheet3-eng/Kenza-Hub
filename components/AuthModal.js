import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { TRANSLATIONS } from '../translations';
import { signIn, signUp, signInWithGoogle } from '../services/auth';

export default function AuthModal({ visible, closeModal, lang, isRTL, onSuccess }) {
  const t = TRANSLATIONS[lang];
  const [isLogin, setIsLogin] = useState(true);
  const [emailStep, setEmailStep] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setEmailStep(false);
    setLoading(false);
    setShowPassword(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    setIsLogin(true);
    closeModal();
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const session = await signInWithGoogle();
      if (session) {
        handleClose();
        if (onSuccess) onSuccess();
      }
      // لو session طلعت null معناها المستخدم لغى العملية بنفسه - من غير رسالة خطأ
    } catch (error) {
      Alert.alert(t.error, error.message || t.loginError);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!isLogin && !name) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }
    if (!email || !password) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }
    if (password.length < 6) {
      Alert.alert(t.error, t.passwordMinLength);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      Alert.alert(
        t.error,
        isLogin ? t.loginError : t.signupError
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>

            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            {emailStep && (
              <TouchableOpacity style={styles.backBtn} onPress={() => setEmailStep(false)}>
                <Text style={styles.backBtnText}>←</Text>
              </TouchableOpacity>
            )}

            <ScrollView
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Image
                source={{ uri: 'https://i.postimg.cc/CK0hVx1Y/image-3.jpg' }}
                style={styles.logoImg}
                resizeMode="contain"
              />

              <Text style={styles.modalTitle}>
                {isLogin ? t.modalTitleLogin : t.modalTitleSignup}
              </Text>

              {!emailStep && !isLogin && (
                <Text style={styles.modalSubtitle}>{t.modalSubtitleSignup}</Text>
              )}

              {!emailStep ? (
                <View style={{ width: '100%', marginTop: 20 }}>

                  {/* زرار Google */}
                  <TouchableOpacity
                    style={[styles.authBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    onPress={handleGoogleAuth}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <ActivityIndicator color={COLORS.navy} />
                    ) : (
                      <>
                        <View style={styles.googleIconWrap}>
                          <Text style={styles.googleG}>G</Text>
                        </View>
                        <Text style={styles.authBtnText}>{t.google}</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* زرار Apple */}
                  <TouchableOpacity
                    style={[styles.authBtn, styles.appleBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    onPress={() => Alert.alert('Apple', 'قريبًا')}
                  >
                    <View style={styles.appleIconWrap}>
                      <Text style={styles.appleIcon}></Text>
                    </View>
                    <Text style={[styles.authBtnText, { color: COLORS.white }]}>{t.apple}</Text>
                  </TouchableOpacity>

                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>{t.or}</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity
                    style={{ alignSelf: 'center', marginTop: 4 }}
                    onPress={() => setEmailStep(true)}
                  >
                    <Text style={styles.emailLink}>{t.email}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ alignSelf: 'center', marginTop: 16 }}
                    onPress={toggleMode}
                  >
                    <Text style={styles.switchLink}>
                      {isLogin ? t.noAccount : t.hasAccount}
                    </Text>
                  </TouchableOpacity>
                </View>

              ) : (
                <View style={{ width: '100%', marginTop: 20 }}>

                  {!isLogin && (
                    <>
                      <Text style={[styles.inputLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                        {t.nameLabel}
                      </Text>
                      <TextInput
                        style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                        placeholder={t.namePlaceholder}
                        placeholderTextColor={COLORS.gray}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                      />
                    </>
                  )}

                  <Text style={[styles.inputLabel, { textAlign: isRTL ? 'right' : 'left', marginTop: 16 }]}>
                    {t.emailLabel}
                  </Text>
                  <TextInput
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    placeholder={t.emailPlaceholder}
                    placeholderTextColor={COLORS.gray}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Text style={[styles.inputLabel, { textAlign: isRTL ? 'right' : 'left', marginTop: 16 }]}>
                    {t.passwordLabel}
                  </Text>
                  <View style={styles.passwordWrap}>
                    <TextInput
                      style={[styles.passwordInput, { textAlign: isRTL ? 'right' : 'left' }]}
                      placeholder={t.passwordPlaceholder}
                      placeholderTextColor={COLORS.gray}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                  </View>

                  {isLogin && (
                    <TouchableOpacity
                      style={{ alignSelf: isRTL ? 'flex-start' : 'flex-end', marginTop: 8 }}
                      onPress={() => Alert.alert('', 'قريبًا')}
                    >
                      <Text style={styles.forgotLink}>{t.forgotPassword}</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.continueBtn, { opacity: email && password ? 1 : 0.5 }]}
                    disabled={(!email || !password) || loading}
                    onPress={handleEmailAuth}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text style={styles.continueBtnText}>
                        {isLogin ? t.loginButton : t.signupButton}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity style={{ alignSelf: 'center', marginTop: 16 }} onPress={toggleMode}>
                    <Text style={styles.switchLink}>
                      {isLogin ? t.noAccount : t.hasAccount}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  closeBtn: { position: 'absolute', top: 18, right: 18, zIndex: 10 },
  closeBtnText: { fontSize: 20, color: COLORS.navy },
  backBtn: { position: 'absolute', top: 18, left: 18, zIndex: 10 },
  backBtnText: { fontSize: 22, color: COLORS.navy },
  logoImg: { width: 90, height: 90, marginTop: 8, marginBottom: 12 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.navy, textAlign: 'center', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginTop: 6, marginBottom: 4 },
  authBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    width: '100%',
    paddingVertical: 14,
    marginBottom: 10,
  },
  appleBtn: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  googleIconWrap: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center', marginHorizontal: 10,
  },
  googleG: { fontWeight: 'bold', color: '#EA4335', fontSize: 15 },
  appleIconWrap: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 10,
  },
  appleIcon: { color: COLORS.white, fontSize: 20 },
  authBtnText: { fontSize: 15, color: COLORS.navy, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.lightGray },
  dividerText: { marginHorizontal: 10, color: COLORS.gray, fontSize: 13 },
  emailLink: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  switchLink: { color: COLORS.navy, fontSize: 13, textDecorationLine: 'underline' },
  forgotLink: { color: COLORS.primary, fontSize: 13 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.navy, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.lightGray, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: COLORS.navy,
    backgroundColor: COLORS.surface, width: '100%',
  },
  passwordWrap: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.lightGray,
    borderRadius: 12, backgroundColor: COLORS.surface, width: '100%',
  },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: COLORS.navy },
  eyeBtn: { paddingHorizontal: 14 },
  eyeIcon: { fontSize: 18 },
  continueBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 24, width: '100%',
  },
  continueBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});