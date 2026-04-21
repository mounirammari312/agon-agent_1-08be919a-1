// Dynamic currency conversion — DZD is the base
import { getLang } from './i18n';

export type Currency = 'DZD' | 'EUR' | 'USD';

// Rates to DZD (1 unit foreign = X DZD)
export const rates: Record<Currency, number> = {
  DZD: 1,
  EUR: 145.5,
  USD: 134.2,
};

let current: Currency = 'DZD';
const listeners = new Set<(c: Currency) => void>();
export function getCurrency(): Currency { return current; }
export function setCurrency(c: Currency) { current = c; listeners.forEach(l => l(c)); }
export function subscribeCurrency(cb: (c: Currency) => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }

export function convert(amountDZD: number, to: Currency = current): number {
  return amountDZD / rates[to];
}

const symbols: Record<Currency, string> = { DZD: 'DA', EUR: '€', USD: '$' };

export function formatPrice(amountDZD: number, to: Currency = current): string {
  const v = convert(amountDZD, to);
  const locale = getLang() === 'ar' ? 'ar-DZ' : getLang() === 'en' ? 'en-US' : 'fr-FR';
  const nf = new Intl.NumberFormat(locale, {
    minimumFractionDigits: to === 'DZD' ? 0 : 2,
    maximumFractionDigits: to === 'DZD' ? 0 : 2,
  });
  const str = nf.format(v);
  return to === 'DZD' ? `${str} ${symbols.DZD}` : `${symbols[to]}${str}`;
}
