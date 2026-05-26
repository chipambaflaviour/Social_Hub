create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  type text not null default 'post',
  author jsonb not null,
  created_at timestamptz default now(),
  content text,
  image text,
  likes int default 0,
  liked_by text[] default '{}',
  reactions jsonb default '{}'::jsonb,
  comments jsonb default '[]'::jsonb,
  shares int default 0,
  is_pinned boolean default false,
  poll jsonb
);

create table if not exists public.suggestions (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  department text,
  email text,
  contact text,
  gender text,
  avatar text,
  is_admin boolean default false
);

create table if not exists public.flagged_content (
  id uuid default gen_random_uuid() primary key,
  author text,
  avatar text,
  reason text,
  created_at timestamptz default now(),
  content text
);
