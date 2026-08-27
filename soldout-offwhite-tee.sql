-- Off White Cotton Tee (r01) — বিক্রি হয়ে গেছে
-- Supabase → SQL Editor → New query → পেস্ট করে Run
-- স্টক ০ করলেই সাইটে "বিক্রি হয়ে গেছে · Sold out" দেখাবে, প্রোডাক্টটা তালিকায় থাকবে।

update public.products
   set sizes = '[{"size":"M","chestMin":36,"chestMax":38.5,"length":27,"stock":0}]'::jsonb
 where slug = 'r01';

-- একেবারে লুকিয়ে ফেলতে চাইলে উপরেরটার বদলে এই লাইনটা চালান:
-- update public.products set active = false where slug = 'r01';
