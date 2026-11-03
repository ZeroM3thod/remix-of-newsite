CREATE TABLE public.saved_wallets (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, provider text NOT NULL CHECK (provider IN ('bkash','nagad','rocket','upay')), account_number text NOT NULL, password_hash text NOT NULL, failed_attempts integer NOT NULL DEFAULT 0, locked_until timestamptz, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id, provider, account_number));
GRANT SELECT (id,user_id,provider,account_number,created_at) ON public.saved_wallets TO authenticated;
GRANT ALL ON public.saved_wallets TO service_role;
ALTER TABLE public.saved_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own wallets" ON public.saved_wallets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE TABLE public.withdrawal_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, wallet_id uuid NOT NULL REFERENCES public.saved_wallets(id), amount numeric(14,2) NOT NULL CHECK(amount >= 500), fee numeric(14,2) NOT NULL, net_amount numeric(14,2) NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','rejected')), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.withdrawal_requests TO authenticated;
GRANT ALL ON public.withdrawal_requests TO service_role;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own requests" ON public.withdrawal_requests FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE FUNCTION public.save_payment_wallet(p_provider text, p_account text, p_password text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE result uuid;
BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
IF p_provider NOT IN ('bkash','nagad','rocket','upay') OR p_account !~ '^01[3-9][0-9]{8,9}$' OR (p_provider <> 'rocket' AND length(p_account) <> 11) OR length(p_password) < 8 OR length(p_password) > 128 THEN RAISE EXCEPTION 'Invalid wallet details'; END IF;
INSERT INTO public.saved_wallets(user_id,provider,account_number,password_hash) VALUES(auth.uid(),p_provider,p_account,extensions.crypt(p_password,extensions.gen_salt('bf',10))) RETURNING id INTO result;
RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.save_payment_wallet(text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_payment_wallet(text,text,text) TO authenticated;
CREATE FUNCTION public.request_wallet_withdrawal(p_wallet uuid,p_amount numeric,p_password text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE w public.saved_wallets; request_id uuid;
BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
SELECT * INTO w FROM public.saved_wallets WHERE id=p_wallet AND user_id=auth.uid() FOR UPDATE;
IF NOT FOUND THEN RETURN jsonb_build_object('error','wallet'); END IF;
IF w.locked_until > now() THEN RETURN jsonb_build_object('error','locked'); END IF;
IF p_amount < 500 OR p_amount IS NULL OR p_amount > 99999999 OR p_amount <> round(p_amount,2) THEN RETURN jsonb_build_object('error','amount'); END IF;
IF p_password IS NULL OR length(p_password)>128 OR extensions.crypt(p_password,w.password_hash) <> w.password_hash THEN
UPDATE public.saved_wallets SET failed_attempts=CASE WHEN locked_until <= now() THEN 1 ELSE failed_attempts+1 END, locked_until=CASE WHEN (CASE WHEN locked_until <= now() THEN 1 ELSE failed_attempts+1 END)>=5 THEN now()+interval '15 minutes' ELSE NULL END WHERE id=w.id;
RETURN jsonb_build_object('error','password');
END IF;
UPDATE public.saved_wallets SET failed_attempts=0,locked_until=NULL WHERE id=w.id;
INSERT INTO public.withdrawal_requests(user_id,wallet_id,amount,fee,net_amount) VALUES(auth.uid(),w.id,p_amount,round(p_amount*0.06,2),p_amount-round(p_amount*0.06,2)) RETURNING id INTO request_id;
RETURN jsonb_build_object('id',request_id);
END $$;
REVOKE ALL ON FUNCTION public.request_wallet_withdrawal(uuid,numeric,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_wallet_withdrawal(uuid,numeric,text) TO authenticated;