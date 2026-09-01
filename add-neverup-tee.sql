-- Never Give Up Print Tee (r10) — white — Supabase → SQL Editor → Run
-- প্রথমবার পিছনের ছবির ঘরটা বানিয়ে নেয় (একবারই লাগে, বারবার চালালেও ক্ষতি নেই)
alter table public.products add column if not exists img_back text;

insert into public.products
  (slug, name, gender, type, shape, price, old_price, tag, img, img_back, fabric, fit, care, colors, sizes, sort)
values
  ('r10', 'Never Give Up Print Tee', 'men', 'T-Shirt', 'tee', 180, null, 'New',
   'images/neverup-white-tee.jpg', 'images/neverup-black-tee-back.jpg',
   'Cotton jersey with a blue and orange “Never Give Up” front print', 'Regular, straight body',
   'Wash inside out, cold water, do not iron the print',
   '[{"n":"White","h":"#FFFFFF"}]'::jsonb,
   '[{"size":"L","chestMin":42,"chestMax":44.5,"length":31,"stock":1}]'::jsonb,
   150)
on conflict (slug) do update
  set name = excluded.name, price = excluded.price, tag = excluded.tag,
      img = excluded.img, img_back = excluded.img_back,
      fabric = excluded.fabric, fit = excluded.fit, care = excluded.care,
      colors = excluded.colors, sizes = excluded.sizes, sort = excluded.sort;
