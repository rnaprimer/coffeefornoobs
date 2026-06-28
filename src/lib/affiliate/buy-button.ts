import { ProductMerchant } from './types';

/**
 * Intelligently scores and ranks merchant options for a product to find the best seller.
 * Score factors:
 * 1. Availability (In Stock / Limited Stock = highest, Out of Stock / Discontinued = lowest)
 * 2. Price (lower is better, if current_price exists)
 * 3. Featured flag on ProductMerchant relationship
 * 4. Priority value on ProductMerchant relationship
 */
export function getMerchantOptions(merchants: ProductMerchant[]): ProductMerchant[] {
  if (!merchants || merchants.length === 0) return [];

  return [...merchants].sort((a, b) => {
    // 1. Availability Sort
    const getAvailabilityScore = (status: string) => {
      switch (status) {
        case 'In Stock': return 4;
        case 'Limited Stock': return 3;
        case 'Preorder': return 2;
        case 'Out of Stock': return 1;
        case 'Discontinued': return 0;
        default: return 1;
      }
    };

    const scoreA = getAvailabilityScore(a.availability);
    const scoreB = getAvailabilityScore(b.availability);

    if (scoreA !== scoreB) {
      return scoreB - scoreA; // High score first
    }

    // 2. Price Sort (lowest current_price first)
    if (a.current_price !== undefined && b.current_price !== undefined) {
      if (a.current_price !== b.current_price) {
        return a.current_price - b.current_price;
      }
    } else if (a.current_price !== undefined) {
      return -1; // a has price, b doesn't. a is better.
    } else if (b.current_price !== undefined) {
      return 1;
    }

    // 3. Featured Sort (Featured first)
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    // 4. Priority Sort (higher priority value first)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }

    return 0;
  });
}

/**
 * Returns the single best merchant choice based on sorting scores.
 */
export function getBestMerchant(merchants: ProductMerchant[]): ProductMerchant | null {
  const options = getMerchantOptions(merchants);
  return options.length > 0 ? options[0] : null;
}

/**
 * Resolves an affiliate link, optionally injecting tracking templates or UTMs.
 */
export function resolveAffiliateLink(pm: ProductMerchant, utmSource?: string): string {
  let url = pm.deep_link || pm.affiliate_url;
  
  if (!url) return '#';

  // Inject tracking template if defined in affiliate program
  if (pm.affiliate_programs?.tracking_template) {
    const template = pm.affiliate_programs.tracking_template;
    // Simple replacement logic, e.g. replacing {{url}} with encoded url
    url = template.replace('{{url}}', encodeURIComponent(url));
  }

  // Simple UTM injection if URL is standard
  if (utmSource && (url.startsWith('http://') || url.startsWith('https://'))) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('utm_source', utmSource);
      parsedUrl.searchParams.set('utm_medium', 'affiliate');
      parsedUrl.searchParams.set('utm_campaign', 'coffeefornoobs');
      return parsedUrl.toString();
    } catch (e) {
      // Fallback to original URL if invalid
      return url;
    }
  }

  return url;
}
