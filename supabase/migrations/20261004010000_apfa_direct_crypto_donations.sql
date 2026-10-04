-- ============================================================
-- APFA DIRECT CRYPTO DONATIONS
-- Canonical non-custodial wallet registry + donation ledger
-- ============================================================

create extension if not exists pgcrypto;

-- Canonical timestamp trigger function.
-- Defined locally so this migration is self-contained.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- ENUMS
-- ============================================================

do $$
begin
  create type public.donation_status as enum (
    'PENDING',
    'DETECTED',
    'CONFIRMED',
    'CANCELLED'
  );
exception
  when duplicate_object then null;
end
$$;

-- ============================================================
-- DONATION ASSETS / NETWORKS
-- ============================================================

create table if not exists public.donation_assets (
  id uuid primary key default gen_random_uuid(),

  symbol text not null,
  name text not null,
  network text not null,

  decimals integer,

  enabled boolean not null default true,

  display_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint donation_assets_symbol_not_blank
    check (length(trim(symbol)) > 0),

  constraint donation_assets_name_not_blank
    check (length(trim(name)) > 0),

  constraint donation_assets_network_not_blank
    check (length(trim(network)) > 0),

  constraint donation_assets_decimals_valid
    check (decimals is null or (decimals >= 0 and decimals <= 36)),

  constraint donation_assets_unique_asset_network
    unique (symbol, network)
);

-- ============================================================
-- APFA WALLET DESTINATIONS
-- ============================================================

create table if not exists public.donation_wallets (
  id uuid primary key default gen_random_uuid(),

  asset_id uuid not null
    references public.donation_assets(id)
    on delete restrict,

  wallet_address text not null,

  label text,

  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint donation_wallets_address_not_blank
    check (length(trim(wallet_address)) > 0),

  constraint donation_wallets_unique_destination
    unique (asset_id, wallet_address)
);

create index if not exists donation_wallets_asset_idx
  on public.donation_wallets(asset_id);

create index if not exists donation_wallets_active_idx
  on public.donation_wallets(active);

-- ============================================================
-- DONATION LEDGER
-- ============================================================

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),

  reference text not null unique,

  wallet_id uuid not null
    references public.donation_wallets(id)
    on delete restrict,

  asset_id uuid not null
    references public.donation_assets(id)
    on delete restrict,

  donor_name text,
  donor_email text,
  donation_message text,

  amount_requested numeric(38,18),

  transaction_hash text,

  status public.donation_status not null default 'PENDING',

  detected_at timestamptz,
  confirmed_at timestamptz,
  cancelled_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint donations_reference_not_blank
    check (length(trim(reference)) > 0),

  constraint donations_amount_valid
    check (
      amount_requested is null
      or amount_requested > 0
    )
);

create index if not exists donations_wallet_idx
  on public.donations(wallet_id);

create index if not exists donations_asset_idx
  on public.donations(asset_id);

create index if not exists donations_status_idx
  on public.donations(status);

create index if not exists donations_created_idx
  on public.donations(created_at desc);

create index if not exists donations_transaction_hash_idx
  on public.donations(transaction_hash)
  where transaction_hash is not null;

-- Prevent the same blockchain transaction from being registered twice.
create unique index if not exists donations_transaction_hash_unique_idx
  on public.donations(transaction_hash)
  where transaction_hash is not null;

-- ============================================================
-- DONATION EVENTS / AUDIT TRAIL
-- ============================================================

create table if not exists public.donation_events (
  id uuid primary key default gen_random_uuid(),

  donation_id uuid not null
    references public.donations(id)
    on delete cascade,

  event_type text not null,

  payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),

  constraint donation_events_type_not_blank
    check (length(trim(event_type)) > 0)
);

create index if not exists donation_events_donation_idx
  on public.donation_events(donation_id, created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

drop trigger if exists set_donation_assets_updated_at
  on public.donation_assets;

create trigger set_donation_assets_updated_at
before update on public.donation_assets
for each row
execute function public.set_updated_at();

drop trigger if exists set_donation_wallets_updated_at
  on public.donation_wallets;

create trigger set_donation_wallets_updated_at
before update on public.donation_wallets
for each row
execute function public.set_updated_at();

drop trigger if exists set_donations_updated_at
  on public.donations;

create trigger set_donations_updated_at
before update on public.donations
for each row
execute function public.set_updated_at();

-- ============================================================
-- CANONICAL APFA DONATION ASSETS
-- ============================================================

insert into public.donation_assets
  (symbol, name, network, decimals, enabled, display_order)
values
  ('ETH', 'Ethereum', 'Ethereum', 18, true, 1),
  ('SOL', 'Solana', 'Solana', 9, true, 2),
  ('TRX', 'TRON', 'TRON', 6, true, 3),
  ('BTC', 'Bitcoin', 'Bitcoin', 8, true, 4),
  ('ETH', 'Ethereum on Arbitrum', 'Arbitrum One', 18, true, 5),
  ('BNB', 'BNB Smart Chain', 'BNB Smart Chain', 18, true, 6)
on conflict (symbol, network)
do update set
  name = excluded.name,
  decimals = excluded.decimals,
  enabled = excluded.enabled,
  display_order = excluded.display_order,
  updated_at = now();

-- ============================================================
-- CANONICAL APFA WALLETS
-- ============================================================

insert into public.donation_wallets
  (asset_id, wallet_address, label, active)
select
  a.id,
  v.wallet_address,
  v.label,
  true
from (
  values
    (
      'ETH',
      'Ethereum',
      '0xc6a065A1205E1d7BB251153d46cE628aC82B4Eb3',
      'APFA Ethereum Donation Wallet'
    ),
    (
      'SOL',
      'Solana',
      '6SYyCdHEUdXymLr1XzbzmQiJjhDJWpao9sejogAkph8n',
      'APFA Solana Donation Wallet'
    ),
    (
      'TRX',
      'TRON',
      'TYd8wtAUGeSu4ogja7q51jFSVaEmhPVfmT',
      'APFA TRON Donation Wallet'
    ),
    (
      'BTC',
      'Bitcoin',
      'bc1qnnexrgwueqeyrdjyv2zj5sndu8yfdcf9rypsr0',
      'APFA Bitcoin Donation Wallet'
    ),
    (
      'ETH',
      'Arbitrum One',
      '0xc6a065A1205E1d7BB251153d46cE628aC82B4Eb3',
      'APFA Arbitrum Donation Wallet'
    ),
    (
      'BNB',
      'BNB Smart Chain',
      '0xc6a065A1205E1d7BB251153d46cE628aC82B4Eb3',
      'APFA BNB Smart Chain Donation Wallet'
    )
) as v(symbol, network, wallet_address, label)
join public.donation_assets a
  on a.symbol = v.symbol
 and a.network = v.network
on conflict (asset_id, wallet_address)
do update set
  label = excluded.label,
  active = true,
  updated_at = now();

-- ============================================================
-- RLS
-- ============================================================

alter table public.donation_assets enable row level security;
alter table public.donation_wallets enable row level security;
alter table public.donations enable row level security;
alter table public.donation_events enable row level security;

-- Public donors may read only active donation destinations.
drop policy if exists donation_assets_public_read
  on public.donation_assets;

create policy donation_assets_public_read
on public.donation_assets
for select
to anon, authenticated
using (enabled = true);

drop policy if exists donation_wallets_public_read
  on public.donation_wallets;

create policy donation_wallets_public_read
on public.donation_wallets
for select
to anon, authenticated
using (
  active = true
  and exists (
    select 1
    from public.donation_assets a
    where a.id = donation_wallets.asset_id
      and a.enabled = true
  )
);

-- Donation ledger is NOT publicly writable/readable.
-- Privileged Edge Functions / service role handle ledger operations.

-- Explicitly deny normal client access by providing no client policies
-- for donations and donation_events.

-- ============================================================
-- GRANTS
-- ============================================================

revoke all on public.donations from anon, authenticated;
revoke all on public.donation_events from anon, authenticated;

grant select on public.donation_assets to anon, authenticated;
grant select on public.donation_wallets to anon, authenticated;

-- ============================================================
-- HELPER: CREATE DONATION REFERENCE
-- ============================================================

create or replace function public.create_donation_reference()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_reference text;
begin
  loop
    new_reference :=
      'APFA-DON-' ||
      to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS') ||
      '-' ||
      upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8));

    exit when not exists (
      select 1
      from public.donations
      where reference = new_reference
    );
  end loop;

  return new_reference;
end;
$$;

revoke all on function public.create_donation_reference()
  from public, anon, authenticated;

-- ============================================================
-- COMMENTS
-- ============================================================

comment on table public.donation_assets is
  'Canonical APFA-supported cryptocurrency/network registry.';

comment on table public.donation_wallets is
  'Canonical APFA-controlled wallet destinations for direct donations.';

comment on table public.donations is
  'APFA direct non-custodial donation ledger. Funds never pass through APFA database custody.';

comment on table public.donation_events is
  'Audit trail for APFA donation lifecycle events.';

comment on column public.donations.transaction_hash is
  'Blockchain transaction identifier supplied by trusted verification logic.';

-- ============================================================
-- END
-- ============================================================
