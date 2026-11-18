-- Serwaa core schema.
-- Every table has row level security on and no policies: the browser never talks to
-- the database directly. All reads and writes go through the app's server, which
-- checks who is signed in and what their role allows before touching data.

create table institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_type text,
  mandate jsonb not null default '{"sectors":[],"minTicket":50000,"maxTicket":500000,"maxTenor":12}',
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  kind text not null check (kind in ('business', 'investor', 'institution', 'staff')),
  name text not null,
  email text not null unique,
  phone text,
  -- business
  org_name text,
  industry text,
  details jsonb not null default '{}',
  -- corporate investor
  institution_id uuid references institutions on delete cascade,
  team_role text check (team_role in ('Administrator', 'Investment manager', 'Analyst (view only)')),
  -- staff
  staff_roles text[] not null default '{}',
  -- individual investor
  prefs jsonb not null default '{"maxTenor":6,"securedOnly":true,"sectors":[],"monthlyIncome":true,"maxPerBusiness":30}',
  payout jsonb not null default '{"method":"MTN MoMo","number":"","reinvest":false}',
  alerts_on boolean not null default true,
  watchlist text[] not null default '{}',
  notes_read_at timestamptz not null default '-infinity',
  created_at timestamptz not null default now()
);
create index on profiles (kind);
create index on profiles (institution_id);

create table restrictions (
  account text primary key,
  reason text not null,
  created_at timestamptz not null default now()
);

create table applications (
  ref text primary key,
  business_id uuid references profiles on delete set null,
  business text not null,
  industry text not null,
  product text not null,
  amount numeric(14, 2) not null check (amount > 0),
  purpose text not null,
  stage_index int not null default 0,
  status text not null default 'In review',
  officer text not null default 'Unassigned',
  originator text not null default 'Business',
  disclosure text not null default 'investors' check (disclosure in ('public', 'investors')),
  submitted_at timestamptz not null default now()
);
create index on applications (business_id);

create table info_requests (
  id uuid primary key default gen_random_uuid(),
  app_ref text not null references applications on delete cascade,
  title text not null,
  due date not null,
  status text not null default 'Open',
  files text[] not null default '{}',
  reply text,
  created_by text not null,
  created_at timestamptz not null default now()
);
create index on info_requests (app_ref);

create table campaigns (
  id text primary key,
  ref text not null unique,
  app_ref text references applications on delete set null,
  business_id uuid references profiles on delete set null,
  business text not null,
  sector text not null,
  product text not null,
  purpose text not null,
  target numeric(14, 2) not null,
  min_ticket numeric(14, 2) not null default 100,
  tenor_months int not null,
  expected_return numeric(5, 2) not null,
  frequency text not null,
  security text not null,
  risk text not null default 'Moderate',
  closes_at timestamptz not null default now() + interval '30 days',
  stage_index int not null default 1,
  drafter text not null,
  approvals jsonb not null default '[]',
  disclosure text not null default 'investors' check (disclosure in ('public', 'investors')),
  -- money raised before Serwaa tracked it investment by investment
  base_cleared numeric(14, 2) not null default 0,
  base_pending numeric(14, 2) not null default 0,
  base_investors int not null default 0,
  disbursed_at timestamptz,
  created_at timestamptz not null default now()
);

create table investments (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references profiles on delete cascade,
  institution_id uuid references institutions on delete cascade,
  campaign_id text not null references campaigns on delete cascade,
  amount numeric(14, 2) not null check (amount > 0),
  fee numeric(14, 2) not null default 0,
  method text not null,
  pay_ref text not null unique,
  status text not null,
  created_at timestamptz not null default now()
);
create index on investments (investor_id);
create index on investments (institution_id);
create index on investments (campaign_id);

-- Raised, pending and investor counts are always worked out from the investments
-- themselves, so two people investing at once can never overwrite each other's totals.
create view campaign_totals as
select
  c.id,
  c.base_cleared + coalesce(sum(i.amount) filter (where i.status = 'Cleared'), 0) as cleared,
  c.base_pending + coalesce(sum(i.amount) filter (where i.status in ('Awaiting authorisation', 'Pending', 'Confirmed')), 0) as pending,
  c.base_investors + count(distinct coalesce(i.institution_id, i.investor_id)) filter (where i.status = 'Cleared') as investors
from campaigns c
left join investments i on i.campaign_id = c.id
group by c.id;

create table facilities (
  ref text primary key,
  business_id uuid references profiles on delete set null,
  business text not null,
  campaign_id text references campaigns on delete set null,
  product text not null,
  principal numeric(14, 2) not null,
  disbursed_at date not null,
  autopay boolean not null default false,
  payout_number text not null default '',
  schedule jsonb not null default '[]'
);
create index on facilities (business_id);

create table payments (
  ref text primary key,
  payer_id uuid references profiles on delete set null,
  from_name text not null,
  kind text not null check (kind in ('Investment', 'Repayment')),
  subject text not null,
  method text not null,
  expected numeric(14, 2) not null,
  received numeric(14, 2) not null default 0,
  status text not null,
  lines int[],
  investment_id uuid references investments on delete set null,
  created_at timestamptz not null default now()
);
create index on payments (payer_id);

-- Money held for an investor (an individual, or an institution) by the custodian.
create table cash_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  kind text not null check (kind in ('Repayment', 'Withdrawal', 'Reinvestment')),
  amount numeric(14, 2) not null check (amount > 0),
  note text not null,
  created_at timestamptz not null default now()
);
create index on cash_events (owner_id);

create table interests (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references profiles on delete cascade,
  campaign_id text not null references campaigns on delete cascade,
  amount numeric(14, 2) not null,
  created_at timestamptz not null default now(),
  unique (investor_id, campaign_id)
);

create table allocations (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions on delete cascade,
  campaign_id text not null references campaigns on delete cascade,
  amount numeric(14, 2) not null,
  status text not null default 'Requested' check (status in ('Requested', 'Agreed', 'Paid')),
  created_at timestamptz not null default now(),
  unique (institution_id, campaign_id)
);

create table ledger_entries (
  id uuid primary key default gen_random_uuid(),
  ref text not null,
  memo text not null,
  lines jsonb not null,
  created_at timestamptz not null default now()
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  actor text not null,
  role text not null,
  action text not null,
  reason text,
  created_at timestamptz not null default now()
);
create index on audit_log (subject);

-- A note for one person (user_id) or for everyone in an audience (user_id null).
create table notifications (
  id uuid primary key default gen_random_uuid(),
  audience text not null check (audience in ('business', 'investor', 'institution', 'ops')),
  user_id uuid,
  title text not null,
  body text not null,
  href text,
  created_at timestamptz not null default now()
);
create index on notifications (audience, created_at desc);
create index on notifications (user_id);

create table settings (
  key text primary key,
  value jsonb not null
);
insert into settings values ('fees', '{"originationPct":2,"servicingPct":1,"momoPct":1,"bankFlat":10,"payoutMomoPct":0.5,"payoutBankFlat":25}');

do $$
declare t text;
begin
  foreach t in array array['institutions','profiles','restrictions','applications','info_requests','campaigns','investments','facilities','payments','cash_events','interests','allocations','ledger_entries','audit_log','notifications','settings']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('revoke all on %I from anon, authenticated', t);
  end loop;
end $$;
revoke all on campaign_totals from anon, authenticated;
