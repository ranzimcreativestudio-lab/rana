# অ্যাডমিন প্যানেল চালু করার গাইড (Supabase)

এই ধাপগুলো একবারই করতে হবে — সব মিলিয়ে ১০–১৫ মিনিট।
শেষে `yoursite/admin.html` ঠিকানায় ইমেইল-পাসওয়ার্ড দিয়ে লগইন করে
অর্ডার দেখতে ও প্রোডাক্ট যোগ/বাদ দিতে পারবেন।

---

## ধাপ ১ — Supabase অ্যাকাউন্ট ও প্রজেক্ট

1. [supabase.com](https://supabase.com) → **Start your project** → GitHub দিয়ে সাইন আপ (ফ্রি)
2. **New project** চাপুন
   - Name: `dream-of-all`
   - Database Password: একটা শক্ত পাসওয়ার্ড দিন আর **কোথাও লিখে রাখুন** (এটা ডেটাবেজের পাসওয়ার্ড, আপনার লগইন পাসওয়ার্ড নয়)
   - Region: **Singapore** (বাংলাদেশের সবচেয়ে কাছে)
3. প্রজেক্ট তৈরি হতে ২–৩ মিনিট লাগে।

---

## ধাপ ২ — টেবিল বানানো

বাঁ পাশের মেনু থেকে **SQL Editor** → **New query** → নিচের পুরো কোডটা কপি করে
পেস্ট করুন → **Run** চাপুন।

```sql
-- ===== products =====
create table if not exists public.products (
  id          bigint generated always as identity primary key,
  slug        text unique,
  name        text not null,
  gender      text not null default 'men',
  type        text not null default 'T-Shirt',
  shape       text default 'tee',
  price       integer not null default 0,
  old_price   integer,
  tag         text,
  img         text,
  fabric      text,
  fit         text,
  care        text,
  colors      jsonb not null default '[]'::jsonb,
  sizes       jsonb not null default '[]'::jsonb,
  active      boolean not null default true,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ===== orders =====
create table if not exists public.orders (
  id           bigint generated always as identity primary key,
  code         text,
  name         text not null,
  phone        text not null,
  district     text not null,
  address      text not null,
  note         text,
  items        jsonb not null default '[]'::jsonb,
  subtotal     integer not null default 0,
  delivery     integer not null default 0,
  total        integer not null default 0,
  measurements jsonb,
  status       text not null default 'new',
  created_at   timestamptz not null default now()
);

-- ===== নিরাপত্তার নিয়ম (Row Level Security) =====
alter table public.products enable row level security;
alter table public.orders   enable row level security;

-- দোকানের যে কেউ প্রোডাক্ট দেখতে পাবে
drop policy if exists "products readable" on public.products;
create policy "products readable" on public.products
  for select using (true);

-- শুধু লগইন করা অ্যাডমিন প্রোডাক্ট যোগ/বদল/মুছতে পারবে
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated using (true) with check (true);

-- কাস্টমার অর্ডার দিতে পারবে (শুধু লিখতে, পড়তে নয়)
drop policy if exists "orders insert" on public.orders;
create policy "orders insert" on public.orders
  for insert with check (true);

-- অর্ডার পড়া/বদলানো/মোছা শুধু লগইন করা অ্যাডমিনের জন্য
drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read" on public.orders
  for select to authenticated using (true);

drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders
  for update to authenticated using (true) with check (true);

drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete" on public.orders
  for delete to authenticated using (true);
```

**Success. No rows returned** লেখা এলে ঠিক আছে।

---

## ধাপ ৩ — ছবির জন্য স্টোরেজ

1. মেনু → **Storage** → **New bucket**
   - Name: `product-images` (হুবহু এই নাম)
   - **Public bucket** টিক দিন → Save
2. আবার **SQL Editor** → New query → এটা Run করুন (ছবি আপলোডের অনুমতি):

```sql
drop policy if exists "product images readable" on storage.objects;
create policy "product images readable" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product images admin upload" on storage.objects;
create policy "product images admin upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');
```

---

## ধাপ ৪ — আপনার অ্যাডমিন ইউজার বানানো

1. মেনু → **Authentication** → **Users** → **Add user** → *Create new user*
   - Email: আপনার ইমেইল
   - Password: আপনার পছন্দের **শক্ত পাসওয়ার্ড** (এটাই লগইন পাসওয়ার্ড)
   - **Auto Confirm User** টিক দিন → Create user
2. মেনু → **Authentication** → **Sign In / Providers** →
   **Allow new users to sign up** বন্ধ (off) করে দিন।
   এতে বাইরের কেউ নিজে অ্যাকাউন্ট খুলতে পারবে না — শুধু আপনিই ঢুকতে পারবেন।

---

## ধাপ ৫ — কী দুটো কোডে বসানো

1. মেনু → **Project Settings** → **API**
2. দুটো জিনিস কপি করুন:
   - **Project URL** (যেমন `https://abcdxyz.supabase.co`)
   - **anon public** key (লম্বা একটা লেখা)
3. `js/supabase-config.js` ফাইলটা Notepad-এ খুলে বসান:

```js
window.SUPABASE_URL      = "https://abcdxyz.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOi....(আপনার লম্বা key)";
```

4. সেভ করে push করুন:

```cmd
cd /d D:\halfseam-store
git add js\supabase-config.js
git commit -m "Connect the store to Supabase"
git push origin main
```

> anon key পাবলিক — এটা কোডে থাকা স্বাভাবিক ও নিরাপদ, কারণ উপরের RLS নিয়মগুলো
> ঠিক করে দেয় কে কী করতে পারবে। **service_role key কখনও কোডে বসাবেন না।**

---

## ধাপ ৬ — প্রোডাক্ট তুলুন

1. `https://<আপনার সাইট>/admin.html` খুলুন → ইমেইল-পাসওয়ার্ড দিয়ে লগইন করুন
2. **Products** → **+ Add product** → নাম, দাম, ছবি, রঙ, সাইজ (chest from/to, length, stock) দিয়ে Save

> ডেটাবেজে অন্তত একটা প্রোডাক্ট থাকলে দোকান **ডেটাবেজ থেকেই** প্রোডাক্ট দেখাবে।
> ডেটাবেজ ফাঁকা থাকলে আগের মতো কোডে লেখা প্রোডাক্টগুলোই দেখাবে — তাই ধাপে ধাপে
> সব প্রোডাক্ট অ্যাডমিন প্যানেলে তুলে নিলে ভালো।

---

## এরপর যেভাবে চলবে

- কাস্টমার অর্ডার ফর্ম পূরণ করে Confirm চাপলে অর্ডারটা **ডেটাবেজে জমা হবে** এবং
  WhatsApp-ও খুলবে — অর্থাৎ কেউ WhatsApp-এ Send না চাপলেও অর্ডারটা আপনি দেখতে পাবেন।
- **Orders** ট্যাবে প্রতিটি অর্ডারের নাম, ফোন (WhatsApp লিংকসহ), ঠিকানা, আইটেম,
  ডেলিভারি চার্জ, মোট টাকা ও মাপ দেখা যাবে; স্ট্যাটাস বদলানো যাবে
  (new → confirmed → delivered / cancelled)।
- স্টক শেষ হলে প্রোডাক্টের stock 0 করে দিন বা "Show this piece in the shop" টিক তুলে দিন।

## সমস্যা হলে

| সমস্যা | কারণ / সমাধান |
|---|---|
| admin.html-এ "Not connected yet" | `js/supabase-config.js`-এ URL/key বসানো হয়নি বা push হয়নি |
| "Wrong email or password" | ধাপ ৪-এর ইউজারটা বানানো হয়নি, বা Auto Confirm টিক দেওয়া হয়নি |
| প্রোডাক্ট সেভ হয় না | ধাপ ২-এর RLS পলিসি Run হয়নি |
| ছবি আপলোড হয় না | ধাপ ৩-এর bucket বা পলিসি বাদ পড়েছে |
| দোকানে নতুন প্রোডাক্ট দেখাচ্ছে না | "Show this piece in the shop" টিক আছে কিনা দেখুন, তারপর Ctrl+F5 |
