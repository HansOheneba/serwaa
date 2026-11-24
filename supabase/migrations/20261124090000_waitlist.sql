-- Early-access requests for Serwaa Verify (KYC and KYB checks as a service).
-- Written only by a server action with the secret key, like every other table.
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  product text not null default 'verify',
  name text not null,
  email text not null,
  organisation text not null,
  sector text,
  monthly_checks text,
  needs text[] not null default '{}',
  note text,
  created_at timestamptz not null default now(),
  unique (product, email)
);

alter table public.waitlist enable row level security;
revoke all on public.waitlist from anon, authenticated;
