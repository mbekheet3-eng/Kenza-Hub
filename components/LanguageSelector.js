import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { TRANSLATIONS, LANGUAGE_ORDER, FLAGS } from '../translations';

export default function LanguageSelector({
  lang,
  isRTL,
  langMenuVisible,
  setLangMenuVisible,
  selectLang,
}) {
  const t = TRANSLATIONS[lang];

  return (
    <>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.langSelector, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          onPress={() => setLangMenuVisible(true)}
        >
          <Text style={styles.langFlag}>{FLAGS[lang]}</Text>
          <Text style={styles.langText}>{t.label}</Text>
          <Text style={styles.langChevron}>▾</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={langMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.langOverlay}
          activeOpacity={1}
          onPress={() => setLangMenuVisible(false)}
        >
          <View style={styles.langMenu}>
            {LANGUAGE_ORDER.map((code) => (
              <TouchableOpacity
                key={code}
                style={styles.langOption}
                onPress={() => selectLang(code)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.langOptionFlag}>{FLAGS[code]}</Text>
                  <Text style={code === lang ? styles.langOptionTextActive : styles.langOptionText}>
                    {TRANSLATIONS[code].label}
                  </Text>
                </View>
                {code === lang && <Text style={styles.langCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
topBar: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 16,   // ← بقى 16 بدل 4
  },
  langSelector: {
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  langFlag: { fontSize: 18, marginRight: 6 },
  langText: { fontSize: 14, color: COLORS.navy, fontWeight: '600', marginHorizontal: 4 },
  langChevron: { fontSize: 12, color: COLORS.navy, marginLeft: 4 },

  langOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  langMenu: {
    position: 'absolute',
    top: 62,
    left: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 6,
    width: 180,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  langOptionFlag: { fontSize: 18, marginRight: 10 },
  langOptionText: { fontSize: 14, color: COLORS.navy },
  langOptionTextActive: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  langCheck: { color: COLORS.primary, fontWeight: 'bold' },
});
