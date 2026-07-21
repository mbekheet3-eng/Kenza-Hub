// screens/Sell/constants.js

export const MAX_IMAGES = 8;

export const BRANDS = [
  'Zara',
  'H&M',
  'LC Waikiki',
  'Defacto',
  'Nike',
  'Adidas',
  'Puma',
  'Shein',
  'American Eagle',
  'Levi\'s',
  'Guess',
  'Tommy Hilfiger',
  'Calvin Klein',
  'Mango',
  'Other',
];

export const CONDITIONS = [
  'New with tags',
  'Like new',
  'Very good',
  'Good',
  'Fair',
];

// NOTE: SIZES has been moved to data/sizes.js for category-specific mapping.
// If you need sizes here for backward compatibility, import from data/sizes.js

export const COLORS = [
  'Black',
  'White',
  'Gray',
  'Blue',
  'Navy',
  'Red',
  'Pink',
  'Purple',
  'Green',
  'Yellow',
  'Orange',
  'Brown',
  'Beige',
  'Gold',
  'Silver',
  'Multi Color',
];

export const CURRENCIES = [
  'EGP',
];

export const CONDITION_LABELS = {
  ar: {
    'New with tags': 'جديد بالتيكيت',
    'Like new': 'زي الجديد',
    'Very good': 'حالة كويسة جدًا',
    'Good': 'حالة كويسة',
    'Fair': 'حالة مقبولة',
  },
  en: {
    'New with tags': 'New with tags',
    'Like new': 'Like new',
    'Very good': 'Very good',
    'Good': 'Good',
    'Fair': 'Fair',
  },
  fr: {
    'New with tags': 'Neuf avec étiquette',
    'Like new': 'Comme neuf',
    'Very good': 'Très bon état',
    'Good': 'Bon état',
    'Fair': 'État correct',
  },
};

export const COLOR_LABELS = {
  ar: {
    Black: 'أسود', White: 'أبيض', Gray: 'رمادي', Blue: 'أزرق', Navy: 'كحلي',
    Red: 'أحمر', Pink: 'وردي', Purple: 'بنفسجي', Green: 'أخضر', Yellow: 'أصفر',
    Orange: 'برتقالي', Brown: 'بني', Beige: 'بيج', Gold: 'ذهبي', Silver: 'فضي',
    'Multi Color': 'ألوان متعددة',
  },
  en: {
    Black: 'Black', White: 'White', Gray: 'Gray', Blue: 'Blue', Navy: 'Navy',
    Red: 'Red', Pink: 'Pink', Purple: 'Purple', Green: 'Green', Yellow: 'Yellow',
    Orange: 'Orange', Brown: 'Brown', Beige: 'Beige', Gold: 'Gold', Silver: 'Silver',
    'Multi Color': 'Multi Color',
  },
  fr: {
    Black: 'Noir', White: 'Blanc', Gray: 'Gris', Blue: 'Bleu', Navy: 'Bleu marine',
    Red: 'Rouge', Pink: 'Rose', Purple: 'Violet', Green: 'Vert', Yellow: 'Jaune',
    Orange: 'Orange', Brown: 'Marron', Beige: 'Beige', Gold: 'Doré', Silver: 'Argenté',
    'Multi Color': 'Multicolore',
  },
};

// NOTE: SIZE_LABELS has been moved to data/sizes.js for category-specific mapping.

export const INITIAL_FORM = {
  images: [],
  category: '',
  categoryId: null,
  brand: '',
  title: '',
  size: '',
  color: '',
  condition: '',
  description: '',
  price: '',
  currency: 'EGP',
};
