create or replace function delete_user_account()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.profiles where id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;
