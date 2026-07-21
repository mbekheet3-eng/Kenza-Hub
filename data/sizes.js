// data/sizes.js
// Category-specific size tables for the Kenza Hub marketplace (Beta).
// Maps Supabase category IDs (from categories table) to their applicable sizes.

// Supabase category IDs:
// clothes: 306789a0-c48c-4fd0-a8c0-779fc0152c81 → Clothing sizes (all clothing)
// shoes:   714a1ff9-9c98-4a56-982c-e084afc9097b → Shoe sizes
// kids:    f61060c7-1185-43d5-9c9e-5df8b397b7fa → Kids sizes (age-based)
// home:    1e69453d-059c-4a7c-a81a-be0fbe9bc9f1 → NO sizes (empty array)

const SIZE_SETS = {
  // Clothing sizes (XS - 3XL) — used for both men's and women's clothing
  '306789a0-c48c-4fd0-a8c0-779fc0152c81': [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '3XL',
    'Free Size',
  ],
  // Shoe sizes (European standard: 35-47)
  '714a1ff9-9c98-4a56-982c-e084afc9097b': [
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    'Free Size',
  ],
  // Kids sizes (age-based: months and years)
  'f61060c7-1185-43d5-9c9e-5df8b397b7fa': [
    '0-3M',
    '3-6M',
    '6-12M',
    '1-2Y',
    '2-3Y',
    '3-4Y',
    '4-5Y',
    '5-6Y',
    '6-7Y',
    '7-8Y',
    '8-10Y',
    '10-12Y',
    '12-14Y',
    'Free Size',
  ],
  // Home category — NO sizes. Sellers describe dimensions in the product description.
  '1e69453d-059c-4a7c-a81a-be0fbe9bc9f1': [],
};

/**
 * Get applicable sizes for a given category ID.
 * Returns an empty array if the category does not use sizes (e.g., home goods).
 * Defaults to clothing sizes if category ID is unknown.
 * @param {string} categoryId - The Supabase category ID
 * @returns {string[]} Array of size strings; empty array = no sizes for this category
 */
export function getSizesForCategory(categoryId) {
  return SIZE_SETS[categoryId] || SIZE_SETS['306789a0-c48c-4fd0-a8c0-779fc0152c81'];
}

/**
 * Multilingual labels for sizes.
 * Arabic translations use market-standard transliterations (XS → إكس سمول, etc.)
 * English and French use their standard forms.
 */
export const SIZE_LABELS = {
  ar: {
    // Clothing sizes
    'XS': 'إكس سمول',
    'S': 'سمول',
    'M': 'ميديوم',
    'L': 'لارج',
    'XL': 'إكس لارج',
    'XXL': '2 إكس لارج',
    '3XL': '3 إكس لارج',
    // Kids sizes
    '0-3M': '0-3 أشهر',
    '3-6M': '3-6 أشهر',
    '6-12M': '6-12 شهر',
    '1-2Y': '1-2 سنة',
    '2-3Y': '2-3 سنة',
    '3-4Y': '3-4 سنة',
    '4-5Y': '4-5 سنة',
    '5-6Y': '5-6 سنة',
    '6-7Y': '6-7 سنة',
    '7-8Y': '7-8 سنة',
    '8-10Y': '8-10 سنة',
    '10-12Y': '10-12 سنة',
    '12-14Y': '12-14 سنة',
    // All categories
    'Free Size': 'مقاس واحد',
  },
  en: {
    'Free Size': 'Free Size',
  },
  fr: {
    'XS': 'XS',
    'S': 'S',
    'M': 'M',
    'L': 'L',
    'XL': 'XL',
    'XXL': '2XL',
    '3XL': '3XL',
    'Free Size': 'Taille unique',
    '0-3M': '0-3 mois',
    '3-6M': '3-6 mois',
    '6-12M': '6-12 mois',
    '1-2Y': '1-2 ans',
    '2-3Y': '2-3 ans',
    '3-4Y': '3-4 ans',
    '4-5Y': '4-5 ans',
    '5-6Y': '5-6 ans',
    '6-7Y': '6-7 ans',
    '7-8Y': '7-8 ans',
    '8-10Y': '8-10 ans',
    '10-12Y': '10-12 ans',
    '12-14Y': '12-14 ans',
  },
};

export default SIZE_SETS;

/**
 * Check if a category is the home category.
 * This is used to determine UI behavior (skip brand step, hide size/color, etc.)
 * @param {string} categoryId - The Supabase category ID
 * @returns {boolean} True if this is the home category
 */
export function isHomeCategory(categoryId) {
  return categoryId === '1e69453d-059c-4a7c-a81a-be0fbe9bc9f1';
}
