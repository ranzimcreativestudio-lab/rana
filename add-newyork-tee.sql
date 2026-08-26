-- New York USA Print Tee (r08) — Supabase → SQL Editor → Run
insert into public.products
  (slug, name, gender, type, shape, price, old_price, tag, img, fabric, fit, care, colors, sizes, sort)
values
  ('r08', 'New York USA Print Tee', 'men', 'T-Shirt', 'tee', 180, null, 'New', 'images/newyork-black-tee.jpg',
   'Cotton jersey with a New York USA front print', 'Regular, straight body', 'Wash inside out, cold water, do not iron the print',
   '[{"n":"Black","h":"#161817"}]'::jsonb,
   '[{"size":"XL","chestMin":42,"chestMax":44.5,"length":31,"stock":2}]'::jsonb,
   130)
on conflict (slug) do update
  set name = excluded.name, price = excluded.price, tag = excluded.tag, img = excluded.img,
      fabric = excluded.fabric, fit = excluded.fit, care = excluded.care,
      colors = excluded.colors, sizes = excluded.sizes, sort = excluded.sort;
