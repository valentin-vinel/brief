-- 001_init.sql
-- Tables : folders, summaries
-- RLS activé sur les deux tables

-- =====================
-- FOLDERS
-- =====================

create table public.folders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  image_url   text,
  created_at  timestamptz not null default now()
);

alter table public.folders enable row level security;

create policy "users can read own folders"
  on public.folders for select
  using (auth.uid() = user_id);

create policy "users can insert own folders"
  on public.folders for insert
  with check (auth.uid() = user_id);

create policy "users can update own folders"
  on public.folders for update
  using (auth.uid() = user_id);

create policy "users can delete own folders"
  on public.folders for delete
  using (auth.uid() = user_id);

-- =====================
-- SUMMARIES
-- =====================

create table public.summaries (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  folder_id        uuid references public.folders(id) on delete set null,
  youtube_url      text not null,
  video_id         text not null,
  video_title      text not null,
  video_thumbnail  text,
  summary_text     text not null,
  action_points    text[] not null default '{}',
  timestamps       jsonb not null default '[]',
  created_at       timestamptz not null default now()
);

-- Cache : un user ne peut pas avoir deux résumés de la même vidéo
create unique index summaries_user_video_idx
  on public.summaries(user_id, video_id);

-- Historique : tri par date desc
create index summaries_user_created_idx
  on public.summaries(user_id, created_at desc);

-- Résumés par dossier
create index summaries_folder_idx
  on public.summaries(folder_id);

alter table public.summaries enable row level security;

create policy "users can read own summaries"
  on public.summaries for select
  using (auth.uid() = user_id);

create policy "users can insert own summaries"
  on public.summaries for insert
  with check (auth.uid() = user_id);

create policy "users can update own summaries"
  on public.summaries for update
  using (auth.uid() = user_id);

create policy "users can delete own summaries"
  on public.summaries for delete
  using (auth.uid() = user_id);