-- =====================================================================
-- BUSINFO B2B MARKETPLACE - COMPLETE SUPABASE SCHEMA (20 TABLES)
-- Design: Strict FKs, RLS on every table, real-time ready, storage hooks
-- Author: Senior Software Architect
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ---------- ENUMS ----------
do $$ begin
  create type user_role as enum ('buyer','supplier','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending','confirmed','shipped','delivered','cancelled','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type quote_status as enum ('open','responded','accepted','rejected','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type currency_code as enum ('DZD','EUR','USD');
exception when duplicate_object then null; end $$;

-- ---------- 1. PROFILES ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text check (phone ~ '^(\+213|0)(5|6|7)[0-9]{8}$'),
  role user_role default 'buyer',
  avatar_url text,
  language text default 'fr' check (language in ('ar','fr','en')),
  currency currency_code default 'DZD',
  city text,
  country text default 'Algeria',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- 2. SUPPLIERS ----------
create table if not exists suppliers (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  company_name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  banner_url text,
  tax_id text,
  verified boolean default false,
  rating numeric(3,2) default 0 check (rating between 0 and 5),
  total_orders integer default 0,
  city text,
  address text,
  created_at timestamptz default now()
);

-- ---------- 3. CATEGORIES ----------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references categories(id) on delete set null,
  name_ar text not null,
  name_fr text not null,
  name_en text not null,
  slug text unique not null,
  icon text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- 4. PRODUCTS ----------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  supplier_id uuid not null references suppliers(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  title text not null,
  description text,
  sku text,
  base_price numeric(12,2) not null check (base_price >= 0),
  currency currency_code default 'DZD',
  min_order_qty integer default 1 check (min_order_qty > 0),
  stock_qty integer default 0 check (stock_qty >= 0),
  images jsonb default '[]'::jsonb,
  tags text[],
  active boolean default true,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_products_supplier on products(supplier_id);
create index if not exists idx_products_category on products(category_id);

-- ---------- 5. PRODUCT VARIATIONS ----------
create table if not exists product_variations (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  sku text,
  price_delta numeric(12,2) default 0,
  stock_qty integer default 0 check (stock_qty >= 0),
  attributes jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ---------- 6. PRICE TIERS (bulk discounts) ----------
create table if not exists price_tiers (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  min_qty integer not null check (min_qty > 0),
  price numeric(12,2) not null check (price >= 0),
  created_at timestamptz default now()
);

-- ---------- 7. ORDERS ----------
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references profiles(id) on delete restrict,
  supplier_id uuid not null references suppliers(id) on delete restrict,
  status order_status default 'pending',
  subtotal numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  currency currency_code default 'DZD',
  shipping_address text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_orders_buyer on orders(buyer_id);
create index if not exists idx_orders_supplier on orders(supplier_id);

-- ---------- 8. ORDER ITEMS ----------
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  variation_id uuid references product_variations(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) not null check (line_total >= 0)
);

-- ---------- 9. QUOTES (RFQ) ----------
create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references profiles(id) on delete cascade,
  supplier_id uuid not null references suppliers(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  target_price numeric(12,2),
  message text,
  status quote_status default 'open',
  response_price numeric(12,2),
  response_note text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- ---------- 10. CONVERSATIONS ----------
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references profiles(id) on delete cascade,
  supplier_id uuid not null references suppliers(id) on delete cascade,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz default now(),
  unique (buyer_id, supplier_id)
);

-- ---------- 11. MESSAGES (real-time chat) ----------
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  attachment_url text,
  read_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_messages_convo on messages(conversation_id, created_at desc);

-- ---------- 12. NOTIFICATIONS ----------
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  kind text,
  payload jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- ---------- 13. BADGES ----------
create table if not exists badges (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name_ar text not null, name_fr text not null, name_en text not null,
  icon text,
  description text
);

-- ---------- 14. SUPPLIER BADGES (M2M) ----------
create table if not exists supplier_badges (
  supplier_id uuid references suppliers(id) on delete cascade,
  badge_id uuid references badges(id) on delete cascade,
  awarded_at timestamptz default now(),
  primary key (supplier_id, badge_id)
);

-- ---------- 15. REVIEWS ----------
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete set null,
  buyer_id uuid not null references profiles(id) on delete cascade,
  supplier_id uuid not null references suppliers(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- ---------- 16. FAVORITES ----------
create table if not exists favorites (
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, product_id)
);

-- ---------- 17. CART ITEMS ----------
create table if not exists cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variation_id uuid references product_variations(id) on delete set null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz default now(),
  unique (user_id, product_id, variation_id)
);

-- ---------- 18. ADDRESSES ----------
create table if not exists addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  label text,
  recipient text not null,
  phone text not null,
  line1 text not null,
  city text not null,
  wilaya text,
  country text default 'Algeria',
  is_default boolean default false,
  created_at timestamptz default now()
);

-- ---------- 19. CURRENCY RATES ----------
create table if not exists currency_rates (
  code currency_code primary key,
  rate_to_dzd numeric(14,6) not null,
  updated_at timestamptz default now()
);
insert into currency_rates (code, rate_to_dzd) values
  ('DZD', 1), ('EUR', 145.50), ('USD', 134.20)
on conflict (code) do nothing;

-- ---------- 20. AUDIT LOG ----------
create table if not exists audit_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  entity text,
  entity_id uuid,
  meta jsonb,
  created_at timestamptz default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table profiles              enable row level security;
alter table suppliers             enable row level security;
alter table categories            enable row level security;
alter table products              enable row level security;
alter table product_variations    enable row level security;
alter table price_tiers           enable row level security;
alter table orders                enable row level security;
alter table order_items           enable row level security;
alter table quotes                enable row level security;
alter table conversations         enable row level security;
alter table messages              enable row level security;
alter table notifications         enable row level security;
alter table badges                enable row level security;
alter table supplier_badges       enable row level security;
alter table reviews               enable row level security;
alter table favorites             enable row level security;
alter table cart_items            enable row level security;
alter table addresses             enable row level security;
alter table currency_rates        enable row level security;
alter table audit_log             enable row level security;

-- Public read: categories, badges, currency_rates, active products, suppliers
create policy "public read categories"     on categories      for select using (true);
create policy "public read badges"         on badges          for select using (true);
create policy "public read currency"       on currency_rates  for select using (true);
create policy "public read suppliers"      on suppliers       for select using (true);
create policy "public read products"       on products        for select using (active = true);
create policy "public read variations"     on product_variations for select using (true);
create policy "public read price_tiers"    on price_tiers     for select using (true);
create policy "public read supplier_badges" on supplier_badges for select using (true);
create policy "public read reviews"        on reviews         for select using (true);

-- Profiles: each user manages their own
create policy "profiles self read"   on profiles for select using (auth.uid() = id);
create policy "profiles self update" on profiles for update using (auth.uid() = id);
create policy "profiles self insert" on profiles for insert with check (auth.uid() = id);

-- Suppliers: owner manages
create policy "supplier owner write" on suppliers for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Products: only owning supplier can write
create policy "product owner write" on products for all
  using (exists (select 1 from suppliers s where s.id = supplier_id and s.owner_id = auth.uid()))
  with check (exists (select 1 from suppliers s where s.id = supplier_id and s.owner_id = auth.uid()));

-- Cart, favorites, addresses, notifications: self only
create policy "cart self"       on cart_items      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "fav self"        on favorites       for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "addr self"       on addresses       for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notif self read" on notifications   for select using (auth.uid() = user_id);
create policy "notif self upd"  on notifications   for update using (auth.uid() = user_id);

-- Orders: buyer or supplier owner can read; buyer creates
create policy "orders read" on orders for select using (
  auth.uid() = buyer_id
  or exists (select 1 from suppliers s where s.id = supplier_id and s.owner_id = auth.uid())
);
create policy "orders buyer insert" on orders for insert with check (auth.uid() = buyer_id);
create policy "orders supplier update" on orders for update using (
  exists (select 1 from suppliers s where s.id = supplier_id and s.owner_id = auth.uid())
);

create policy "order_items read" on order_items for select using (
  exists (select 1 from orders o where o.id = order_id and (
    o.buyer_id = auth.uid()
    or exists (select 1 from suppliers s where s.id = o.supplier_id and s.owner_id = auth.uid())
  ))
);
create policy "order_items insert" on order_items for insert with check (
  exists (select 1 from orders o where o.id = order_id and o.buyer_id = auth.uid())
);

-- Quotes
create policy "quotes parties read" on quotes for select using (
  auth.uid() = buyer_id
  or exists (select 1 from suppliers s where s.id = supplier_id and s.owner_id = auth.uid())
);
create policy "quotes buyer insert" on quotes for insert with check (auth.uid() = buyer_id);
create policy "quotes supplier upd" on quotes for update using (
  exists (select 1 from suppliers s where s.id = supplier_id and s.owner_id = auth.uid())
);

-- Conversations & messages
create policy "convo parties" on conversations for all using (
  auth.uid() = buyer_id
  or exists (select 1 from suppliers s where s.id = supplier_id and s.owner_id = auth.uid())
);
create policy "messages parties read" on messages for select using (
  exists (select 1 from conversations c where c.id = conversation_id and (
    c.buyer_id = auth.uid()
    or exists (select 1 from suppliers s where s.id = c.supplier_id and s.owner_id = auth.uid())
  ))
);
create policy "messages send" on messages for insert with check (
  auth.uid() = sender_id
  and exists (select 1 from conversations c where c.id = conversation_id and (
    c.buyer_id = auth.uid()
    or exists (select 1 from suppliers s where s.id = c.supplier_id and s.owner_id = auth.uid())
  ))
);

-- Reviews: buyer writes own
create policy "reviews buyer write" on reviews for insert with check (auth.uid() = buyer_id);

-- =====================================================================
-- STORAGE BUCKETS
-- =====================================================================
-- Run in Supabase dashboard or via API:
--   insert into storage.buckets (id, name, public) values
--     ('product-images','product-images', true),
--     ('avatars','avatars', true),
--     ('supplier-logos','supplier-logos', true),
--     ('message-attachments','message-attachments', false);
--
-- Policies: auth users upload; public read on public buckets.

-- =====================================================================
-- REAL-TIME
-- =====================================================================
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table quotes;
