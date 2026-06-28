import { AffiliateClick } from './types';

/**
 * Basic analytics utility functions for aggregating clicks.
 */

export function countClicks(clicks: AffiliateClick[]): number {
  return clicks ? clicks.length : 0;
}

export function merchantClicks(clicks: AffiliateClick[]): Record<string, number> {
  const map: Record<string, number> = {};
  if (!clicks) return map;

  clicks.forEach(click => {
    if (click.merchant_id) {
      map[click.merchant_id] = (map[click.merchant_id] || 0) + 1;
    }
  });

  return map;
}

export function productClicks(clicks: AffiliateClick[]): Record<string, number> {
  const map: Record<string, number> = {};
  if (!clicks) return map;

  clicks.forEach(click => {
    if (click.product_id) {
      map[click.product_id] = (map[click.product_id] || 0) + 1;
    }
  });

  return map;
}

export function dailyClicks(clicks: AffiliateClick[]): Record<string, number> {
  const map: Record<string, number> = {};
  if (!clicks) return map;

  clicks.forEach(click => {
    if (click.clicked_at) {
      const date = click.clicked_at.split('T')[0];
      map[date] = (map[date] || 0) + 1;
    }
  });

  return map;
}
