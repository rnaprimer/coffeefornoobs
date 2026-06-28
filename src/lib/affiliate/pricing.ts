import { ProductMerchant } from './types';

/**
 * Calculates discount percentage and savings.
 */
export function calculateDiscount(currentPrice?: number, originalPrice?: number) {
  if (!currentPrice || !originalPrice || originalPrice <= currentPrice) {
    return { discountPercentage: 0, savings: 0 };
  }

  const savings = originalPrice - currentPrice;
  const discountPercentage = Math.round((savings / originalPrice) * 100);

  return { discountPercentage, savings };
}

/**
 * Formats pricing using Internationalization API.
 */
export function formatPrice(price: number, currency = 'INR'): string {
  const isIndianRupee = currency.toUpperCase() === 'INR';
  const locale = isIndianRupee ? 'en-IN' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Compares prices across merchants to locate deals.
 */
export function compareMerchantPrices(merchants: ProductMerchant[]) {
  const activeSellers = merchants.filter(m => m.status === 'active' && m.current_price !== undefined);
  if (activeSellers.length === 0) return null;

  let minSeller = activeSellers[0];
  let maxSeller = activeSellers[0];

  activeSellers.forEach(seller => {
    if ((seller.current_price || 0) < (minSeller.current_price || 0)) {
      minSeller = seller;
    }
    if ((seller.current_price || 0) > (maxSeller.current_price || 0)) {
      maxSeller = seller;
    }
  });

  return {
    lowestPrice: minSeller.current_price,
    lowestMerchant: minSeller,
    highestPrice: maxSeller.current_price,
    highestMerchant: maxSeller,
    count: activeSellers.length
  };
}
