// screens/sell/SellStyles.js

import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 14,
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginBottom: 14,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  chipText: {
    color: '#333',
    fontSize: 14,
  },

  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  addImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  addImageText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },

  error: {
    color: '#d32f2f',
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
  },

  reviewCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  reviewLabel: {
    fontWeight: '700',
    color: '#444',
    marginBottom: 4,
  },

  reviewValue: {
    color: '#666',
    marginBottom: 10,
  },
});