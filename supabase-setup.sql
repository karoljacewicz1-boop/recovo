-- CLIENTS
create table clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  slug text unique,
  created_at timestamptz default now()
);

insert into clients (name, email, slug) values
  ('Nordic Style DE', 'contact@nordicstyle.de', 'nordic-style'),
  ('Modivo CZ', 'returns@modivo.cz', 'modivo-cz'),
  ('Demo Brand', 'demo@brand.com', 'demo-brand');

-- INSPECTIONS
create table inspections (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references clients(id),
  tracking_number text not null,
  category text not null,
  grade text not null check (grade in ('A','B','C','D')),
  notes text,
  photos text[],
  worker_name text,
  ai_description text,
  created_at timestamptz default now()
);

-- Storage bucket for inspection photos
-- Run this separately in Supabase dashboard > Storage:
-- Create a new bucket named 'inspections' (public: false)

-- Enable RLS (adjust policies as needed for your auth setup)
alter table clients enable row level security;
alter table inspections enable row level security;

-- For development: allow all (replace with proper policies in production)
create policy "allow all clients" on clients for all using (true);
create policy "allow all inspections" on inspections for all using (true);
