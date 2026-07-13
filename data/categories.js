// data/categories.js

const CATEGORIES = [
  {
    id: 'women',
    name: {
      ar: 'ملابس نسائية',
      en: 'Women',
      fr: 'Femmes',
    },
    icon: '👗',

    subCategories: [
      { id: 'dress', ar: 'فساتين', en: 'Dresses', fr: 'Robes' },
      { id: 'abaya', ar: 'عبايات', en: 'Abayas', fr: 'Abayas' },
      { id: 'hijab', ar: 'حجاب', en: 'Hijab', fr: 'Hijab' },
      { id: 'blouse', ar: 'بلوزات', en: 'Blouses', fr: 'Chemisiers' },
      { id: 'shirt', ar: 'قمصان', en: 'Shirts', fr: 'Chemises' },
      { id: 'tshirt', ar: 'تي شيرت', en: 'T-Shirts', fr: 'T-shirts' },
      { id: 'hoodie', ar: 'هودي', en: 'Hoodies', fr: 'Sweats à capuche' },
      { id: 'jacket', ar: 'جاكيت', en: 'Jackets', fr: 'Vestes' },
      { id: 'coat', ar: 'معطف', en: 'Coats', fr: 'Manteaux' },
      { id: 'jeans', ar: 'جينز', en: 'Jeans', fr: 'Jeans' },
      { id: 'pants', ar: 'بنطلونات', en: 'Pants', fr: 'Pantalons' },
      { id: 'skirts', ar: 'جيبات', en: 'Skirts', fr: 'Jupes' },
      { id: 'shorts', ar: 'شورتات', en: 'Shorts', fr: 'Shorts' },
      { id: 'sportswear', ar: 'ملابس رياضية', en: 'Sportswear', fr: 'Sport' },
      { id: 'swimwear', ar: 'ملابس سباحة', en: 'Swimwear', fr: 'Maillots' },
      { id: 'sleepwear', ar: 'ملابس نوم', en: 'Sleepwear', fr: 'Pyjamas' },
      { id: 'underwear', ar: 'ملابس داخلية', en: 'Underwear', fr: 'Sous-vêtements' },
    ],
  },

  {
    id: 'men',
    name: {
      ar: 'ملابس رجالية',
      en: 'Men',
      fr: 'Hommes',
    },
    icon: '👔',

    subCategories: [
      { id: 'shirt', ar: 'قمصان', en: 'Shirts', fr: 'Chemises' },
      { id: 'tshirt', ar: 'تي شيرت', en: 'T-Shirts', fr: 'T-shirts' },
      { id: 'hoodie', ar: 'هودي', en: 'Hoodies', fr: 'Sweats' },
      { id: 'jacket', ar: 'جاكيت', en: 'Jackets', fr: 'Vestes' },
      { id: 'coat', ar: 'معطف', en: 'Coats', fr: 'Manteaux' },
      { id: 'jeans', ar: 'جينز', en: 'Jeans', fr: 'Jeans' },
      { id: 'pants', ar: 'بنطلونات', en: 'Pants', fr: 'Pantalons' },
      { id: 'shorts', ar: 'شورتات', en: 'Shorts', fr: 'Shorts' },
      { id: 'sportswear', ar: 'ملابس رياضية', en: 'Sportswear', fr: 'Sport' },
      { id: 'suits', ar: 'بدل', en: 'Suits', fr: 'Costumes' },
      { id: 'underwear', ar: 'ملابس داخلية', en: 'Underwear', fr: 'Sous-vêtements' },
      { id: 'sleepwear', ar: 'ملابس نوم', en: 'Sleepwear', fr: 'Pyjamas' },
    ],
  },

  {
    id: 'kids',
    name: {
      ar: 'ملابس أطفال',
      en: 'Kids',
      fr: 'Enfants',
    },
    icon: '🧒',

    subCategories: [
      { id: 'baby', ar: 'رضع', en: 'Baby', fr: 'Bébé' },
      { id: 'boys', ar: 'أولاد', en: 'Boys', fr: 'Garçons' },
      { id: 'girls', ar: 'بنات', en: 'Girls', fr: 'Filles' },
      { id: 'school', ar: 'ملابس مدرسة', en: 'School', fr: 'École' },
      { id: 'sportswear', ar: 'ملابس رياضية', en: 'Sportswear', fr: 'Sport' },
    ],
  },

  {
    id: 'shoes',
    name: {
      ar: 'أحذية',
      en: 'Shoes',
      fr: 'Chaussures',
    },
    icon: '👟',

    subCategories: [
      { id: 'sneakers', ar: 'سنيكرز', en: 'Sneakers', fr: 'Sneakers' },
      { id: 'running', ar: 'جري', en: 'Running', fr: 'Running' },
      { id: 'boots', ar: 'بوت', en: 'Boots', fr: 'Bottes' },
      { id: 'heels', ar: 'كعب', en: 'Heels', fr: 'Talons' },
      { id: 'sandals', ar: 'صنادل', en: 'Sandals', fr: 'Sandales' },
      { id: 'slippers', ar: 'شبشب', en: 'Slippers', fr: 'Pantoufles' },
    ],
  },

  {
    id: 'bags',
    name: {
      ar: 'شنط',
      en: 'Bags',
      fr: 'Sacs',
    },
    icon: '👜',

    subCategories: [
      { id: 'handbag', ar: 'شنطة يد', en: 'Handbag', fr: 'Sac à main' },
      { id: 'backpack', ar: 'حقيبة ظهر', en: 'Backpack', fr: 'Sac à dos' },
      { id: 'travel', ar: 'حقائب سفر', en: 'Travel', fr: 'Voyage' },
      { id: 'wallet', ar: 'محفظة', en: 'Wallet', fr: 'Portefeuille' },
    ],
  },

  {
    id: 'accessories',
    name: {
      ar: 'إكسسوارات',
      en: 'Accessories',
      fr: 'Accessoires',
    },
    icon: '⌚',

    subCategories: [
      { id: 'watch', ar: 'ساعات', en: 'Watches', fr: 'Montres' },
      { id: 'belt', ar: 'أحزمة', en: 'Belts', fr: 'Ceintures' },
      { id: 'cap', ar: 'كابات', en: 'Caps', fr: 'Casquettes' },
      { id: 'glasses', ar: 'نظارات', en: 'Glasses', fr: 'Lunettes' },
      { id: 'jewelry', ar: 'مجوهرات', en: 'Jewelry', fr: 'Bijoux' },
    ],
  },
];

export default CATEGORIES;