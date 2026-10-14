/**
 * Utility for parsing and formatting product prices, original/MRP prices, and discounts.
 */

export const getProductPriceInfo = (product) => {
  if (!product) {
    return {
      price: 0,
      currentPrice: 0,
      originalPrice: null,
      isDiscounted: false,
      hasDiscount: false,
      discountPercent: 0,
      cleanDescription: ''
    };
  }

  const sellingPrice = Number(product.price) || 0;
  let originalPrice = product.original_price != null ? Number(product.original_price) : null;
  let isDiscounted = Boolean(product.is_discounted);
  const rawDescription = product.description || '';

  // Fallback check: discount metadata stored in HTML comment inside description
  if (rawDescription.includes('<!--discount:')) {
    try {
      const match = rawDescription.match(/<!--discount:(.*?)-->/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        if (parsed.is_discounted) {
          isDiscounted = true;
          if (parsed.original_price != null) {
            originalPrice = Number(parsed.original_price);
          }
        } else if (parsed.is_discounted === false) {
          isDiscounted = false;
          originalPrice = null;
        }
      }
    } catch (err) {
      console.warn('Failed to parse discount metadata from description:', err);
    }
  }

  // Clean description without metadata comment
  const cleanDescription = rawDescription.replace(/<!--discount:.*?-->/g, '').trim();

  // If discount is enabled and originalPrice > sellingPrice
  if (isDiscounted && originalPrice && originalPrice > sellingPrice) {
    const discountPercent = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
    return {
      price: sellingPrice,
      currentPrice: sellingPrice,
      originalPrice,
      isDiscounted: true,
      hasDiscount: true,
      discountPercent,
      cleanDescription
    };
  }

  return {
    price: sellingPrice,
    currentPrice: sellingPrice,
    originalPrice: null,
    isDiscounted: false,
    hasDiscount: false,
    discountPercent: 0,
    cleanDescription
  };
};
