/**
 * URL validation and normalization helper functions.
 */

export function normalizeAffiliateLink(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();

  // If it doesn't start with a protocol, default to https
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  return trimmed;
}

export function validateAffiliateLink(url: string): boolean {
  if (!url) return false;
  const normalized = normalizeAffiliateLink(url);

  try {
    const parsed = new URL(normalized);
    // Simple validation: host must exist and protocol must be http/https
    return !!parsed.host && ['http:', 'https:'].includes(parsed.protocol);
  } catch (e) {
    return false;
  }
}

export function validateMerchantDomain(merchantWebsite: string, affiliateUrl: string): boolean {
  if (!merchantWebsite || !affiliateUrl) return false;

  try {
    const merchantHost = new URL(normalizeAffiliateLink(merchantWebsite)).hostname.replace('www.', '');
    const affiliateHost = new URL(normalizeAffiliateLink(affiliateUrl)).hostname.replace('www.', '');

    // Allow subdomains, e.g. "amazon.in" or "associates.amazon.in" contains "amazon.in"
    return affiliateHost.includes(merchantHost) || merchantHost.includes(affiliateHost);
  } catch (e) {
    return false;
  }
}
