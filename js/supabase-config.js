/* ============================================================
   Supabase connection settings
   ------------------------------------------------------------
   Supabase-এ প্রজেক্ট বানানোর পর  Project Settings → API  থেকে
   দুটো জিনিস কপি করে নিচে বসান, তারপর ফাইলটা সেভ করে push করুন।

     1. Project URL      →  window.SUPABASE_URL
     2. anon public key  →  window.SUPABASE_ANON_KEY

   দুটো ঘর ফাঁকা থাকলে দোকান আগের মতোই চলবে (কোডে লেখা প্রোডাক্ট
   দিয়ে), শুধু অ্যাডমিন প্যানেল আর অর্ডার সেভ হওয়া বন্ধ থাকবে।

   ⚠ anon key পাবলিক — এটা কোডে থাকাই স্বাভাবিক ও নিরাপদ।
     service_role key কখনও এখানে বসাবেন না।
   ============================================================ */

window.SUPABASE_URL      = "https://zrmrwuldfkptoltqmqop.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_9KkK_TAn0fqb2MSrfgwYBw_wL3kCc_u";

/* ছবির জন্য স্টোরেজ বাকেটের নাম — SQL-এ এই নামেই বানানো আছে */
window.SUPABASE_BUCKET   = "product-images";
