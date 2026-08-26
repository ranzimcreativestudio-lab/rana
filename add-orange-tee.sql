-- Orange Reflective Stripe Tee (r05) — Supabase → SQL Editor → Run
insert into public.products
  (slug, name, gender, type, shape, price, old_price, tag, img, fabric, fit, care, colors, sizes, sort)
values
  ('r05', 'Orange Reflective Stripe Tee', 'men', 'T-Shirt', 'tee', 180, null, 'New', 'images/orange-reflective-tee.jpg',
   'Cotton jersey with a white reflective chest stripe', 'Regular, straight body', 'Wash inside out, cold water, do not iron the stripe',
   '[{"n":"Safety Orange","h":"#FA7002"}]'::jsonb,
   '[{"size":"S","chestMin":36,"chestMax":38.5,"length":28,"stock":1},
     {"size":"L","chestMin":42,"chestMax":44.5,"length":29,"stock":2},
     {"size":"XL","chestMin":46,"chestMax":48.5,"length":29,"stock":1},
     {"size":"XXL","chestMin":48,"chestMax":50.5,"length":30,"stock":1}]'::jsonb,
   100)
on conflict (slug) do update
  set name = excluded.name, price = excluded.price, tag = excluded.tag, img = excluded.img,
      fabric = excluded.fabric, fit = excluded.fit, care = excluded.care,
      colors = excluded.colors, sizes = excluded.sizes, sort = excluded.sort;
