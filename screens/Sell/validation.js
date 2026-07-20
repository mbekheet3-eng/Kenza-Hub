// screens/sell/validation.js

const MESSAGES = {
  ar: {
    image: 'من فضلك ضيف صورة واحدة على الأقل.',
    category: 'من فضلك اختار تصنيف.',
    brand: 'من فضلك اختار ماركة.',
    title: 'العنوان لازم يكون 3 حروف على الأقل.',
    size: 'من فضلك اختار مقاس.',
    color: 'من فضلك اختار لون.',
    condition: 'من فضلك اختار حالة المنتج.',
    description: 'الوصف لازم يكون 10 حروف على الأقل.',
    price: 'من فضلك اكتب السعر.',
    priceInvalid: 'من فضلك اكتب سعر صحيح.',
  },
  en: {
    image: 'Please add at least one image.',
    category: 'Please choose a category.',
    brand: 'Please select a brand.',
    title: 'Title must be at least 3 characters.',
    size: 'Please select a size.',
    color: 'Please select a color.',
    condition: 'Please select the item condition.',
    description: 'Description must be at least 10 characters.',
    price: 'Please enter a price.',
    priceInvalid: 'Please enter a valid price.',
  },
  fr: {
    image: 'Veuillez ajouter au moins une image.',
    category: 'Veuillez choisir une catégorie.',
    brand: 'Veuillez sélectionner une marque.',
    title: 'Le titre doit contenir au moins 3 caractères.',
    size: 'Veuillez sélectionner une taille.',
    color: 'Veuillez sélectionner une couleur.',
    condition: 'Veuillez sélectionner l\'état de l\'article.',
    description: 'La description doit contenir au moins 10 caractères.',
    price: 'Veuillez entrer un prix.',
    priceInvalid: 'Veuillez entrer un prix valide.',
  },
};

const t = (lang) => MESSAGES[lang] || MESSAGES.ar;

export function validateImages(form, lang = 'ar') {
  if (!form.images || form.images.length === 0) {
    return t(lang).image;
  }
  return null;
}

export function validateCategory(form, lang = 'ar') {
  if (!form.categoryId) {
    return t(lang).category;
  }
  return null;
}

export function validateBrand(form, lang = 'ar') {
  if (!form.brand || form.brand.trim() === '') {
    return t(lang).brand;
  }
  return null;
}

export function validateDetails(form, lang = 'ar') {
  if (!form.title || form.title.trim().length < 3) {
    return t(lang).title;
  }

  if (!form.size) {
    return t(lang).size;
  }

  if (!form.color) {
    return t(lang).color;
  }

  if (!form.condition) {
    return t(lang).condition;
  }

  return null;
}

export function validateDescription(form, lang = 'ar') {
  if (!form.description || form.description.trim().length < 10) {
    return t(lang).description;
  }

  return null;
}

export function validatePrice(form, lang = 'ar') {
  if (!form.price) {
    return t(lang).price;
  }

  const value = Number(form.price);

  if (isNaN(value) || value <= 0) {
    return t(lang).priceInvalid;
  }

  return null;
}

export function validateStep(step, form, lang = 'ar') {
  switch (step) {
    case 0:
      return validateImages(form, lang);

    case 1:
      return validateCategory(form, lang);

    case 2:
      return validateBrand(form, lang);

    case 3:
      return validateDetails(form, lang);

    case 4:
      return validateDescription(form, lang);

    case 5:
      return validatePrice(form, lang);

    default:
      return null;
  }
}

export function validateForm(form, lang = 'ar') {
  return (
    validateImages(form, lang) ||
    validateCategory(form, lang) ||
    validateBrand(form, lang) ||
    validateDetails(form, lang) ||
    validateDescription(form, lang) ||
    validatePrice(form, lang)
  );
}
