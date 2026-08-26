-- Endurance Text Print Tee (r09) — Supabase → SQL Editor → Run
insert into public.products
  (slug, name, gender, type, shape, price, old_price, tag, img, fabric, fit, care, colors, sizes, sort)
values
  ('r09', 'Endurance Text Print Tee', 'men', 'T-Shirt', 'tee', 180, null, 'New', 'images/endurance-blue-tee.jpg',
   'Cotton jersey with a bold black text print', 'Regular, straight body', 'Wash inside out, cold water, do not iron the print',
   '[{"n":"Blue","h":"#1F3799"}]'::jsonb,
   '[{"size":"XL","chestMin":44,"chestMax":46.5,"length":29,"stock":1}]'::jsonb,
   140)
on conflict (slug) do update
  set name = excluded.name, price = excluded.price, tag = excluded.tag, img = excluded.img,
      fabric = excluded.fabric, fit = excluded.fit, care = excluded.care,
      colors = excluded.colors, sizes = excluded.sizes, sort = excluded.sort;
