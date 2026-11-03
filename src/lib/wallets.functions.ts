import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { normalizeDigits, validWalletNumber } from './withdrawal';

export const listWallets = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth]).handler(async ({ context }) => {
    const { data, error } = await context.supabase.from('saved_wallets')
      .select('id,provider,account_number,created_at').order('created_at', { ascending: false });
    if (error) throw new Error('ওয়ালেট লোড করা যায়নি');
    return data;
  });
export const saveWallet = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ provider: z.enum(['bkash','nagad','rocket','upay']), account: z.string().max(12), password: z.string().min(8).max(128) }))
  .handler(async ({ data, context }) => {
    if (!validWalletNumber(data.provider, data.account)) throw new Error('সঠিক অ্যাকাউন্ট নম্বর লিখুন');
    const result = await context.supabase.rpc('save_payment_wallet', { p_provider: data.provider, p_account: normalizeDigits(data.account), p_password: data.password });
    if (result.error) throw new Error(result.error.code === '23505' ? 'এই ওয়ালেট আগে থেকেই সংরক্ষিত' : 'ওয়ালেট সংরক্ষণ করা যায়নি');
    return { id: result.data };
  });
export const requestWithdrawal = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ wallet: z.string().uuid(), amount: z.number().min(500).max(99999999), password: z.string().min(1).max(128) }))
  .handler(async ({ data, context }) => {
    const result = await context.supabase.rpc('request_wallet_withdrawal', { p_wallet: data.wallet, p_amount: data.amount, p_password: data.password });
    if (result.error) throw new Error('আবেদন পাঠানো যায়নি');
    return result.data as { id?: string; error?: string };
  });