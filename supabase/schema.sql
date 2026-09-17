-- =============================================================
-- KitaBooks schema — run ONCE in the Supabase SQL Editor
-- Matches src/types.ts: Tenant, JournalEntry/JournalLine, Sale, Purchase
-- Safe to re-run: every statement is idempotent.
-- =============================================================

-- ---------- helper functions (SECURITY DEFINER: bypass RLS to avoid recursion) ----------
create or replace function my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid()
$$;

create or replace function my_firm_id() returns text
language sql stable security definer set search_path = public as $$
  select firm_id from profiles where id = auth.uid()
$$;

-- ---------- firms (CPA firms — the paying accounts) ----------
create table if not exists firms (
  id text primary key,
  name text not null,
  plan text not null default 'Solo CPA' check (plan in ('Solo CPA', 'Firm', 'Enterprise')),
  created_at timestamptz not null default now()
);

-- ---------- profiles (one row per auth user; auto-created on first sign-in) ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default 'User',
  role text not null default 'cpa' check (role in ('cpa', 'superadmin')),
  firm_id text references firms(id),
  created_at timestamptz not null default now()
);

-- ---------- tenants (client companies whose books are managed) ----------
create table if not exists tenants (
  id text primary key default gen_random_uuid()::text,
  firm_id text references firms(id),
  name text not null,
  industry text,
  tin text not null,
  rdo_code text,
  vat_type text not null default 'vatable' check (vat_type in ('vatable', 'non-vat')),
  fiscal_year_start date,
  logo_initials text,
  -- demo tenants are readable by every signed-in user (keeps the demo working
  -- while real firm-to-tenant isolation stays enforced for non-demo rows)
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- journal ----------
create table if not exists journal_entries (
  id text primary key default gen_random_uuid()::text,
  tenant_id text not null references tenants(id) on delete cascade,
  entry_date date not null,
  reference text not null default '',
  description text not null,
  vat_type text check (vat_type in ('vatable', 'vat-exempt', 'zero-rated', 'non-vat')),
  posted boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists journal_lines (
  id bigint generated always as identity primary key,
  entry_id text not null references journal_entries(id) on delete cascade,
  account_code text not null,
  debit numeric(18,2) not null default 0 check (debit >= 0),
  credit numeric(18,2) not null default 0 check (credit >= 0)
);

-- ---------- sales & purchases ----------
create table if not exists sales (
  id text primary key default gen_random_uuid()::text,
  tenant_id text not null references tenants(id) on delete cascade,
  invoice_no text not null,
  sale_date date not null,
  customer text not null,
  sale_type text not null check (sale_type in ('goods', 'services')),
  vat_type text not null check (vat_type in ('vatable', 'vat-exempt', 'zero-rated', 'non-vat')),
  net_amount numeric(18,2) not null check (net_amount >= 0),
  status text not null default 'unpaid' check (status in ('paid', 'unpaid')),
  created_at timestamptz not null default now()
);

create table if not exists purchases (
  id text primary key default gen_random_uuid()::text,
  tenant_id text not null references tenants(id) on delete cascade,
  ref_no text not null,
  purchase_date date not null,
  supplier text not null,
  expense_account text not null,
  vat_type text not null check (vat_type in ('vatable', 'non-vat')),
  net_amount numeric(18,2) not null check (net_amount >= 0),
  ewt_rate numeric(6,4) not null default 0,
  status text not null default 'unpaid' check (status in ('paid', 'unpaid')),
  created_at timestamptz not null default now()
);

-- ---------- platform settings (single row, id locked to 1) ----------
create table if not exists platform_settings (
  id int primary key default 1 check (id = 1),
  platform_name text not null default 'KitaBooks',
  vat_rate numeric(5,2) not null default 12,
  default_plan text not null default 'Solo CPA' check (default_plan in ('Solo CPA', 'Firm', 'Enterprise')),
  maintenance_mode boolean not null default false,
  allow_new_signups boolean not null default true,
  updated_at timestamptz not null default now()
);

-- =============================================================
-- Row Level Security
-- =============================================================
alter table firms enable row level security;
alter table profiles enable row level security;
alter table tenants enable row level security;
alter table journal_entries enable row level security;
alter table journal_lines enable row level security;
alter table sales enable row level security;
alter table purchases enable row level security;
alter table platform_settings enable row level security;

-- profiles: read/update own, create own on first sign-in; superadmin sees all
create policy "read own profile" on profiles for select
  using (id = auth.uid() or my_role() = 'superadmin');
create policy "create own profile" on profiles for insert
  with check (id = auth.uid());
create policy "update own profile" on profiles for update
  using (id = auth.uid() or my_role() = 'superadmin');

-- firms: members (and superadmin) can see their own firm
create policy "firm members read firm" on firms for select
  using (id = my_firm_id() or my_role() = 'superadmin');

-- tenants: demo tenants readable by everyone signed in;
-- a firm's own tenants fully managed by that firm (or superadmin)
create policy "read tenants" on tenants for select
  using (is_demo or firm_id = my_firm_id() or my_role() = 'superadmin');
create policy "manage own tenants" on tenants for all
  using (firm_id = my_firm_id() or my_role() = 'superadmin')
  with check (firm_id = my_firm_id() or my_role() = 'superadmin');

-- per-tenant data: access flows through the tenant row (subqueries respect tenants RLS)
create policy "access journal entries" on journal_entries for all
  using (exists (select 1 from tenants t where t.id = tenant_id))
  with check (exists (select 1 from tenants t where t.id = tenant_id));

create policy "access journal lines" on journal_lines for all
  using (exists (
    select 1 from journal_entries e join tenants t on t.id = e.tenant_id where e.id = entry_id
  ))
  with check (exists (
    select 1 from journal_entries e join tenants t on t.id = e.tenant_id where e.id = entry_id
  ));

create policy "access sales" on sales for all
  using (exists (select 1 from tenants t where t.id = tenant_id))
  with check (exists (select 1 from tenants t where t.id = tenant_id));

create policy "access purchases" on purchases for all
  using (exists (select 1 from tenants t where t.id = tenant_id))
  with check (exists (select 1 from tenants t where t.id = tenant_id));

-- platform settings: everyone signed in reads; only superadmin writes
create policy "read platform settings" on platform_settings for select
  using (auth.uid() is not null);
create policy "superadmin updates platform settings" on platform_settings for update
  using (my_role() = 'superadmin');

-- =============================================================
-- Seed (same ids the app demo data uses)
-- =============================================================
insert into firms (id, name, plan)
values ('f-santos', 'Santos & Co. CPAs', 'Firm')
on conflict (id) do nothing;

insert into tenants (id, firm_id, name, industry, tin, rdo_code, vat_type, fiscal_year_start, logo_initials, is_demo)
values
  ('manila-traders',  'f-santos', 'Manila Traders Corp.',     'Wholesale Trading',     '008-345-678-000', '047', 'vatable', '2026-01-01', 'MT', true),
  ('cebu-consulting', 'f-santos', 'Cebu Consulting Services', 'Professional Services', '009-123-456-000', '085', 'vatable', '2026-01-01', 'CC', true),
  ('davao-bakeshop',  'f-santos', 'Davao Delight Bakeshop',   'Food & Retail',         '010-567-890-000', '111', 'non-vat', '2026-04-01', 'DD', true)
on conflict (id) do nothing;

insert into platform_settings (id) values (1) on conflict (id) do nothing;

-- NEXT STEPS (manual, in the Supabase dashboard):
-- 1. Authentication -> Users -> Add user:
--    superadmin@kitabooks.ph (choose your password, auto-confirm).
--    The app auto-creates its profile with the 'superadmin' role on first sign-in.
-- 2. New CPA signups join the demo firm 'f-santos' until firm management ships.

