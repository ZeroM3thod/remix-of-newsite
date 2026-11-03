export const walletProviders = [
  { id: 'bkash', name: 'বিকাশ', english: 'bKash' },
  { id: 'nagad', name: 'নগদ', english: 'Nagad' },
  { id: 'rocket', name: 'রকেট', english: 'Rocket' },
  { id: 'upay', name: 'উপায়', english: 'Upay' },
] as const;
export type WalletProvider = typeof walletProviders[number]['id'];
export function normalizeDigits(value: string) {
  return value.replace(/[০-৯]/g, digit => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)));
}
export function validWalletNumber(provider: string, value: string) {
  return walletProviders.some(item => item.id === provider) &&
    (provider === 'rocket' ? /^01[3-9]\d{8,9}$/ : /^01[3-9]\d{8}$/).test(normalizeDigits(value));
}
export function withdrawalTotals(amount: number) {
  const fee = Math.round(amount * 6) / 100;
  return { fee, net: Math.round((amount - fee) * 100) / 100 };
}
export function validWithdrawal(amount: number, balance: number) {
  return Number.isFinite(amount) && amount >= 500 && amount <= balance && Math.round(amount * 100) === amount * 100;
}