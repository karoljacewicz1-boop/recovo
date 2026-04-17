-- ========================================================================
-- PHASE 4 — MEMBERSHIPS, INVITATIONS, PLAN ENFORCEMENT (GRACE)
-- ========================================================================

-- ───────────────────────── 1. MEMBERSHIPS ─────────────────────────
-- A user can belong to multiple tenants (clients), each with a specific role.
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','manager')),
  invited_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique (client_id, user_id)
);

create index if not exists memberships_client_idx on memberships(client_id);
create index if not exists memberships_user_idx on memberships(user_id);

-- Backfill: every existing clients.user_id becomes an 'owner' membership.
insert into memberships (client_id, user_id, role)
select id, user_id, 'owner'
from clients
where user_id is not null
on conflict (client_id, user_id) do nothing;

-- ───────────────────────── 2. INVITATIONS ─────────────────────────
create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin','manager')),
  token text not null unique,
  invited_by uuid references auth.users(id),
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists invitations_client_idx on invitations(client_id);
create index if not exists invitations_token_idx on invitations(token);
create index if not exists invitations_email_idx on invitations(lower(email));

-- ─────────────────── 3. CLIENTS — GRACE PERIOD FIELDS ───────────────────
alter table clients
  add column if not exists workers_grace_started_at timestamptz,
  add column if not exists inspections_grace_started_at timestamptz,
  add column if not exists last_limit_warning_at timestamptz;

-- ─────────────────── 4. RLS — TIGHTEN EXISTING POLICIES ───────────────────
-- Drop over-permissive dev policies.
drop policy if exists "allow all clients" on clients;
drop policy if exists "allow all inspections" on inspections;

-- Helper: is_member(client_id) — used by RLS rules.
create or replace function is_client_member(target_client_id uuid)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from memberships
    where client_id = target_client_id and user_id = auth.uid()
  );
$$;

create or replace function client_role(target_client_id uuid)
returns text
language sql stable security definer
as $$
  select role from memberships
  where client_id = target_client_id and user_id = auth.uid()
  limit 1;
$$;

-- Clients: members can select; owners/admins can update (no delete from app).
create policy "members can read client"
  on clients for select
  using (is_client_member(id));

create policy "owner admin can update client"
  on clients for update
  using (client_role(id) in ('owner','admin'));

-- Inspections: members can read all of their tenant's inspections.
create policy "members can read inspections"
  on inspections for select
  using (is_client_member(client_id));

-- Workers table RLS (defense in depth — service role bypasses).
alter table workers enable row level security;
create policy "members can read workers"
  on workers for select
  using (is_client_member(client_id));

-- Memberships: self-read always; admins/owners see all tenant members.
alter table memberships enable row level security;
create policy "read own membership"
  on memberships for select
  using (user_id = auth.uid() or client_role(client_id) in ('owner','admin','manager'));

create policy "owner admin manage memberships"
  on memberships for all
  using (client_role(client_id) in ('owner','admin'))
  with check (client_role(client_id) in ('owner','admin'));

-- Invitations: owner/admin manage, invitee sees own by token (via server route only).
alter table invitations enable row level security;
create policy "owner admin manage invitations"
  on invitations for all
  using (client_role(client_id) in ('owner','admin'))
  with check (client_role(client_id) in ('owner','admin'));

-- ───────────────────────── 5. DEMO SEED NOTE ─────────────────────────
-- If you have a demo client 'demo-brand' without an owner user_id,
-- it stays accessible via the /dashboard/demo-brand bypass in layout.tsx.
