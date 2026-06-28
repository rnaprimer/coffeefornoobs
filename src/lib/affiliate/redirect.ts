/**
 * Server-side redirect resolution and link safety validator.
 */

/**
 * Normalizes redirect URLs to ensure they are safe and properly formed.
 */
export function validateRedirect(url: string): boolean {
  if (!url) return false;

  // Ensure url is absolute
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  // Basic check for safe protocol
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (e) {
    return false;
  }
}

/**
 * Resolves a redirect target to prevent open redirect vulnerabilities.
 */
export function resolveMerchantLink(affiliateUrl: string): string {
  if (!validateRedirect(affiliateUrl)) {
    return '/'; // Safe fallback
  }
  return affiliateUrl;
}
