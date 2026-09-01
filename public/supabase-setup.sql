-- INVICTI CMS — complete Supabase setup
-- Run this file in Supabase Dashboard > SQL Editor.

begin;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_content_key_not_blank check (length(btrim(key)) > 0),
  constraint site_content_is_object check (jsonb_typeof(content) = 'object')
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_content_updated_at on public.site_content;
create trigger set_site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

alter table public.site_admins enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "Admins can read own membership" on public.site_admins;
create policy "Admins can read own membership"
on public.site_admins for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content"
on public.site_content for insert
to authenticated
with check (
  exists (
    select 1 from public.site_admins
    where site_admins.user_id = (select auth.uid())
  )
  and updated_by = (select auth.uid())
);

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
on public.site_content for update
to authenticated
using (
  exists (
    select 1 from public.site_admins
    where site_admins.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.site_admins
    where site_admins.user_id = (select auth.uid())
  )
  and updated_by = (select auth.uid())
);

drop policy if exists "Admins can delete site content" on public.site_content;
create policy "Admins can delete site content"
on public.site_content for delete
to authenticated
using (
  exists (
    select 1 from public.site_admins
    where site_admins.user_id = (select auth.uid())
  )
);

grant usage on schema public to anon, authenticated;
grant select on table public.site_content to anon, authenticated;
grant insert, update, delete on table public.site_content to authenticated;
grant select on table public.site_admins to authenticated;

revoke all on table public.site_admins from anon;
revoke insert, update, delete on table public.site_admins from anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can list site assets" on storage.objects;
create policy "Admins can list site assets"
on storage.objects for select
to authenticated
using (
  bucket_id = 'site-assets'
  and exists (
    select 1 from public.site_admins
    where site_admins.user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can upload site assets" on storage.objects;
create policy "Admins can upload site assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'site-assets'
  and exists (
    select 1 from public.site_admins
    where site_admins.user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can update site assets" on storage.objects;
create policy "Admins can update site assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'site-assets'
  and exists (
    select 1 from public.site_admins
    where site_admins.user_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'site-assets'
  and exists (
    select 1 from public.site_admins
    where site_admins.user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can delete site assets" on storage.objects;
create policy "Admins can delete site assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'site-assets'
  and exists (
    select 1 from public.site_admins
    where site_admins.user_id = (select auth.uid())
  )
);

commit;

-- AFTER running the setup above:
-- 1. Create the first user in Authentication > Users with an email + password.
-- 2. Replace the email below, then run this statement separately.
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
-- on conflict (user_id) do nothing;

