-- Run once in a new/dedicated Supabase project's SQL Editor as postgres.
begin;

-- Only SQL Editor / a trusted database operator can assign the single admin.
create table public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  singleton boolean not null default true unique check (singleton)
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from public, anon, authenticated;

create function public.is_portfolio_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.portfolio_admins where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 10000),
  technologies text[] not null default '{}' check (cardinality(technologies) <= 30),
  demo_url text check (
    demo_url is null or (
      char_length(demo_url) <= 2048 and demo_url ~* '^https?://[^[:space:]/?#]+[^[:space:]]*$'
    )
  ),
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  -- Store the object path, never a temporary signed URL.
  storage_path text not null unique,
  alt_text text not null check (char_length(btrim(alt_text)) between 1 and 300),
  is_cover boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  constraint project_image_path check (
    storage_path ~ ('^' || project_id::text || '/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$')
  )
);

create index projects_public_order on public.projects(status, sort_order, created_at);
create index project_images_order on public.project_images(project_id, sort_order, created_at);
create unique index project_images_one_cover on public.project_images(project_id) where is_cover;

create function public.set_project_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.set_project_updated_at() from public;
create trigger projects_updated_at before update on public.projects
for each row execute function public.set_project_updated_at();

alter table public.projects enable row level security;
alter table public.project_images enable row level security;
revoke all on public.projects, public.project_images from public, anon, authenticated;
grant select on public.projects, public.project_images to anon, authenticated;
grant insert, update, delete on public.projects, public.project_images to authenticated;

create policy projects_read on public.projects for select to anon, authenticated
using (status = 'published' or (select public.is_portfolio_admin()));
create policy projects_admin_insert on public.projects for insert to authenticated
with check ((select public.is_portfolio_admin()));
create policy projects_admin_update on public.projects for update to authenticated
using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy projects_admin_delete on public.projects for delete to authenticated
using ((select public.is_portfolio_admin()));

create policy project_images_read on public.project_images for select to anon, authenticated
using (
  (select public.is_portfolio_admin()) or exists (
    select 1 from public.projects p where p.id = project_id and p.status = 'published'
  )
);
create policy project_images_admin_insert on public.project_images for insert to authenticated
with check ((select public.is_portfolio_admin()));
create policy project_images_admin_update on public.project_images for update to authenticated
using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy project_images_admin_delete on public.project_images for delete to authenticated
using ((select public.is_portfolio_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-screenshots', 'project-screenshots', false, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']);

-- Public access is granted only to objects attached to published projects.
create policy portfolio_screenshots_read on storage.objects
for select to anon, authenticated
using (
  bucket_id = 'project-screenshots' and (
    (select public.is_portfolio_admin()) or exists (
      select 1 from public.project_images i
      join public.projects p on p.id = i.project_id
      where i.storage_path = storage.objects.name and p.status = 'published'
    )
  )
);
create policy portfolio_screenshots_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'project-screenshots' and (select public.is_portfolio_admin())
  and exists (
    select 1 from public.projects p
    where name ~ ('^' || p.id::text || '/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$')
  )
);
create policy portfolio_screenshots_update on storage.objects
for update to authenticated
using (bucket_id = 'project-screenshots' and (select public.is_portfolio_admin()))
with check (
  bucket_id = 'project-screenshots' and (select public.is_portfolio_admin())
  and exists (
    select 1 from public.projects p
    where name ~ ('^' || p.id::text || '/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$')
  )
);
create policy portfolio_screenshots_delete on storage.objects
for delete to authenticated
using (bucket_id = 'project-screenshots' and (select public.is_portfolio_admin()));

commit;
