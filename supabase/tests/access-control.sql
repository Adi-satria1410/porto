-- Run as postgres in a development Supabase SQL Editor after the migration.
-- Success ends with ROLLBACK. On an error, run ROLLBACK before retrying.
begin;

select set_config('test.admin', coalesce(
  (select user_id::text from public.portfolio_admins), gen_random_uuid()::text
), true);
select set_config('test.outsider', gen_random_uuid()::text, true);
select set_config('test.draft', gen_random_uuid()::text, true);
select set_config('test.published', gen_random_uuid()::text, true);

insert into auth.users(id)
values (current_setting('test.admin')::uuid), (current_setting('test.outsider')::uuid)
on conflict (id) do nothing;
insert into public.portfolio_admins(user_id)
values (current_setting('test.admin')::uuid) on conflict (user_id) do nothing;

insert into public.projects(id, title, status) values
  (current_setting('test.draft')::uuid, 'RLS test draft', 'draft'),
  (current_setting('test.published')::uuid, 'RLS test published', 'published');
insert into public.project_images(project_id, storage_path, alt_text, is_cover)
select id, id::text || '/test.png', 'Screenshot test', true from public.projects
where id in (current_setting('test.draft')::uuid, current_setting('test.published')::uuid);

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$
begin
  if public.is_portfolio_admin() then raise exception 'Anon is admin'; end if;
  if exists (select 1 from public.projects where id = current_setting('test.draft')::uuid)
    then raise exception 'Anon can read draft'; end if;
  if exists (select 1 from public.project_images where project_id = current_setting('test.draft')::uuid)
    then raise exception 'Anon can read draft images'; end if;
  if not exists (select 1 from public.project_images where project_id = current_setting('test.published')::uuid)
    then raise exception 'Anon cannot read published images'; end if;
  begin
    insert into public.projects(title) values ('Forbidden');
    raise exception 'Anon insert allowed';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claims', json_build_object(
  'sub', current_setting('test.outsider'), 'role', 'authenticated')::text, true);
do $$
declare affected integer;
begin
  if public.is_portfolio_admin() then raise exception 'Outsider is admin'; end if;
  if exists (select 1 from public.projects where id = current_setting('test.draft')::uuid)
    then raise exception 'Outsider can read draft'; end if;
  begin
    insert into public.projects(title) values ('Forbidden');
    raise exception 'Outsider insert allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.portfolio_admins(user_id) values (current_setting('test.outsider')::uuid);
    raise exception 'Outsider can promote self';
  exception when insufficient_privilege then null;
  end;
  update public.projects set title = 'Forbidden' where id = current_setting('test.published')::uuid;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Outsider update allowed'; end if;
  delete from public.projects where id = current_setting('test.published')::uuid;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Outsider delete allowed'; end if;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claims', json_build_object(
  'sub', current_setting('test.admin'), 'role', 'authenticated')::text, true);
do $$
declare test_id uuid;
begin
  if not public.is_portfolio_admin() then raise exception 'Admin not recognized'; end if;
  if not exists (select 1 from public.project_images where project_id = current_setting('test.draft')::uuid)
    then raise exception 'Admin cannot read draft images'; end if;
  insert into public.projects(title, technologies, demo_url)
  values ('Admin CRUD test', array['HTML', 'CSS', 'JavaScript'], 'https://example.com')
  returning id into test_id;
  update public.projects set title = 'Updated' where id = test_id;
  if not exists (select 1 from public.projects where id = test_id and title = 'Updated')
    then raise exception 'Admin update failed'; end if;
  delete from public.projects where id = test_id;
  if exists (select 1 from public.projects where id = test_id)
    then raise exception 'Admin delete failed'; end if;
  begin
    insert into public.project_images(project_id, storage_path, alt_text, is_cover)
    values (current_setting('test.draft')::uuid,
      current_setting('test.draft') || '/second.png', 'Second cover', true);
    raise exception 'Duplicate cover accepted';
  exception when unique_violation then null;
  end;
  begin
    insert into public.projects(title, demo_url) values ('Bad URL', 'javascript:alert(1)');
    raise exception 'Unsafe URL accepted';
  exception when check_violation then null;
  end;
  update public.projects set status = 'published' where id = current_setting('test.draft')::uuid;
  update public.projects set status = 'draft' where id = current_setting('test.published')::uuid;
end $$;

reset role;
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$
begin
  if not exists (select 1 from public.project_images where project_id = current_setting('test.draft')::uuid)
    then raise exception 'Publish did not expose image metadata'; end if;
  if exists (select 1 from public.project_images where project_id = current_setting('test.published')::uuid)
    then raise exception 'Unpublish still exposes image metadata'; end if;
end $$;

reset role;
do $$
begin
  if not exists (select 1 from storage.buckets
    where id = 'project-screenshots' and public = false
    and file_size_limit = 5242880
    and allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'])
    then raise exception 'Incorrect bucket configuration'; end if;
end $$;

rollback;
