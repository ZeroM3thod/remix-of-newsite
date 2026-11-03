import { describe, expect, it } from 'vitest';
import { validWalletNumber, walletProviders, withdrawalTotals, validWithdrawal } from '@/lib/withdrawal';
describe('Withdrawal rules', () => {
  it('offers the four requested wallet providers', () => {
    expect(walletProviders.map(p => p.id)).toEqual(['bkash','nagad','rocket','upay']);
  });
  it('accepts account numbers in Bengali and English', () => {
    expect(validWalletNumber('bkash','০১৭১২৩৪৫৬৭৮')).toBe(true);
    expect(validWalletNumber('upay','123')).toBe(false);
    expect(validWalletNumber('rocket','017123456789')).toBe(true);
  });
  it('charges 6 percent as in the reference', () => {
    expect(withdrawalTotals(500)).toEqual({fee:30,net:470});
  });
  it('requires at least 500 as in the reference', () => {
    expect(validWithdrawal(499,2500)).toBe(false);
    expect(validWithdrawal(500,2500)).toBe(true);
  });
  it('does not allow more than available savings', () => {
    expect(validWithdrawal(2501,2500)).toBe(false);
  });
});