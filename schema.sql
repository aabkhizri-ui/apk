-- Aab-e-Khizri: Supabase schema (tables use the ak_ prefix so they never clash with your existing tables)
-- Run in Supabase > SQL Editor. Safe to re-run.

create table if not exists ak_staff(
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('admin','user','employer','booker','shopkeeper')),
  code text unique, name text, mobile text, created_by uuid, created_at timestamptz default now());

-- automatic ID, separate series per role: ADM / USR / EMP / BKR / SHP
create sequence if not exists ak_seq_admin; create sequence if not exists ak_seq_user;
create sequence if not exists ak_seq_employer; create sequence if not exists ak_seq_booker;
create sequence if not exists ak_seq_shopkeeper;

create or replace function ak_assign_code() returns trigger language plpgsql security definer set search_path=public as $$
declare n bigint; p text;
begin
  p := case new.role when 'admin' then 'ADM' when 'user' then 'USR' when 'employer' then 'EMP' when 'booker' then 'BKR' else 'SHP' end;
  execute format('select nextval(%L)','ak_seq_'||new.role) into n;
  new.code := p||'-'||lpad(n::text,4,'0');
  return new;
end $$;
drop trigger if exists ak_staff_code on ak_staff;
create trigger ak_staff_code before insert on ak_staff for each row when (new.code is null) execute function ak_assign_code();

create table if not exists ak_bundles(id serial primary key, paid int not null, free int not null, retail numeric not null, wholesale numeric not null, tokens int not null default 0, active boolean default true);
insert into ak_bundles(paid,free,retail,wholesale,tokens) select 6,2,3000,2700,50 where not exists(select 1 from ak_bundles);
insert into ak_bundles(paid,free,retail,wholesale,tokens) select 12,4,6000,5300,100 where (select count(*) from ak_bundles)=1;

create table if not exists ak_settings(key text primary key, value numeric not null);
insert into ak_settings values('token_rate',10) on conflict do nothing;

create table if not exists ak_orders(
  id bigint generated always as identity primary key,
  source text not null check (source in ('website','booker','shopkeeper')),
  customer_name text, customer_phone text, address text, created_by uuid,
  status text not null default 'pending' check (status in ('pending','delivered','cancelled')),
  total numeric not null default 0, discount numeric not null default 0, created_at timestamptz default now());
create table if not exists ak_order_items(id bigserial primary key, order_id bigint references ak_orders on delete cascade, bundle_id int references ak_bundles, qty int not null check (qty>0 and qty<=500), unit_price numeric not null);
create table if not exists ak_discount_requests(id bigserial primary key, order_id bigint references ak_orders, requested_by uuid, approved_amount numeric, status text default 'pending', created_at timestamptz default now());
create table if not exists ak_token_ledger(id bigserial primary key, shop_id uuid references ak_staff(id), tokens int not null, reason text, created_at timestamptz default now());

create or replace function ak_role() returns text language sql stable security definer set search_path=public as $$ select role from ak_staff where id=auth.uid() $$;

alter table ak_staff enable row level security; alter table ak_bundles enable row level security; alter table ak_settings enable row level security;
alter table ak_orders enable row level security; alter table ak_order_items enable row level security;
alter table ak_discount_requests enable row level security; alter table ak_token_ledger enable row level security;

create policy ak_staff_self on ak_staff for select to authenticated using (id=auth.uid());
create policy ak_staff_admin on ak_staff for all to authenticated using (ak_role()='admin') with check (ak_role()='admin');
create policy ak_staff_user on ak_staff for select to authenticated using (ak_role()='user' and role in ('employer','booker'));
create policy ak_bundles_read on ak_bundles for select to anon, authenticated using (active);
create policy ak_bundles_admin on ak_bundles for all to authenticated using (ak_role()='admin') with check (ak_role()='admin');
create policy ak_settings_read on ak_settings for select to anon, authenticated using (true);
create policy ak_settings_admin on ak_settings for all to authenticated using (ak_role()='admin') with check (ak_role()='admin');
create policy ak_orders_staff on ak_orders for select to authenticated using (ak_role() in ('admin','employer') or created_by=auth.uid());
create policy ak_orders_insert on ak_orders for insert to authenticated with check (ak_role() in ('booker','shopkeeper') and created_by=auth.uid());
create policy ak_orders_update on ak_orders for update to authenticated using (ak_role() in ('admin','employer'));
create policy ak_items_read on ak_order_items for select to authenticated using (exists(select 1 from ak_orders o where o.id=order_id));
create policy ak_items_insert on ak_order_items for insert to authenticated with check (exists(select 1 from ak_orders o where o.id=order_id and o.created_by=auth.uid()));
create policy ak_disc_shop on ak_discount_requests for select to authenticated using (requested_by=auth.uid() or ak_role()='admin');
create policy ak_disc_ins on ak_discount_requests for insert to authenticated with check (requested_by=auth.uid() and ak_role()='shopkeeper');
create policy ak_disc_admin on ak_discount_requests for update to authenticated using (ak_role()='admin');
create policy ak_tok_read on ak_token_ledger for select to authenticated using (shop_id=auth.uid() or ak_role()='admin');
create policy ak_tok_admin on ak_token_ledger for insert to authenticated with check (ak_role()='admin');

-- public website: guest order (price is computed on the server, never trusted from the browser)
create or replace function place_guest_order(p_name text,p_phone text,p_address text,p_items jsonb) returns bigint
language plpgsql security definer set search_path=public as $$
declare oid bigint; it jsonb; b ak_bundles; t numeric:=0; q int;
begin
  if coalesce(trim(p_name),'')='' or p_phone !~ '^\d{10}$' or coalesce(trim(p_address),'')='' or jsonb_array_length(p_items) not between 1 and 5 then raise exception 'invalid order'; end if;
  insert into ak_orders(source,customer_name,customer_phone,address) values('website',left(p_name,80),p_phone,left(p_address,300)) returning id into oid;
  for it in select * from jsonb_array_elements(p_items) loop
    q:=(it->>'qty')::int; select * into b from ak_bundles where id=(it->>'bundle_id')::int and active;
    if b.id is null or q<1 or q>500 then raise exception 'invalid item'; end if;
    insert into ak_order_items(order_id,bundle_id,qty,unit_price) values(oid,b.id,q,b.retail); t:=t+q*b.retail;
  end loop;
  update ak_orders set total=t where id=oid; return oid;
end $$;

create or replace function track_order(p_no bigint,p_phone text) returns text language sql stable security definer set search_path=public as $$
  select status from ak_orders where id=p_no and customer_phone=p_phone $$;

revoke all on function place_guest_order(text,text,text,jsonb), track_order(bigint,text) from public;
grant execute on function place_guest_order(text,text,text,jsonb), track_order(bigint,text) to anon, authenticated;
