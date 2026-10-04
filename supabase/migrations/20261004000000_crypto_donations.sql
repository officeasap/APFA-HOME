create extension if not exists pgcrypto;

create table if not exists public.crypto_donations (
  id uuid primary key default gen_random_uuid(),

  order_id text not null unique,
  provider text not null default 'nowpayments',
  provider_payment_id text,

  donor_name text,
  donor_email text,

  price_amount numeric(20,8) not null,
  price_currency text not null default 'usd',

  pay_currency text,
  pay_amount numeric(30,18),

  pay_address text,
  pay_extra_id text,

  payment_status text not null default 'created',

  actually_paid numeric(30,18),
  actually_paid_currency text,

  donation_message text,

  ipn_received_at timestamptz,
  completed_at timestamptz,

  provider_payload jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crypto_donations_provider_payment_id_idx
  on public.crypto_donations(provider_payment_id);

create index if not exists crypto_donations_status_idx
  on public.crypto_donations(payment_status);

create index if not exists crypto_donations_created_at_idx
  on public.crypto_donations(created_at desc);

alter table public.crypto_donations enable row level security;

create or replace function public.set_crypto_donation_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists crypto_donations_updated_at
on public.crypto_donations;

create trigger crypto_donations_updated_at
before update on public.crypto_donations
for each row
execute function public.set_crypto_donation_updated_at();
