import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../theme/colors';
import { TRANSLATIONS } from '../translations';
import LanguageSelector from '../components/LanguageSelector';
import HeroCarousel from '../components/HeroCarousel';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';

export default function WelcomeScreen({ lang, setLang, onNavigateHome }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [langMenuVisible, setLangMenuVisible] = useState(false);

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const selectLang = (code) => {
    setLang(code);
    setLangMenuVisible(false);
  };

  return (
    <>
      <LanguageSelector
        lang={lang}
        isRTL={isRTL}
        langMenuVisible={langMenuVisible}
        setLangMenuVisible={setLangMenuVisible}
        selectLang={selectLang}
      />

      <HeroCarousel />

      <View style={styles.bottomSheet}>
        <View>
          <Text style={styles.headline}>{t.headline}</Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.primaryBtnText}>{t.primaryBtn}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.secondaryBtnText}>{t.secondaryBtn}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 8 }}
            onPress={onNavigateHome}
          >
            <Text style={styles.guestLink}>{t.guestBtn}</Text>
          </TouchableOpacity>
        </View>

        <Footer lang={lang} />
      </View>

      <AuthModal
        visible={modalVisible}
        closeModal={() => setModalVisible(false)}
        lang={lang}
        isRTL={isRTL}
        onSuccess={onNavigateHome}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  headline: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 16,
    lineHeight: 32,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.navy,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryBtnText: { color: COLORS.navy, fontSize: 16, fontWeight: 'bold' },
  guestLink: {
    color: COLORS.gray,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});