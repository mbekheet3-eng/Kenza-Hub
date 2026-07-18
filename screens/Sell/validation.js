// screens/sell/validation.js

export function validateImages(form) {
  if (!form.images || form.images.length === 0) {
    return 'Please add at least one image.';
  }
  return null;
}

export function validateCategory(form) {
  if (!form.categoryId) {
    return 'Please choose a category.';
  }
  return null;
}

export function validateBrand(form) {
  if (!form.brand || form.brand.trim() === '') {
    return 'Please select a brand.';
  }
  return null;
}

export function validateDetails(form) {
  if (!form.title || form.title.trim().length < 3) {
    return 'Title must be at least 3 characters.';
  }

  if (!form.size) {
    return 'Please select a size.';
  }

  if (!form.color) {
    return 'Please select a color.';
  }

  if (!form.condition) {
    return 'Please select the item condition.';
  }

  return null;
}

export function validateDescription(form) {
  if (!form.description || form.description.trim().length < 10) {
    return 'Description must be at least 10 characters.';
  }

  return null;
}

export function validatePrice(form) {
  if (!form.price) {
    return 'Please enter a price.';
  }

  const value = Number(form.price);

  if (isNaN(value) || value <= 0) {
    return 'Please enter a valid price.';
  }

  return null;
}

export function validateStep(step, form) {
  switch (step) {
    case 0:
      return validateImages(form);

    case 1:
      return validateCategory(form);

    case 2:
      return validateBrand(form);

    case 3:
      return validateDetails(form);

    case 4:
      return validateDescription(form);

    case 5:
      return validatePrice(form);

    default:
      return null;
  }
}

export function validateForm(form) {
  return (
    validateImages(form) ||
    validateCategory(form) ||
    validateBrand(form) ||
    validateDetails(form) ||
    validateDescription(form) ||
    validatePrice(form)
  );
}