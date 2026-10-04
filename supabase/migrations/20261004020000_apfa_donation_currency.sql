-- ============================================================
-- APFA :: Donation Currency Contract
-- Migration: 20261004020000
--
-- Donation amounts presented by the APFA frontend are currently
-- denominated in USD. Keep currency explicit in the ledger so
-- amount semantics are never ambiguous.
-- ============================================================

alter table public.donations
  add column if not exists amount_currency text
  not null
  default 'USD';

alter table public.donations
  drop constraint if exists donations_amount_currency_usd_check;

alter table public.donations
  add constraint donations_amount_currency_usd_check
  check (upper(trim(amount_currency)) = 'USD');

comment on column public.donations.amount_currency is
  'Currency denomination of amount_requested. APFA currently accepts USD-denominated donation requests only.';

-- ============================================================
-- END
-- ============================================================
