/* ============================================================
   ProwdFashion — the white squirrel guide  (কাঠবিড়ালি)
   ------------------------------------------------------------
   A white squirrel lives on the page. It hops to whatever is in
   front of the visitor RIGHT NOW, sits down beside it, raises a
   paw at it and says what it is in Bengali.

   Three rules it keeps:
     1. It never scrolls the page by itself. It only ever talks
        about what is already on the visitor's screen.
     2. It follows the visitor into the product sheet, the bag
        and the order form, and walks them through each step up
        to placing the order.
     3. It listens. Tap the mic and speak Bengali — "নারী",
        "ব্যাগে রাখো", "এটা ক্লিক করো" — and it hops there,
        points and clicks.

   It will never press the final "Confirm order" button itself.
   It points at it and leaves that press to the visitor.

   Self-contained: injects its own CSS and markup, touches none
   of the shop's state. pointer-events are off everywhere except
   the squirrel's own small hit area, the mic and the close button.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "prowdfashion.squirrel.off";
  var REDUCED = window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* The × used to hide him for ever. It no longer does — it tucks him away
     for this page view only, and leaves a small button to call him back.
     Anyone who dismissed the old version gets him back on the next load. */
  try { if (localStorage.getItem(KEY)) localStorage.removeItem(KEY); } catch (e) {}

  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ============================================================
     1. WHAT IT TALKS ABOUT, PER SITUATION
     ============================================================ */
  var TOURS = {
    /* browsing the shop */
    shop: [
      { sel: "#genderChips", say: "পোশাকটি নারীর জন্য না পুরুষের জন্য, এখান থেকে নির্বাচন করুন।" },
      { sel: "#typeChips",   say: "পোশাকের ধরন অনুসারে দেখতে চাইলে এখান থেকে বেছে নিন।" },
      { sel: "#q",           say: "পছন্দের পোশাকের নাম লিখে সরাসরি খুঁজে নিতে পারেন।" },
      { sel: "#sort",        say: "মূল্য অনুসারে সাজিয়ে নিতে চাইলে এখান থেকে নির্বাচন করুন।" },
      { sel: "#grid .card",  say: "ছবিটির উপরে চাপ দিলে মাপ ও বিস্তারিত বিবরণ দেখতে পাবেন।" },
      { sel: "#cartBtn",     say: "পছন্দ হলে ঝুড়িতে রাখুন, সেগুলি এখানেই জমা থাকবে।" },
      { sel: "#waTalk",      say: "কোনো প্রশ্ন থাকলে হোয়াটসঅ্যাপে সরাসরি জানাতে পারেন।" },
      { sel: "#themeBtn",    say: "রাতে চোখের আরামের জন্য এই বোতামটিতে চাপ দিন।" }
    ],
    /* a product is open */
    detail: [
      { sel: ".sheet-media, .shot", say: "ছবিটির উপরে চাপ দিলে বড় করে দেখতে পাবেন।" },
      { sel: ".swatches, [data-sw]", say: "রং এখান থেকে পরিবর্তন করে নিতে পারেন।" },
      { sel: ".sizes",      say: "প্রথমে মাপ নির্বাচন করুন; নিচের তালিকার সঙ্গে মিলিয়ে নিতে পারেন।" },
      { sel: ".size-chart", say: "বুক ও দৈর্ঘ্যের মাপ এখানে দেওয়া আছে।" },
      { sel: ".stepper",    say: "কয়টি নেবেন, এখান থেকে বাড়াতে বা কমাতে পারেন।" },
      { sel: "#addBtn",     say: "ঝুড়িতে রাখতে হলে এই বোতামটিতে চাপ দিন।" },
      { sel: "#buyBtn",     say: "সরাসরি কিনতে চাইলে ‘Buy Now’ বোতামটিতে চাপ দিন।" }
    ],
    /* the bag */
    cart: [
      { sel: "#cartBody .lrow, #cartBody", say: "এখান থেকেই সংখ্যা বাড়ানো বা কমানো যায়।" },
      { sel: "#cartFoot",  say: "পাঁচশো টাকার বেশি হলে পৌঁছে দেওয়ার খরচ লাগবে না।" },
      { sel: "#checkout",  say: "সব ঠিক থাকলে ‘Place order’ বোতামটিতে চাপ দিন।" }
    ],
    /* the order form */
    order: [
      { sel: "#oName",  say: "এখানে আপনার নাম লিখুন।" },
      { sel: "#oPhone", say: "এগারো অঙ্কের মুঠোফোন নম্বর দিন; এই নম্বরেই যোগাযোগ করা হবে।" },
      { sel: "#oDist",  say: "আপনার জেলার নাম লিখুন।" },
      { sel: "#oAddr",  say: "বাড়ি, সড়ক ও এলাকার নাম লিখুন, যাতে সহজে খুঁজে পাওয়া যায়।" },
      { sel: "#oPromo", say: "ছাড়ের কোড থাকলে এখানে লিখুন।" },
      { sel: "#orderSum", say: "সর্বমোট কত হচ্ছে, একবার দেখে নিন।" },
      { sel: "#orderGo", say: "সব ঠিক থাকলে শেষ চাপটি আপনি নিজেই দিন।" }
    ]
  };

  /* ============================================================
     2. WHAT IT UNDERSTANDS WHEN YOU SPEAK (Bengali, then English)
     ============================================================ */
  /* Most specific phrases first: "ব্যাগে রাখো" must win over "ব্যাগ". */
  var VOICE = [
    { w: ["ব্যাগে রাখ", "ঝুড়িতে রাখ", "ব্যাগে দাও", "ব্যাগে ভর", "অ্যাড কর", "add to bag",
      "add to cart", "add", "bagে rakho", "bag e rakho", "rakho", "डालो", "जोड़ो",
      "अ‍ॅड", "أضف"],
      sel: "#addBtn", say: "ঝুড়িতে রেখে দিচ্ছি।" },
    { w: ["অর্ডার কর", "অর্ডার দাও", "অর্ডার দিব", "place order", "checkout",
      "check out", "order koro", "order", "ऑर्डर", "आर्डर", "اطلب", "اطلب الآن"],
      sel: "#checkout", via: "#cartBtn", viaSay: "ঝুড়ি খুলে ক্রয়ের ধাপে যাচ্ছি।",
      say: "ক্রয়ের ফরমটি খুলে দিচ্ছি।" },
    { w: ["কনফার্ম", "নিশ্চিত", "confirm", "कन्फर्म", "पुष्टि", "تأكيد"],
      sel: "#orderGo", noClick: true,
      say: "শেষ চাপটি আপনি নিজেই দিন; এটিতে আমি চাপ দেব না।" },
    { w: ["সাইজ চার্ট", "মাপের চার্ট", "মাপ দেখ", "size chart"], sel: ".size-chart",
      noClick: true, say: "এই যে মাপের তালিকা।" },
    { w: ["এখনি কিন", "কিনব", "কিনবো", "buy now", "buy", "kino", "kinbo",
      "खरीद", "अभी खरीदें", "اشتر"], sel: "#buyBtn",
      say: "কেনার ধাপে নিয়ে যাচ্ছি।" },
    { w: ["নারী", "মেয়ে", "women", "woman", "ladies", "female", "nari", "meye",
      "mohila", "महिला", "औरत", "लेडीज", "نساء", "femme", "mujer"],
      sel: '#genderChips [data-gender="women"]',
      say: "নারীদের পোশাকগুলি দেখাচ্ছি।" },
    { w: ["পুরুষ", "ছেলে", "men", "man", "gents", "male", "purush", "chele",
      "पुरुष", "आदमी", "मर्द", "رجال", "homme", "hombre"],
      sel: '#genderChips [data-gender="men"]',
      say: "পুরুষদের পোশাকগুলি দেখাচ্ছি।" },
    { w: ["সবাই", "সবকিছু", "সব দেখ", "সবগুলো", "everyone", "everybody", "all",
      "shob", "सब", "सभी", "الكل", "todos", "tout"],
      sel: '#genderChips [data-gender="all"]',
      say: "সবগুলি দেখাচ্ছি।" },
    { w: ["ব্যাগ", "ঝুড়ি", "কার্ট", "bag", "cart", "basket", "byag", "बैग", "थैला",
      "टोकरी", "حقيبة", "panier", "carrito"],
      sel: "#cartBtn", say: "ঝুড়িটি খুলে দিচ্ছি।" },
    { w: ["খোঁজ", "খুঁজ", "সার্চ", "search", "find", "khojo", "khujo",
      "खोज", "ढूंढ", "सर्च", "ابحث", "buscar", "chercher"],
      sel: "#q", focus: true,
      say: "লিখুন, আমি খুঁজে দিচ্ছি।" },
    { w: ["থিম", "রাত", "অন্ধকার", "আলো", "theme", "dark", "light", "night",
      "डार्क", "रात", "थीम", "ليل", "oscuro"], sel: "#themeBtn",
      say: "পর্দার সাজ পরিবর্তন করে দিলাম।" },
    { w: ["হোয়াটস", "whatsapp"], sel: "#waTalk", noClick: true,
      say: "এখানে চাপ দিলে হোয়াটসঅ্যাপ খুলবে; চাপটি আপনি দিন।" },
    { w: ["বাড়াও", "বাড়া", "আরেকটা", "more", "plus", "increase", "barao",
      "बढ़ाओ", "और", "زد"], sel: '.stepper [data-q="1"]',
      say: "একটি বাড়িয়ে দিলাম।" },
    { w: ["কমাও", "কমা", "less", "minus", "decrease", "komao", "घटाओ", "कम",
      "قلل"], sel: '.stepper [data-q="-1"]', say: "একটি কমিয়ে দিলাম।" },
    { w: ["সাজাও", "সর্ট", "sort"], sel: "#sort", focus: true, say: "এখান থেকে সাজিয়ে নিন।" },
    { w: ["রঙ", "রং", "কালার", "colour", "color", "rong", "रंग", "لون"],
      sel: ".swatches", noClick: true,
      say: "রং এখান থেকে বেছে নিন।" },
    /* the order form, field by field */
    { w: ["নাম লিখ", "নাম বস", "আপনার নাম", "your name"], sel: "#oName", focus: true,
      say: "নামটি এখানে লিখুন।" },
    { w: ["মোবাইল", "ফোন", "নম্বর", "mobile", "phone"], sel: "#oPhone", focus: true,
      say: "এগারো অঙ্কের নম্বরটি এখানে দিন।" },
    { w: ["জেলা", "district"], sel: "#oDist", focus: true, say: "জেলার নামটি এখানে লিখুন।" },
    { w: ["ঠিকানা", "বাসা", "address"], sel: "#oAddr", focus: true,
      say: "পুরো ঠিকানা এখানে লিখুন।" },
    { w: ["প্রমো", "কুপন", "promo", "coupon"], sel: "#oPromo", focus: true,
      say: "কোডটি এখানে লিখুন।" },
    { w: ["মোট", "টোটাল", "total"], sel: "#orderSum", noClick: true,
      say: "সর্বমোট এতটুকুই হচ্ছে।" },
    { w: ["বন্ধ", "ক্লোজ", "close", "bondho", "बंद", "क्लोज", "أغلق",
      "cerrar", "fermer"], act: "close", say: "বন্ধ করে দিলাম।" },
    { w: ["উপরে", "উপর", "up", "top", "upore", "ऊपर", "फوق", "arriba"],
      act: "up", say: "উপরের দিকে যাচ্ছি।" },
    { w: ["নিচে", "নিচ", "down", "niche", "नीचे", "أسفل", "abajo"],
      act: "down", say: "নিচের দিকে যাচ্ছি।" },
    { w: ["পরের", "পরবর্তী", "next", "porer", "अगला", "आगे", "التالي",
      "siguiente", "suivant"], act: "next", say: "" },
    { w: ["থাম", "চুপ", "stop", "quiet", "thamo", "chup", "रुको", "चुप",
      "توقف", "alto"], act: "stop", say: "বেশ, আমি চুপ করে থাকছি।" },
    { w: ["লুকাও", "চলে যাও", "hide", "go away", "lukao", "छिपो", "जाओ",
      "اختف"], act: "hide", say: "" }
  ];

  var ORDINALS = [
    { w: ["প্রথম", "১", "এক ", "first", "one", "prothom", "pehla", "पहला", "1"], n: 1 },
    { w: ["দ্বিতীয়", "২", "দুই", "second", "two", "ditiyo", "dusra", "दूसरा", "2"], n: 2 },
    { w: ["তৃতীয়", "৩", "তিন", "third", "three", "tritiyo", "tisra", "तीसरा", "3"], n: 3 },
    { w: ["চতুর্থ", "৪", "চার", "fourth", "four", "chouth", "चौथा", "4"], n: 4 },
    { w: ["পঞ্চম", "৫", "পাঁচ", "fifth", "five", "पांचवां", "5"], n: 5 },
    { w: ["ষষ্ঠ", "৬", "ছয়", "sixth", "six", "छठा", "6"], n: 6 }
  ];
  var CLICK_WORDS = ["ক্লিক", "চাপ", "টিপ", "প্রেস", "খোল", "দেখাও", "সিলেক্ট",
    "click", "press", "open", "tap", "select", "choose", "hit",
    "kholo", "khulo", "chap", "tipo", "dekhao",
    "दबाओ", "खोलो", "चुनो", "क्लिक", "اضغط", "افتح", "haz", "clique"];

  /* ============================================================
     3. STYLES
     ============================================================ */
  var CSS = [
    /* above the sheets (z 90) and the order gate (z 120) so it can
       keep guiding once a product or the order form is open */
    '.sq-layer{position:fixed;inset:0;z-index:130;pointer-events:none;}',
    '.sq-layer[hidden]{display:none!important;}',

    '.sq{position:fixed;left:0;top:0;width:104px;height:104px;',
    '  pointer-events:none;will-change:transform;}',
    /* only this small disc takes clicks, so it can never block a button */
    '.sq-hit{position:absolute;left:24%;top:26%;width:52%;height:56%;border-radius:50%;',
    '  pointer-events:auto;cursor:pointer;}',
    '.sq-svg{width:100%;height:100%;overflow:visible;display:block;}',
    '.sq[data-face="left"] .sq-svg{transform:scaleX(-1);}',

    /* the bits that move */
    '.sq .sq-tail{transform-origin:64px 112px;animation:sq-tail 3.1s ease-in-out infinite;}',
    '.sq .sq-head{transform-origin:88px 54px;animation:sq-head 6.2s ease-in-out infinite;}',
    '.sq .sq-ear{transform-origin:94px 32px;animation:sq-ear 7s ease-in-out infinite;}',
    '.sq .sq-lid{transform-origin:104px 42px;animation:sq-blink 5.6s infinite;}',
    '.sq .sq-arm{transform-origin:91px 65px;',
    '  transition:transform .5s cubic-bezier(.34,1.56,.64,1);}',
    '.sq[data-point="1"] .sq-arm{transform:rotate(-48deg);}',
    '.sq[data-hop="1"] .sq-tail{animation:sq-tail-hop .55s ease-in-out infinite;}',
    '.sq-shadow{transition:opacity .2s ease;}',
    '.sq[data-hop="1"] .sq-shadow{opacity:.06;}',

    '@keyframes sq-tail{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(4.5deg)}}',
    '@keyframes sq-tail-hop{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}',
    '@keyframes sq-head{0%,100%{transform:rotate(0) translateY(0)}',
    '  28%{transform:rotate(-3deg) translateY(-.6px)}',
    '  60%{transform:rotate(2.4deg) translateY(.4px)}}',
    '@keyframes sq-ear{0%,84%,100%{transform:rotate(0)}88%{transform:rotate(-12deg)}',
    '  93%{transform:rotate(6deg)}}',
    '@keyframes sq-blink{0%,93.5%,100%{transform:scaleY(0)}95.5%{transform:scaleY(1)}}',

    /* speech bubble */
    '.sq-say{position:fixed;max-width:252px;padding:11px 14px;border-radius:14px;',
    '  background:var(--surface,#fff);color:var(--ink,#150F13);',
    '  border:1.5px solid var(--accent,#C20B74);',
    '  box-shadow:0 16px 38px -16px rgba(35,10,26,.48);',
    '  font-family:"Hind Siliguri",system-ui,sans-serif;font-size:14.5px;line-height:1.65;',
    '  opacity:0;transform:translateY(6px) scale(.96);',
    '  transition:opacity .25s ease,transform .25s cubic-bezier(.34,1.56,.64,1);}',
    '.sq-say[data-on="1"]{opacity:1;transform:translateY(0) scale(1);}',
    '.sq-say::after{content:"";position:absolute;bottom:-8px;left:22px;width:13px;height:13px;',
    '  background:var(--surface,#fff);border-right:1.5px solid var(--accent,#C20B74);',
    '  border-bottom:1.5px solid var(--accent,#C20B74);transform:rotate(45deg);}',
    '.sq-say[data-tail="right"]::after{left:auto;right:22px;}',
    '.sq-say[data-below="1"]::after{bottom:auto;top:-8px;',
    '  border-right:none;border-bottom:none;',
    '  border-left:1.5px solid var(--accent,#C20B74);',
    '  border-top:1.5px solid var(--accent,#C20B74);}',

    /* the ring drawn around whatever it points at */
    '.sq-ring{position:fixed;border:2.5px dashed var(--accent,#C20B74);border-radius:12px;',
    '  opacity:0;transition:opacity .3s ease,top .35s ease,left .35s ease,',
    '  width .35s ease,height .35s ease;}',
    '.sq-ring[data-on="1"]{opacity:.9;animation:sq-pulse 1.5s ease-in-out infinite;}',
    '@keyframes sq-pulse{0%,100%{box-shadow:0 0 0 0 rgba(194,11,116,.30)}',
    '  50%{box-shadow:0 0 0 7px rgba(194,11,116,0)}}',

    /* mic + dismiss, tucked under him */
    '.sq-btns{position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);',
    '  display:flex;gap:6px;pointer-events:none;}',
    '.sq-btn{width:24px;height:24px;border-radius:50%;padding:0;cursor:pointer;',
    '  pointer-events:auto;display:flex;align-items:center;justify-content:center;',
    '  border:1.5px solid var(--line-2,#D2BBCB);background:var(--surface,#fff);',
    '  color:var(--ink-2,#665A61);font-size:12px;line-height:1;',
    '  opacity:0;transition:opacity .2s ease,border-color .2s ease,color .2s ease;',
    '  box-shadow:0 4px 12px -6px rgba(35,10,26,.5);}',
    '.sq-btn:hover{border-color:var(--accent,#C20B74);color:var(--accent,#C20B74);}',
    '.sq:hover .sq-btn,.sq-btn:focus{opacity:1;}',
    '.sq-mic[data-on="1"]{opacity:1;background:var(--accent,#C20B74);color:#fff;',
    '  border-color:var(--accent,#C20B74);animation:sq-mic 1.4s ease-in-out infinite;}',
    '@keyframes sq-mic{0%,100%{box-shadow:0 0 0 0 rgba(194,11,116,.45)}',
    '  70%{box-shadow:0 0 0 9px rgba(194,11,116,0)}}',
    '.sq-mic svg{width:12px;height:12px;fill:currentColor;display:block;}',

    /* small screens */
    '@media (max-width:620px){',
    '  .sq{width:84px;height:84px;}',
    '  .sq-say{max-width:190px;font-size:13.5px;padding:9px 12px;}',
    /* the mic stays findable; the × only after a tap, so it is not hit by accident */
    '  .sq .sq-mic{opacity:.92;}',
    '  .sq .sq-x{opacity:0;}',
    '  .sq[data-btns="1"] .sq-x{opacity:1;}',
    '}',
    '@media (max-width:380px){',
    '  .sq{width:74px;height:74px;}',
    '  .sq-say{max-width:168px;font-size:13px;}',
    '  .sq-btn{width:22px;height:22px;}',
    '}',
    /* the little button that calls him back after the × */
    '.sq-back{position:fixed;right:14px;bottom:14px;width:46px;height:46px;',
    '  border-radius:50%;padding:0;cursor:pointer;pointer-events:auto;',
    '  display:flex;align-items:center;justify-content:center;',
    '  border:1.5px solid var(--line-2,#D2BBCB);background:var(--surface,#fff);',
    '  box-shadow:0 10px 26px -12px rgba(35,10,26,.55);}',
    '.sq-back[hidden]{display:none;}',
    '.sq-back:hover{border-color:var(--accent,#C20B74);}',
    '.sq-back svg{width:26px;height:26px;display:block;}',
    '@media (prefers-reduced-motion:reduce){',
    '  .sq .sq-tail,.sq .sq-head,.sq .sq-ear,.sq .sq-lid,.sq-ring[data-on="1"],',
    '  .sq-mic[data-on="1"]{animation:none!important;}',
    '}'
  ].join("");

  /* ============================================================
     4. THE DRAWING
     A sitting squirrel, facing right, the way one actually sits
     when it stops to look at something: weight on the haunch,
     spine upright, tail plumed up behind the back, forepaws held
     at the chest.

     Realism comes from four things, not from more outline:
       · a turbulence filter that frays every fur silhouette, so
         no edge is a clean vector curve;
       · form shading — radial gradients, not flat fills;
       · a tail built from overlapping plume strokes rather than
         one shape;
       · a wet-looking eye with two catchlights and a lid shadow.
     ============================================================ */
  var SVG = [
    '<svg class="sq-svg" viewBox="0 0 130 130" aria-hidden="true">',
      '<defs>',
        /* frays the outline of anything furry */
        '<filter id="sqFray" x="-25%" y="-25%" width="150%" height="150%">',
          '<feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="4"',
          '   seed="11" result="n"/>',
          '<feDisplacementMap in="SourceGraphic" in2="n" scale="3.1"',
          '   xChannelSelector="R" yChannelSelector="G"/>',
        '</filter>',
        /* a soft feathered halo — blurred, then pulled apart by noise. This
           is what makes the tail read as thousands of hairs instead of a shape. */
        '<filter id="sqFluff" x="-40%" y="-40%" width="180%" height="180%">',
          '<feGaussianBlur stdDeviation="1.5" result="bl"/>',
          '<feTurbulence type="fractalNoise" baseFrequency=".42" numOctaves="4"',
          '   seed="31" result="nf"/>',
          '<feDisplacementMap in="bl" in2="nf" scale="9"',
          '   xChannelSelector="R" yChannelSelector="G"/>',
        '</filter>',
        '<filter id="sqFrayTail" x="-25%" y="-25%" width="150%" height="150%">',
          '<feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="4"',
          '   seed="19" result="nt"/>',
          '<feDisplacementMap in="SourceGraphic" in2="nt" scale="2.2"',
          '   xChannelSelector="R" yChannelSelector="G"/>',
        '</filter>',
        '<filter id="sqFrayFine" x="-25%" y="-25%" width="150%" height="150%">',
          '<feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3"',
          '   seed="4" result="n2"/>',
          '<feDisplacementMap in="SourceGraphic" in2="n2" scale="1.7"',
          '   xChannelSelector="R" yChannelSelector="G"/>',
        '</filter>',
        '<radialGradient id="sqBody" cx=".66" cy=".3" r=".85">',
          '<stop offset="0" stop-color="#FFFFFF"/>',
          '<stop offset=".45" stop-color="#F7F2F6"/>',
          '<stop offset=".8" stop-color="#E3D7E0"/>',
          '<stop offset="1" stop-color="#CDBCC9"/>',
        '</radialGradient>',
        '<radialGradient id="sqHeadG" cx=".62" cy=".28" r=".9">',
          '<stop offset="0" stop-color="#FFFFFF"/>',
          '<stop offset=".55" stop-color="#F8F3F7"/>',
          '<stop offset="1" stop-color="#DACCD6"/>',
        '</radialGradient>',
        '<linearGradient id="sqPlume" x1=".15" y1="1" x2=".85" y2="0">',
          '<stop offset="0" stop-color="#DACCD6"/>',
          '<stop offset=".4" stop-color="#F6F1F5"/>',
          '<stop offset=".8" stop-color="#FFFFFF"/>',
          '<stop offset="1" stop-color="#F2EAF0"/>',
        '</linearGradient>',
        '<linearGradient id="sqBelly" x1=".2" y1="0" x2=".8" y2="1">',
          '<stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/>',
          '<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>',
        '</linearGradient>',
        /* an albino squirrel's eye: ruby, lit from behind, not black */
        '<radialGradient id="sqEye" cx=".33" cy=".25" r="1">',
          '<stop offset="0" stop-color="#F7BDD1"/>',
          '<stop offset=".3" stop-color="#DC6C90"/>',
          '<stop offset=".62" stop-color="#B23A62"/>',
          '<stop offset="1" stop-color="#6B1633"/>',
        '</radialGradient>',
        '<radialGradient id="sqNose" cx=".35" cy=".28" r=".9">',
          '<stop offset="0" stop-color="#F0AEC4"/>',
          '<stop offset="1" stop-color="#C2647F"/>',
        '</radialGradient>',
      '</defs>',

      /* contact shadow on the ground */
      '<ellipse class="sq-shadow" cx="84" cy="121" rx="29" ry="5.2"',
      '   fill="#2A0F20" opacity=".16"/>',

      /* ------------------------- tail -------------------------
         Plume: a frayed silhouette, then overlapping strokes that
         run WITH the hair, lightest on the outside of the curve. */
      '<g class="sq-tail">',
        /* the feathered halo first — a blurred, noise-torn version of the
           plume, sitting behind it, so the outline never ends on a clean line */
        '<g filter="url(#sqFluff)" opacity=".9">',
          '<path d="M78 116 C50 120 26 108 15 84 C4 60 10 30 30 14 C44 2 62 -2 76 3 C62 11 53 26 49 46 C45 68 53 92 68 106 C71 110 75 113 78 116 Z"',
          '   fill="#F4EDF2" stroke="#F4EDF2" stroke-width="15"',
          '   stroke-linejoin="round" stroke-linecap="round"/>',
        '</g>',
        /* the plume itself */
        '<g filter="url(#sqFrayTail)">',
          '<path d="M78 116 C50 120 26 108 15 84 C4 60 10 30 30 14 C44 2 62 -2 76 3 C62 11 53 26 49 46 C45 68 53 92 68 106 C71 110 75 113 78 116 Z"',
          '   fill="url(#sqTail)" stroke="url(#sqTail)" stroke-width="8"',
          '   stroke-linejoin="round" stroke-linecap="round"/>',
          '<path d="M72 108 C48 100 32 80 32 56 C32 34 44 14 66 5"',
          '   fill="none" stroke="#FFFFFF" stroke-width="20" stroke-linecap="round"',
          '   opacity=".55"/>',
        '</g>',
        /* individual hairs, running the way the fur actually lies */
        '<g filter="url(#sqFrayFine)" fill="none" stroke-linecap="round">',
          '<path d="M74 110 C50 101 36 81 36 57 C36 36 47 17 68 7"',
          '   stroke="#FFFFFF" stroke-width="2.6" opacity=".95"/>',
          '<path d="M68 113 C43 103 28 82 29 56 C30 34 42 14 64 3"',
          '   stroke="#EDE2EA" stroke-width="1.5" opacity=".7"/>',
          '<path d="M60 115 C36 104 22 82 24 56 C26 33 38 13 60 1"',
          '   stroke="#FBF7FA" stroke-width="1.8" opacity=".85"/>',
          '<path d="M78 108 C56 98 44 79 45 56 C46 36 54 19 74 8"',
          '   stroke="#E4D6E0" stroke-width="1.3" opacity=".6"/>',
          '<path d="M52 116 C30 104 18 83 21 58 C23 36 34 16 55 4"',
          '   stroke="#FFFFFF" stroke-width="1.4" opacity=".75"/>',
          '<path d="M44 115 C24 102 14 80 18 56" stroke="#F0E6ED"',
          '   stroke-width="1.2" opacity=".65"/>',
          /* hair tips breaking the outline */
          '<g stroke="#F6F1F5" stroke-width=".9" opacity=".8">',
            '<path d="M15 84 L7 88 M11 70 L3 71 M11 54 L3 51 M16 39 L8 34"/>',
            '<path d="M25 24 L19 16 M38 11 L34 3 M53 3 L51 -5 M68 1 L70 -7"/>',
            '<path d="M79 4 L86 -1 M22 98 L15 104 M33 108 L29 117 M48 117 L46 125"/>',
          '</g>',
          '<g stroke="#E8DBE5" stroke-width=".8" opacity=".55">',
            '<path d="M13 77 L5 79 M11 62 L3 61 M13 46 L5 42 M20 31 L13 25"/>',
            '<path d="M31 17 L26 9 M45 6 L43 -2 M61 1 L60 -7 M27 103 L21 110"/>',
          '</g>',
        '</g>',
      '</g>',

      /* ------------------------- haunch + body ------------------------- */
      '<g filter="url(#sqFray)">',
        '<path d="M88 58 C71 62 61 80 63 97 C65 112 79 120 94 117',
        '         C108 114 115 100 113 84 C111 67 100 55 88 58 Z"',
        '      fill="url(#sqBody)"/>',
      '</g>',
      /* pale chest catching the light */
      '<path d="M97 68 C88 77 85 94 91 106 C97 117 110 113 112 100',
      '         C114 86 107 71 100 65 Z" fill="url(#sqBelly)"/>',
      /* the line where the haunch meets the flank */
      '<path d="M72 78 C67 90 68 103 75 112" fill="none" stroke="#DBCBD6"',
      '   stroke-width="2" stroke-linecap="round" opacity=".75"/>',
      '<path d="M104 62 C112 72 116 88 112 102" fill="none" stroke="#D5C4D0"',
      '   stroke-width="1.8" stroke-linecap="round" opacity=".55"/>',
      /* short fur marks, following the body */
      '<g fill="none" stroke="#E4D6DF" stroke-width="1.2" stroke-linecap="round"',
      '   opacity=".6" filter="url(#sqFrayFine)">',
        '<path d="M70 72 q6 4 5 9 M68 88 q6 3 6 8 M74 101 q6 3 6 8"/>',
        '<path d="M100 74 q-5 5 -4 10 M103 90 q-5 4 -4 9"/>',
      '</g>',

      /* ------------------------- hind foot ------------------------- */
      '<g filter="url(#sqFrayFine)">',
        '<path d="M72 106 C64 109 63 118 72 120 C83 122 94 118 93 111',
        '         C92 104 80 103 72 106 Z" fill="#FCF9FB"/>',
      '</g>',
      '<path d="M76 119.5 L76 113 M82 120 L82 113 M88 118.5 L87 112"',
      '   stroke="#E0AFC4" stroke-width="1.3" stroke-linecap="round" fill="none"',
      '   opacity=".9"/>',

      /* ------------------- the arm that does the pointing -------------------
         A tapered limb with a small paw, drawn as filled shapes so it reads as
         an arm rather than an outline. A soft blurred shadow sits under it,
         because a white arm over a white chest needs something to separate it. */
      '<g class="sq-arm">',
        '<g filter="url(#sqFluff)" opacity=".45">',
          '<path d="M91 64 C97 64 104 71 110 81 C113 86 112 91 108 91',
          '         C104 91 98 84 93 76 C89 70 87 64 91 64 Z" fill="#B49CAF"/>',
        '</g>',
        '<g filter="url(#sqFrayFine)">',
          '<path d="M90 62 C96 62 103 69 109 79 C112 84 111 89 107 89',
          '         C103 89 97 82 92 74 C88 68 86 62 90 62 Z" fill="#FDFBFC"/>',
          '<path d="M104 83 C110 81 116 85 115 90 C114 95 107 96 103 93',
          '         C99 90 100 85 104 83 Z" fill="#FFFFFF"/>',
        '</g>',
        '<path d="M93 68 C98 72 104 78 108 85" fill="none" stroke="#D8C7D3"',
        '   stroke-width="1" stroke-linecap="round" opacity=".4"/>',
        /* toes, tipped pink the way a squirrel\u2019s are */
        '<path d="M110 84 L114 82 M113.5 88 L118 88.5 M111 92.5 L114 95.5"',
        '   stroke="#E0AFC4" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
      '</g>',

      /* ------------------------- head ------------------------- */
      '<g class="sq-head">',
        '<g class="sq-ear">',
          '<g filter="url(#sqFluff)" opacity=".55">',
            '<path d="M86 33 C82 18 89 5 97 7 C105 9 107 22 103 33 Z" fill="#F4EDF2"/>',
          '</g>',
          '<g filter="url(#sqFrayFine)">',
            '<path d="M87 32 C83 18 89 6 97 8 C104 10 106 22 102 32 Z" fill="#FCF9FB"/>',
          '</g>',
          '<path d="M90 30 C87.5 19 92 11 96.5 12.5 C101 14 102 22 99 30 Z"',
          '   fill="#F2B7D0" opacity=".9"/>',
          '<path d="M87 32 C83 18 89 6 97 8 C104 10 106 22 102 32" fill="none"',
          '   stroke="#D9C6D2" stroke-width="1.1" opacity=".55" stroke-linecap="round"/>',
          /* the two hairs that stick up off the ear */
          '<path d="M89.5 9 C88 6 88 4 89.5 3 M98.5 8.5 C99.5 5.5 100.5 4 102 3.5"',
          '   fill="none" stroke="#F0E6EE" stroke-width="1.3" stroke-linecap="round"',
          '   opacity=".85"/>',
        '</g>',
        /* skull and muzzle in one silhouette */
        '<g filter="url(#sqFray)">',
          '<path d="M84 31 C71 37 68 54 79 63 C89 72 106 70 115 61',
          '         C119 57 125 54 125 49 C125 44 120 41 117 37 C111 28 93 26 84 31 Z"',
          '      fill="url(#sqHeadG)"/>',
        '</g>',
        /* cheek and jaw fur */
        '<g fill="none" stroke="#DFD0DA" stroke-width="1.4" stroke-linecap="round"',
        '   opacity=".9">',
          '<path d="M78 56 q6 4 5 9 M86 63 q4 4 3 8 M95 66 q3 4 2 7"/>',
        '</g>',
        /* brow ridge */
        '<path d="M97 34 q8 -2 13 3" fill="none" stroke="#D7C6D2" stroke-width="1.8"',
        '   stroke-linecap="round" opacity=".9"/>',
        /* eye: wet, dark, two catchlights, shadow under the lid */
        '<ellipse cx="104" cy="42" rx="5.6" ry="6" fill="url(#sqEye)"/>',
        '<path d="M98.6 39.5 A5.6 6 0 0 1 109 39" fill="none" stroke="#000"',
        '   stroke-width="1.7" opacity=".35" stroke-linecap="round"/>',
        '<circle cx="106.1" cy="39.4" r="1.8" fill="#fff"/>',
        '<circle cx="101.8" cy="44.6" r=".95" fill="#fff" opacity=".6"/>',
        '<ellipse class="sq-lid" cx="104" cy="42" rx="6.2" ry="6.6" fill="url(#sqHeadG)"/>',
        /* nose and mouth */
        '<path d="M119 44.5 C124 43.5 127 46 125.5 49.5 C124 52.5 119.5 52.5 118 49.5 Z"',
        '   fill="url(#sqNose)"/>',
        '<path d="M121.5 46.5 q1.6 .5 1.9 1.9" stroke="#8A4A72" stroke-width=".9"',
        '   fill="none" stroke-linecap="round" opacity=".8"/>',
        '<path d="M120.5 52.5 q-2.5 3.2 -6 1.6" fill="none" stroke="#B096A6"',
        '   stroke-width="1.3" stroke-linecap="round"/>',
        /* whiskers, long and fine */
        '<g stroke="#CDBCC9" stroke-width=".8" stroke-linecap="round" fill="none"',
        '   opacity=".55" filter="url(#sqFrayFine)">',
          '<path d="M119 44.5 C123 41 126 38.5 129 36.5"/>',
          '<path d="M120 48.5 C124 48 127 48.5 129.5 49.5"/>',
          '<path d="M119 52 C122.5 54 125.5 56.5 128 59"/>',
          '<path d="M114 42 C117 38 119.5 35.5 121 33"/>',
        '</g>',
        /* chin and throat fluff */
        '<path d="M110 60 q4 4 3 7 M103 63 q3 4 2 7" fill="none" stroke="#EBDFE8"',
        '   stroke-width="1.5" stroke-linecap="round" opacity=".8"',
        '   filter="url(#sqFrayFine)"/>',
      '</g>',
    '</svg>'
  ].join("");

  var MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2Z"/></svg>';

  /* ============================================================
     5. BUILD
     ============================================================ */
  var style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  var layer = document.createElement("div");
  layer.className = "sq-layer";

  var ring = document.createElement("div");
  ring.className = "sq-ring";

  var say = document.createElement("div");
  say.className = "sq-say";
  say.setAttribute("role", "status");

  var sq = document.createElement("div");
  sq.className = "sq";
  sq.innerHTML = SVG;

  var hit = document.createElement("div");
  hit.className = "sq-hit";
  hit.setAttribute("role", "button");
  hit.setAttribute("tabindex", "0");
  hit.setAttribute("aria-label", "সহায়ক কাঠবিড়ালি — পরের কথাটি শুনুন");
  sq.appendChild(hit);

  var btns = document.createElement("div");
  btns.className = "sq-btns";

  var mic = document.createElement("button");
  mic.className = "sq-btn sq-mic";
  mic.type = "button";
  mic.innerHTML = MIC;
  mic.setAttribute("aria-label", "কণ্ঠে নির্দেশ দেওয়া চালু বা বন্ধ করুন");

  var x = document.createElement("button");
  x.className = "sq-btn sq-x";
  x.type = "button";
  x.textContent = "×";
  x.setAttribute("aria-label", "কাঠবিড়ালিটিকে সরিয়ে দিন");

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) btns.appendChild(mic);
  btns.appendChild(x);
  sq.appendChild(btns);

  /* the "come back" button, shown only after the × */
  var back = document.createElement("button");
  back.className = "sq-back";
  back.type = "button";
  back.hidden = true;
  back.setAttribute("aria-label", "কাঠবিড়ালিকে আবার ডাকুন");
  back.innerHTML = [
    '<svg viewBox="0 0 130 130" aria-hidden="true">',
      '<path d="M76 116 C48 118 25 105 16 82 C7 59 13 32 30 18 C43 7 60 2 76 5',
      '   C62 18 54 34 52 52 C50 72 56 92 68 104 C71 108 74 112 76 116 Z"',
      '   fill="#EFE6EC" stroke="#C9B4C4" stroke-width="2.5" stroke-linejoin="round"/>',
      '<path d="M88 58 C71 62 61 80 63 97 C65 112 79 120 94 117 C108 114 115 100 113 84',
      '   C111 67 100 55 88 58 Z" fill="#FFFFFF" stroke="#C9B4C4" stroke-width="2.5"/>',
      '<path d="M86 31 C81 12 94 2 102 12 C107 19 105 30 100 33 Z" fill="#FFFFFF"',
      '   stroke="#C9B4C4" stroke-width="2.5" stroke-linejoin="round"/>',
      '<path d="M84 31 C71 37 68 54 79 63 C89 72 106 70 115 61 C119 57 125 54 125 49',
      '   C125 44 120 41 117 37 C111 28 93 26 84 31 Z" fill="#FFFFFF"',
      '   stroke="#C9B4C4" stroke-width="2.5" stroke-linejoin="round"/>',
      '<ellipse cx="104" cy="42" rx="5" ry="5.4" fill="#31202B"/>',
      '<circle cx="106" cy="40" r="1.6" fill="#fff"/>',
      '<path d="M119 44.5 C124 43.5 127 46 125.5 49.5 C124 52.5 119.5 52.5 118 49.5 Z"',
      '   fill="#C27BA0"/>',
    '</svg>'
  ].join("");

  layer.appendChild(ring);
  layer.appendChild(say);
  layer.appendChild(sq);
  layer.appendChild(back);
  document.body.appendChild(layer);

  /* ============================================================
     6. MOVEMENT — little hops, anywhere on the screen
     ============================================================ */
  /* The visible box, not window.innerWidth. On a phone, if anything on the
     page is wider than the screen the browser widens the layout viewport and
     innerWidth reports that larger number — a fixed element clamped to it
     ends up off the side of the screen, which is exactly how he went missing
     on mobile. documentElement.clientWidth is the box the visitor can see. */
  var VW = function () {
    var d = document.documentElement;
    return Math.min(d && d.clientWidth ? d.clientWidth : window.innerWidth,
                    window.innerWidth || 99999);
  };
  var VH = function () {
    var d = document.documentElement;
    return Math.min(d && d.clientHeight ? d.clientHeight : window.innerHeight,
                    window.innerHeight || 99999);
  };
  var size = function () { return sq.offsetWidth || 104; };
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  var px = Math.round(VW() * 0.70);
  var py = Math.round(VH() - size() - 18);
  var raf = 0, moving = false, onDone = null;
  var fromX = px, fromY = py, toX = px, toY = py, t0 = 0, dur = 0, hops = 1;
  var bubbleSide = "right";

  function placeBubble() {
    if (say.dataset.on !== "1") return;
    var bw = say.offsetWidth, bh = say.offsetHeight, s = size();
    var left = (bubbleSide === "right") ? px + s / 2 - 26 : px + s / 2 + 26 - bw;
    var tail = (bubbleSide === "right") ? "left" : "right";
    left = clamp(left, 8, VW() - bw - 8);

    var above = py - bh - 12, under = py + s - 8;
    var top = above, below = "0";
    if (above < 8) { top = under; below = "1"; }

    /* if the bubble would land on the very thing he is pointing at,
       put it on his other side */
    if (ring.dataset.on === "1") {
      var rr = ring.getBoundingClientRect();
      var clash = function (t) {
        return !(left + bw < rr.left || left > rr.right ||
                 t + bh < rr.top || t > rr.bottom);
      };
      if (clash(top)) {
        var alt = (below === "1") ? above : under;
        if (alt >= 8 && alt + bh <= VH() - 8 && !clash(alt)) {
          top = alt; below = (below === "1") ? "0" : "1";
        }
      }
    }
    top = clamp(top, 8, VH() - bh - 8);

    say.dataset.tail = tail;
    say.dataset.below = below;
    say.style.left = Math.round(left) + "px";
    say.style.top = Math.round(top) + "px";
  }

  function draw(arc) {
    sq.style.transform = "translate(" + Math.round(px) + "px," +
                         Math.round(py + (arc || 0)) + "px)";
    placeBubble();
  }
  draw(0);

  function face(dx) {
    if (Math.abs(dx) < 6) return;
    sq.dataset.face = dx < 0 ? "left" : "right";
  }

  function finish() {
    moving = false;
    sq.dataset.hop = "0";
    raf = 0;
    var cb = onDone; onDone = null;
    if (cb) cb();
  }

  function tick(now) {
    var p = Math.min(1, (now - t0) / dur);
    var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    px = fromX + (toX - fromX) * e;
    py = fromY + (toY - fromY) * e;
    draw(-Math.abs(Math.sin(p * Math.PI * hops)) * 26);
    if (p < 1) { raf = requestAnimationFrame(tick); }
    else { draw(0); finish(); }
  }

  function hopTo(nx, ny, then) {
    var s = size();
    nx = clamp(Math.round(nx), 6, VW() - s - 6);
    ny = clamp(Math.round(ny), 54, VH() - s - 6);
    onDone = then || null;
    var dist = Math.sqrt((nx - px) * (nx - px) + (ny - py) * (ny - py));
    if (REDUCED || dist < 8) { face(nx - px); px = nx; py = ny; draw(0); finish(); return; }
    face(nx - px);
    fromX = px; fromY = py; toX = nx; toY = ny;
    hops = Math.max(1, Math.round(dist / 110));
    dur = 380 + hops * 190;
    t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    moving = true;
    sq.dataset.hop = "1";
    if (!raf) raf = requestAnimationFrame(tick);
  }

  /* sit beside the element, never on it */
  function spotFor(r) {
    var s = size(), gap = 10, vw = VW(), vh = VH();
    var y = clamp(Math.round(r.top + r.height / 2 - s / 2), 54, vh - s - 6);
    var right = Math.round(r.right + gap);
    if (right + s <= vw - 6) return { x: right, y: y, side: "right" };
    var left = Math.round(r.left - gap - s);
    if (left >= 6) return { x: left, y: y, side: "left" };
    var cx = clamp(Math.round(r.left + r.width / 2 - s / 2), 6, vw - s - 6);
    var under = Math.round(r.bottom + gap);
    if (under + s <= vh - 6) return { x: cx, y: under, side: "under" };
    return { x: cx, y: clamp(Math.round(r.top - gap - s), 54, vh - s - 6), side: "above" };
  }

  /* ============================================================
     7. POINTING AND TALKING
     ============================================================ */
  var timer = 0, hidden = false;
  var tour = [], idx = -1, given = 0, done = false;
  var MAX_TIPS = 8;
  var current = null;          /* the element he is pointing at right now */
  var busy = false;            /* a spoken command is being carried out */
  var mode = "";               /* shop | detail | cart | order */

  /* "on screen" means the visitor can actually see it: enough of it is
     inside the viewport AND it is not tucked under the sticky header.
     Anything that lives in the header itself is always visible. */
  function headerBottom() {
    var t = document.querySelector(".topbar");
    if (!t) return 0;
    var r = t.getBoundingClientRect();
    return r.top <= 1 ? r.bottom : 0;
  }
  function onScreen(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    if (r.right < 4 || r.left > VW() - 4) return false;
    var inBar = !!(el.closest && el.closest(".topbar"));
    var top = Math.max(r.top, inBar ? 0 : headerBottom());
    var bot = Math.min(r.bottom, VH() - 4);
    return (bot - top) >= Math.min(r.height, 44) * 0.6;
  }

  function clearTip() {
    say.dataset.on = "0";
    ring.dataset.on = "0";
    sq.dataset.point = "0";
    current = null;
  }

  function markRing(r) {
    ring.style.left = (r.left - 6) + "px";
    ring.style.top = (r.top - 6) + "px";
    ring.style.width = (r.width + 12) + "px";
    ring.style.height = (r.height + 12) + "px";
    ring.dataset.on = "1";
  }

  /* ---------------------------------------------------------------
     The voice. Browsers hand back a different list of voices on every
     device, so pick the best available: the right language first, then
     the right gender. If the device has no voice of that gender at all,
     shift the pitch so it still reads the way it should.

     To switch her back to a woman's voice, change ONE word below:
     WANT_VOICE = "female".
     --------------------------------------------------------------- */
  var WANT_VOICE = "male";          /* "male" or "female" */

  var VOICES = [], VOICE_PICK = null, VOICE_OK = false;
  var FEMALE_RE = /(female|woman|girl|\bfem\b|aarohi|swara|kalpana|tanishaa|priya|heera|veena|raveena|lekha|zira|susan|samantha|karen|moira|tessa|fiona|serena|amelie|nandini|sadia|anu|hazel|eva|linda|catherine|nora)/i;
  var MALE_RE = /(\bmale\b|\bman\b|\bboy\b|david|mark|rishi|hemant|ravi|prabhat|madhur|alex|daniel|fred|george|james|oliver|thomas|tom|aaron|arthur|gordon|nathan|ryan|eddy|reed|guy|brian|christopher|salman|tarik|amir|yusuf|kabir|rajesh)/i;

  function rankVoice(v) {
    var n = (v.name || "") + " " + (v.voiceURI || "");
    var sc = 0;
    if (/^bn/i.test(v.lang)) sc += 120;          /* Bengali above all */
    else if (/^en[-_]?IN/i.test(v.lang)) sc += 35;
    else if (/^hi/i.test(v.lang)) sc += 25;
    else if (/^en/i.test(v.lang)) sc += 12;
    var wantMale = (WANT_VOICE === "male");
    if (MALE_RE.test(n))   sc += wantMale ?  60 : -80;
    if (FEMALE_RE.test(n)) sc += wantMale ? -80 :  60;
    if (/google/i.test(n)) sc += 6;
    if (v.localService) sc += 3;
    return sc;
  }
  function loadVoices() {
    try { VOICES = window.speechSynthesis.getVoices() || []; } catch (e) { VOICES = []; }
    VOICE_PICK = null;
    var best = -Infinity;
    for (var i = 0; i < VOICES.length; i++) {
      var sc = rankVoice(VOICES[i]);
      if (sc > best) { best = sc; VOICE_PICK = VOICES[i]; }
    }
    var n = VOICE_PICK ? (VOICE_PICK.name || "") : "";
    VOICE_OK = !!(WANT_VOICE === "male" ? MALE_RE.test(n) : FEMALE_RE.test(n));
  }
  if (window.speechSynthesis) {
    loadVoices();
    try { window.speechSynthesis.addEventListener("voiceschanged", loadVoices); }
    catch (e) { window.speechSynthesis.onvoiceschanged = loadVoices; }
  }

  /* Browsers refuse to speak before the visitor has interacted with the page,
     so it stays silent until they turn the mic on or tap it once. After
     that it says every line out loud. */
  var canSpeak = false;

  function speak(text, force) {
    if (!(canSpeak || force) || !text || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      if (!VOICE_PICK) loadVoices();
      try { if (VOICE_PICK) u.voice = VOICE_PICK; } catch (e2) {}
      u.lang = (VOICE_PICK && /^bn/i.test(VOICE_PICK.lang)) ? VOICE_PICK.lang : "bn-BD";
      u.rate = 0.98;
      /* a real man's voice needs no help; a woman's has to come down a lot */
      u.pitch = (WANT_VOICE === "male") ? (VOICE_OK ? 0.9 : 0.62)
                                        : (VOICE_OK ? 1.25 : 1.6);
      u.volume = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* hop beside el, turn to it, raise the paw, say the line */
  function pointAt(el, text, then) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    current = el;
    markRing(r);
    var spot = spotFor(r);
    var cx = r.left + r.width / 2;
    hopTo(spot.x, spot.y, function () {
      if (spot.side === "right") sq.dataset.face = "left";
      else if (spot.side === "left") sq.dataset.face = "right";
      else face(cx - (px + size() / 2));
      sq.dataset.point = "1";
      bubbleSide = (sq.dataset.face === "left") ? "right" : "left";
      if (text) {
        say.textContent = text;
        say.style.left = "-9999px";
        say.dataset.on = "1";
        placeBubble();
        speak(text);
      }
      if (then) window.setTimeout(then, 420);
    });
  }

  function idle() {
    clearTip();
    var s = size();
    hopTo(40 + Math.random() * Math.max(40, VW() - s - 80),
          VH() - s - (14 + Math.random() * 40));
  }

  /* ============================================================
     7b. SHE SELLS
     She reads the shop's own data — price, discount, colour, fabric,
     stock, the bag total — and builds a line from it. Every line is
     something the site already says somewhere; she invents nothing.
     ============================================================ */
  var SHOP = function () { return window.PROWD || null; };
  function freeOver() {
    var g = SHOP();
    return (g && typeof g.freeOver === "number") ? g.freeOver : 500;
  }

  function bn(n) {
    return String(n).replace(/[0-9]/g, function (d) { return "০১২৩৪৫৬৭৮৯".charAt(+d); });
  }
  function taka(n) {                      /* "১,৩০৫ টাকা" — as it is spoken */
    return bn(Number(n).toLocaleString("en-US")) + " টাকা";
  }
  function takar(n) {                     /* "১,৩০৫ টাকার" */
    return bn(Number(n).toLocaleString("en-US")) + " টাকার";
  }
  function num(t) {                       /* "৳1,305" -> 1305 */
    var m = String(t || "").replace(/[^0-9]/g, "");
    return m ? parseInt(m, 10) : 0;
  }

  var TYPE_BN = {
    "t-shirt": "টি-শার্ট", "tshirt": "টি-শার্ট", "tee": "টি-শার্ট", "polo": "পোলো",
    "sweatshirt": "সোয়েটশার্ট", "hoodie": "হুডি", "dress": "ড্রেস", "shirt": "শার্ট",
    "top": "টপ", "jacket": "জ্যাকেট", "trouser": "ট্রাউজার", "pant": "প্যান্ট"
  };
  var COLOUR_BN = {
    "grey melange": "ধূসর", "light grey": "হালকা ধূসর", "white": "সাদা",
    "black": "কালো", "navy": "গাঢ় নীল", "sky": "আকাশি", "grey": "ধূসর",
    "gray": "ধূসর", "charcoal": "ছাই", "sage": "হালকা সবুজ", "pine": "গাঢ় সবুজ",
    "forest": "গাঢ় সবুজ", "olive": "জলপাই সবুজ", "butter": "মাখনরঙা",
    "ecru": "হালকা সাদা", "chalk": "হালকা সাদা", "cream": "ক্রিম",
    "beige": "বালিরঙা", "stone": "পাথুরে ধূসর", "rust": "মেটে লাল",
    "maroon": "মেরুন", "blue": "নীল",
    "green": "সবুজ", "red": "লাল", "orange": "কমলা", "brown": "বাদামি",
    "pink": "গোলাপি", "purple": "বেগুনি", "yellow": "হলুদ"
  };
  function bnType(t) {
    var k = String(t || "").toLowerCase().trim();
    return TYPE_BN[k] || t || "পোশাক";
  }
  function bnColour(c) {
    var k = String(c || "").toLowerCase().trim();
    if (COLOUR_BN[k]) return COLOUR_BN[k];
    for (var w in COLOUR_BN) {
      if (COLOUR_BN.hasOwnProperty(w) && k.indexOf(w) !== -1) return COLOUR_BN[w];
    }
    return c || "";
  }

  /* ---- what she knows about one product ----
     From the shop's own record when js/app.js exposes it, otherwise read
     straight off the card. Either way the numbers are the ones printed on
     the page — she never makes a figure up. */
  function factsOf(card) {
    var open = card.querySelector("[data-open]");
    var id = open && open.getAttribute("data-open");
    var g = SHOP();
    var p = (g && id) ? g.byId(id) : null;
    if (p) return factsOfProduct(p);

    var f = {};
    var nm = card.querySelector(".name");
    if (nm) {
      var clone = nm.cloneNode(true);
      var fb = clone.querySelector(".fit-badge");
      if (fb) fb.parentNode.removeChild(fb);
      f.name = clone.textContent.replace(/\s+/g, " ").trim();
    }
    var sub = card.querySelector(".sub");
    if (sub) {
      var bits = sub.textContent.split("·");
      f.type = (bits[1] || "").trim();
      f.colour = (bits[2] || "").trim();
    }
    var pr = card.querySelector(".price");
    if (pr) {
      var pc = pr.cloneNode(true);
      var old = pc.querySelector("s");
      if (old) { f.oldPrice = num(old.textContent); old.parentNode.removeChild(old); }
      var bd = pc.querySelectorAll(".off-badge,.save-badge");
      for (var i = 0; i < bd.length; i++) bd[i].parentNode.removeChild(bd[i]);
      f.price = num(pc.textContent);
    }
    var alt = card.querySelector(".tag-alt");
    if (alt) f.tag = alt.textContent.trim();
    if (card.getAttribute("data-sold") === "true") f.left = 0;
    else {
      var low = card.querySelector('.tag[data-kind="low"]');
      if (low) f.left = num(low.textContent);
    }
    return f;
  }

  function factsOfProduct(p) {
    var f = {
      name: p.name, type: p.type, fabric: p.fabric, fit: p.fit,
      price: p.price, oldPrice: p.oldPrice, tag: p.tag, colour: ""
    };
    var g = SHOP();
    try {
      var i = (g && g.state().sel[p.id]) || 0;
      f.colour = p.colors && p.colors[i] ? p.colors[i].n : "";
    } catch (e) {}
    try { f.left = g ? g.stockTotal(p) : null; } catch (e) { f.left = null; }
    return f;
  }

  function bagTotal() {
    var g = SHOP();
    if (!g) return 0;
    try {
      return (g.state().cart || []).reduce(function (a, l) { return a + l.price * l.qty; }, 0);
    } catch (e) { return 0; }
  }

  /* the delivery promise, told against what is actually in the bag */
  function deliveryLine() {
    var over = freeOver(), sub = bagTotal();
    if (sub > 0 && sub < over) {
      return "ঝুড়িতে " + taka(sub) + " হয়েছে; আর " + taka(over - sub) +
             " হলে পৌঁছে দেওয়ার খরচ লাগবে না।";
    }
    if (sub >= over && sub > 0) return "আপনার ক্রয়ে পৌঁছে দেওয়ার খরচ আর লাগবে না।";
    var pool = [
      takar(over) + " বেশি কিনলে পৌঁছে দেওয়ার খরচ লাগবে না।",
      "পণ্য হাতে পাওয়ার পর মূল্য পরিশোধ করতে পারবেন।",
      "মাপ না মিললে সাত দিনের মধ্যে বদলে নিতে পারবেন।",
      "খুলনায় পরের দিনই, দেশের অন্যত্র দুই থেকে চার দিনে পৌঁছে যাবে।"
    ];
    return pool[pitchN % pool.length];
  }

  /* every honest line she could say about this piece, best first */
  function pitchLines(f) {
    var out = [];
    if (!f || !f.price) return out;
    var t = bnType(f.type);
    var col = bnColour(f.colour);
    var off = (f.oldPrice && f.oldPrice > f.price)
      ? Math.round((1 - f.price / f.oldPrice) * 100) : 0;

    if (f.left === 0) {
      out.push("এই " + t + "টি এখন শেষ হয়ে গেছে; পাশের অন্যগুলি দেখে নিন।");
      return out;
    }

    if (off > 0) {
      out.push("এই " + t + "টি নিতে পারেন। " + bn(off) + " শতাংশ ছাড়ে এখন " +
               taka(f.price) + ", " + taka(f.oldPrice - f.price) + " সাশ্রয় হচ্ছে।");
    } else {
      out.push("এই " + t + "টি দেখতে পারেন; মূল্য " + taka(f.price) + "।");
    }

    if (col) out.push(col + " রঙের এই " + t + "টি আপনাকে বেশ মানাবে।");

    var fab = String(f.fabric || "");
    if (/cotton/i.test(fab) && !/poly|elastane|spandex|viscose|rayon|blend/i.test(fab)) {
      var gsm = fab.match(/(\d{2,3})\s*gsm/i);
      out.push("এটি সম্পূর্ণ সুতির কাপড়" +
               (gsm ? ", " + bn(gsm[1]) + " জিএসএম" : "") +
               "; সারাদিন পরে থাকলেও আরাম পাবেন।");
    } else if (fab) {
      out.push("কাপড় — " + fab + "।");
    }

    if (f.tag && /best/i.test(f.tag)) {
      out.push("এটি আমাদের সবচেয়ে বেশি বিক্রি হওয়া পোশাক; অনেকেই নিচ্ছেন।");
    } else if (f.tag && /new/i.test(f.tag)) {
      out.push("সদ্য নতুন এসেছে; সবার আগে আপনিই দেখে নিন।");
    }
    if (typeof f.left === "number" && f.left > 0 && f.left <= 5) {
      out.push("আর মাত্র " + bn(f.left) +
               "টি অবশিষ্ট রয়েছে; দেরি করলে শেষ হয়ে যেতে পারে।");
    }

    out.push(deliveryLine());
    var fit = bnFit(f.fit);
    if (fit) out.push("গড়ন — " + fit + "।");
    if (f.name) out.push(f.name + " — ছবিটিতে চাপ দিলে সব মাপ ও বিস্তারিত বিবরণ পাবেন।");
    return out;
  }

  /* the fit notes are written in English; say the ones we can say in Bengali
     and stay quiet about the rest rather than mixing languages badly */
  function bnFit(t) {
    var k = String(t || "").toLowerCase();
    if (!k) return "";
    var bits = [];
    if (/boxy|relaxed|oversize/.test(k)) bits.push("কিছুটা ঢিলেঢালা");
    else if (/trim|slim|fitted/.test(k)) bits.push("আঁটসাঁট");
    else if (/regular|straight|classic/.test(k)) bits.push("স্বাভাবিক");
    if (/crop/.test(k)) bits.push("কোমরের উপরে ছোট");
    else if (/longline|long body/.test(k)) bits.push("কিছুটা লম্বা");
    else if (/hip/.test(k)) bits.push("কোমর পর্যন্ত");
    if (/ribbed hem/.test(k)) bits.push("নিচের প্রান্ত রিব-বোনা");
    return bits.join(", ");
  }

  var pitchN = 0, lastCard = null, recent = [];

  /* don't repeat a line she has just used */
  function pick(lines) {
    for (var i = 0; i < lines.length; i++) {
      var l = lines[(pitchN + i) % lines.length];
      if (recent.indexOf(l) === -1) {
        pitchN += i + 1;
        recent.push(l);
        if (recent.length > 4) recent.shift();
        return l;
      }
    }
    return lines[pitchN++ % lines.length];
  }

  /* pick a product she can see and say one thing about it */
  function salesTip() {
    var cards = document.querySelectorAll("#grid .card");
    var vis = [], i;
    for (i = 0; i < cards.length; i++) if (onScreen(cards[i])) vis.push(cards[i]);
    if (!vis.length) return null;
    var at = Math.floor(Math.random() * vis.length);
    if (vis.length > 1 && vis[at] === lastCard) at = (at + 1) % vis.length;
    var card = vis[at];
    var lines = pitchLines(factsOf(card));
    if (!lines.length) return null;
    lastCard = card;
    return { el: card, say: pick(lines) };
  }

  /* the same, for the piece that is already open */
  function detailPitch() {
    var g = SHOP(), f = null;
    try {
      var id = g && g.detail() && g.detail().id;
      var p = id ? g.byId(id) : null;
      if (p) f = factsOfProduct(p);
    } catch (e) {}
    var lines = pitchLines(f);
    if (!lines.length) return null;
    var el = $(".detail-price");
    if (!onScreen(el)) el = $("#addBtn");
    if (!onScreen(el)) el = $(".sizes");
    if (!onScreen(el)) return null;
    return { el: el, say: pick(lines) };
  }

  /* the next thing on the current list that is ALREADY on screen —
     he never scrolls the page to find something */
  function nextTip() {
    if (hidden || busy) return;
    if (given >= MAX_TIPS) { done = true; idle(); return; }

    /* every other stop on the shop floor is a sales pitch about a real
       product she can see, not another note about how the page works */
    if (mode === "shop" && given % 2 === 1) {
      var sp = salesTip();
      if (sp) { given++; pointAt(sp.el, sp.say); return; }
    }
    if (mode === "detail" && given > 0 && given % 3 === 2) {
      var dp = detailPitch();
      if (dp) { given++; pointAt(dp.el, dp.say); return; }
    }
    var tries = 0, tip = null, el = null;
    while (tries < tour.length) {
      idx = (idx + 1) % tour.length;
      tries++;
      var e = $(tour[idx].sel);
      if (onScreen(e)) { tip = tour[idx]; el = e; break; }
    }
    if (!tip) { idle(); return; }
    given++;
    pointAt(el, tip.say);
  }

  function loop() {
    window.clearTimeout(timer);
    if (done || hidden || busy) return;
    timer = window.setTimeout(function () {
      clearTip();
      window.setTimeout(function () { nextTip(); loop(); }, 520);
    }, 7200);
  }

  function startTour(name, delay) {
    mode = name;
    tour = TOURS[name] || TOURS.shop;
    idx = -1; given = 0; done = false;
    if (!busy) { clearTip(); window.clearTimeout(timer); }
    window.setTimeout(function () {
      if (mode !== name || hidden || busy) return;
      nextTip(); loop();
    }, delay || 700);
  }

  /* ============================================================
     8. WHICH SITUATION ARE WE IN
     ============================================================ */
  function shown(id) {
    var e = document.getElementById(id);
    return !!e && e.getAttribute("data-shown") === "true";
  }
  function situation() {
    var o = document.getElementById("order");
    if (o && !o.hidden) return "order";
    if (shown("cart")) return "cart";
    if (shown("detail")) return "detail";
    return "shop";
  }

  function watch() {
    /* the zoomed image takes the whole screen — step aside for it */
    var lb = document.getElementById("lightbox");
    var away = !!(lb && !lb.hidden);
    layer.style.opacity = away ? "0" : "1";
    layer.style.transition = "opacity .25s ease";

    var now = situation();
    if (now !== mode && !away) {
      /* the visitor moved a step — pick up the matching guidance */
      startTour(now, now === "shop" ? 900 : 620);
    }
  }
  window.setInterval(watch, 500);

  /* ---------------------------------------------------------------
     The first thing anyone gets: a welcome. She tries to say it out
     loud too — most browsers will block that until the visitor has
     touched the page, and that is fine; the greeting still shows.
     --------------------------------------------------------------- */
  function greet() {
    var hello = "প্রাউড ফ্যাশনে আপনাকে স্বাগতম। আসুন, আমি আপনাকে ঘুরিয়ে দেখাই।";
    var brand = document.querySelector(".topbar .brand-lockup") ||
                document.querySelector(".brand-lockup");
    busy = true;
    if (onScreen(brand)) {
      pointAt(brand, hello);
    } else {
      say.textContent = hello;
      say.style.left = "-9999px";
      say.dataset.on = "1";
      bubbleSide = (sq.dataset.face === "left") ? "right" : "left";
      placeBubble();
    }
    speak(hello, true);
    window.setTimeout(function () {
      busy = false;
      startTour(situation(), 400);
    }, 5400);
  }
  window.setTimeout(greet, 1100);

  /* ============================================================
     9. STAYING PUT WHILE THE PAGE MOVES
     ============================================================ */
  function follow() {
    if (ring.dataset.on !== "1" || !current) return;
    if (!document.body.contains(current) || !onScreen(current)) { clearTip(); return; }
    var r = current.getBoundingClientRect();
    markRing(r);
    if (!moving) {
      var spot = spotFor(r);
      px = spot.x; py = spot.y;
      if (spot.side === "right") sq.dataset.face = "left";
      else if (spot.side === "left") sq.dataset.face = "right";
      bubbleSide = (sq.dataset.face === "left") ? "right" : "left";
      draw(0);
    }
  }
  /* When the visitor scrolls somewhere new, he has new things to talk about.
     He still never scrolls the page himself — he waits for them to arrive. */
  var lastY = window.pageYOffset || 0, rearm = 0;
  function onScroll() {
    follow();
    var y = window.pageYOffset || 0;
    if (Math.abs(y - lastY) < 280) return;
    lastY = y;
    window.clearTimeout(rearm);
    rearm = window.setTimeout(function () {
      if (hidden || busy || mode !== "shop") return;
      if (done) { done = false; given = Math.max(0, MAX_TIPS - 3); }
      clearTip();
      window.setTimeout(function () { nextTip(); loop(); }, 400);
    }, 700);
  }
  /* capture phase, so scrolling inside the product sheet counts too */
  document.addEventListener("scroll", onScroll, true);
  window.addEventListener("resize", function () {
    var s = size();
    px = clamp(px, 6, VW() - s - 6);
    py = clamp(py, 54, VH() - s - 6);
    draw(0);
    follow();
  });

  /* ============================================================
     10. TAP AND DISMISS
     ============================================================ */
  function poke() {
    window.clearTimeout(timer);
    if (done) { done = false; given = 0; idx = -1; }
    clearTip();
    window.setTimeout(function () { nextTip(); loop(); }, 260);
  }
  hit.addEventListener("click", function () {
    if (!canSpeak) {
      canSpeak = true;                  /* a deliberate tap = permission to talk */
      if (say.dataset.on === "1") speak(say.textContent);
    }
  });
  hit.addEventListener("click", poke);
  hit.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); poke(); }
  });

  /* show the buttons for a moment after a tap (phones have no hover) */
  function flashBtns() {
    sq.dataset.btns = "1";
    window.clearTimeout(btnTimer);
    btnTimer = window.setTimeout(function () { sq.dataset.btns = "0"; }, 5000);
  }
  var btnTimer = 0;
  hit.addEventListener("click", flashBtns);

  /* × = "not now". He steps aside for this page view and leaves a button
     to call him back. Nothing is remembered, so a refresh brings him back. */
  x.addEventListener("click", function (ev) {
    ev.stopPropagation();
    hidden = true;
    window.clearTimeout(timer);
    listen(false);
    clearTip();
    sq.style.display = "none";
    back.hidden = false;
  });

  back.addEventListener("click", function () {
    hidden = false;
    back.hidden = true;
    sq.style.display = "";
    startTour(situation(), 500);
  });

  /* ============================================================
     11. VOICE
     Tap the mic, speak Bengali. He hops to what you named, points
     at it, and presses it. Two things he will not press by himself:
     the final "Confirm order." button and the WhatsApp link — those
     leave the shop or place a real order, so the tap stays yours.
     ============================================================ */
  var rec = null, voiceOn = false, wantVoice = false;

  function tell(text) {
    if (!text) return;
    clearTip();
    say.textContent = text;
    say.style.left = "-9999px";
    say.dataset.on = "1";
    bubbleSide = (sq.dataset.face === "left") ? "right" : "left";
    placeBubble();
    speak(text);
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { clearTip(); busy = false; loop(); }, 5200);
  }

  function has(text, list) {
    for (var i = 0; i < list.length; i++) {
      if (text.indexOf(list[i]) !== -1) return true;
    }
    return false;
  }

  /* Hop over, point, then do it. The press is on its own timer rather than
     on the hop's arrival callback: opening a sheet changes the situation,
     which restarts the tour, and that would otherwise steal the callback. */
  /* A product card is a container; the thing that actually opens it is the
     button inside. Point at the card, press the button. */
  var HOT = 'a[href],button,input,select,textarea,[role="button"],[data-open],' +
            '[data-gender],[data-type],[data-sw],[data-q],[data-nav],[data-size]';
  function clickTarget(el) {
    if (!el) return el;
    if (el.matches && el.matches(HOT)) return el;
    var inner = el.querySelector && el.querySelector("[data-open],button,a[href]");
    return inner || el;
  }

  function press(el, opts) {
    opts = opts || {};
    opts.say = opts.say || "";
    acted = true;
    busy = true;
    window.clearTimeout(timer);
    pointAt(el, opts.say);
    var target = clickTarget(el);
    window.setTimeout(function () {
      try {
        if (opts.noClick) { /* her paw stays off this one */ }
        else if (opts.focus && target.focus) target.focus();
        else target.click();
      } catch (e) {}
      window.setTimeout(function () { busy = false; loop(); }, 1300);
    }, REDUCED ? 180 : 900);
  }

  /* ------------------------------------------------------------
     Saying anything at all: instead of a fixed word list, match what
     was spoken against the words that are actually on the screen —
     product names, chips, buttons, links, form labels. Bengali words
     for colours and garment types are expanded to the English ones
     the shop uses, so "কালো টি-শার্টে ক্লিক করো" finds the right card.
     ------------------------------------------------------------ */
  var STOP = [
    "ক্লিক", "করো", "কর", "করুন", "চাপ", "চাপো", "চাপুন", "টিপ", "টেপো", "প্রেস",
    "সিলেক্ট", "নির্বাচন", "বাছো", "বেছে", "নাও", "দাও", "দেখাও", "দেখ", "দেখান",
    "এটা", "এটি", "ওটা", "ওটি", "এই", "ওই", "একটা", "একটু", "আমাকে", "আমি",
    "তুমি", "যাও", "গিয়ে", "উপর", "মধ্যে", "থেকে", "আর", "এবং", "তে", "এ",
    "click", "press", "select", "choose", "open", "tap", "the", "this", "that",
    "on", "to", "me", "please", "go", "and", "a", "an", "show", "want", "i",
    "my", "for", "can", "you", "would", "like", "give", "take", "put", "let",
    /* romanised Bengali — how a lot of people actually talk */
    "koro", "kor", "korun", "dao", "nao", "dekhao", "dekho", "kore", "ta", "ti",
    "amake", "ami", "ekta", "please", "kore", "den", "diye",
    /* Hindi / Urdu */
    "करो", "कीजिए", "दिखाओ", "दीजिए", "चाहिए", "मुझे", "पर", "को", "है", "का",
    "karo", "kijiye", "dikhao", "dijiye", "chahiye", "mujhe", "par", "ko",
    /* Arabic */
    "اضغط", "أريد", "من", "فضلك", "على", "هذا",
    /* Spanish / French / Portuguese fillers, in case */
    "por", "favor", "quiero", "haz", "clique", "sur", "le", "la", "je", "veux"
  ];
  var SYN = {
    "টিশার্ট": "t-shirt tee tshirt", "টি": "t-shirt tee", "শার্ট": "shirt tee",
    "পোলো": "polo", "সোয়েটশার্ট": "sweatshirt", "সোয়েটার": "sweatshirt",
    "হুডি": "hoodie hood", "গেঞ্জি": "tee t-shirt", "জামা": "tee shirt",
    "পোশাক": "tee shirt dress", "ড্রেস": "dress",
    "কালো": "black", "সাদা": "white", "নীল": "navy blue", "আকাশি": "sky blue",
    "ধূসর": "grey gray melange", "ছাই": "grey gray melange", "সবুজ": "green forest",
    "কমলা": "orange", "লাল": "red", "বাদামি": "brown", "গোলাপি": "pink",
    "দাম": "price", "ছাড়": "off discount", "নতুন": "new", "বেস্ট": "best seller",
    "ধরন": "type types", "ধরনের": "type types", "সব": "all", "সবধরনের": "all types",
    "নাম": "name", "মোবাইল": "mobile phone", "নম্বর": "number", "ফোন": "phone",
    "জেলা": "district", "ঠিকানা": "address", "বাসা": "address", "কোড": "code",
    "প্রমো": "promo code", "মোট": "total", "ডেলিভারি": "delivery", "কুরিয়ার": "courier",
    "রঙ": "colour color", "কালার": "colour color", "ছবি": "photo image view",
    "বাংলাদেশ": "bangladesh", "খুলনা": "khulna", "ঢাকা": "dhaka",

    /* ---- romanised Bengali ("Banglish") ---- */
    "shada": "white", "sada": "white", "kalo": "black", "nil": "navy blue",
    "shobuj": "green", "sobuj": "green", "lal": "red", "holud": "yellow",
    "golapi": "pink", "khoyeri": "brown", "dhusor": "grey gray",
    "jama": "tee shirt", "genji": "tee t-shirt", "gengi": "tee t-shirt",
    "poshak": "tee shirt dress", "dam": "price", "chhar": "off discount",
    "nari": "women", "meye": "women", "mohila": "women",
    "purush": "men", "chele": "men", "porush": "men",
    "bag": "bag", "byag": "bag", "kholo": "open", "khulo": "open",
    "rakho": "add", "kino": "buy", "boro": "xl large", "choto": "s small",

    /* ---- Hindi / Urdu ---- */
    "काला": "black", "सफेद": "white", "सफ़ेद": "white", "नीला": "navy blue",
    "हरा": "green", "लाल": "red", "पीला": "yellow", "गुलाबी": "pink",
    "भूरा": "brown", "स्लेटी": "grey gray",
    "कमीज": "shirt", "कमीज़": "shirt", "टीशर्ट": "t-shirt tee",
    "महिला": "women", "औरत": "women", "लड़की": "women",
    "पुरुष": "men", "आदमी": "men", "लड़का": "men",
    "बैग": "bag", "थैला": "bag", "कीमत": "price", "छूट": "off discount",
    "आकार": "size", "नाम": "name", "पता": "address", "फोन": "phone mobile",
    "سیاہ": "black", "سفید": "white", "قمیض": "shirt", "بیگ": "bag",
    "أسود": "black", "أبيض": "white", "قميص": "shirt", "حقيبة": "bag",

    /* ---- plain English helpers ---- */
    "tshirt": "t-shirt tee", "t": "t-shirt tee", "sweater": "sweatshirt",
    "trousers": "trouser pant", "checkout": "place order", "basket": "bag",
    "cart": "bag", "colour": "color", "gray": "grey",
    "সেরা": "best seller", "স্টক": "stock", "রিভিউ": "review"
  };

  function norm(t) {
    return String(t || "").toLowerCase()
      .replace(/[\u200b\u200c\u200d]/g, "")
      /* keep the letters of every script the visitor might speak in —
         the old version dropped everything outside Latin and Bengali */
      .replace(/[^\w\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF\u0590-\u06FF\u0900-\u0DFF\u0E00-\u0E7F\u1100-\u11FF\u3040-\u30FF\u4E00-\u9FFF]+/g, " ")
      .replace(/\s+/g, " ").trim();
  }
  /* "টি-শার্টটাতে" → "টি শার্ট" */
  function stem(w) {
    if (w.length > 3) {
      w = w.replace(/(টাতে|টিতে|গুলোতে|গুলিতে|টার|টির|গুলো|গুলি|কে|তে|এর|য়ে|টা|টি)$/, "");
    }
    return w;
  }
  function tokens(text) {
    var raw = norm(text).split(" "), out = [], i, w;
    for (i = 0; i < raw.length; i++) {
      w = stem(raw[i]);
      if (!w || w.length < 2) continue;
      if (STOP.indexOf(w) !== -1 || STOP.indexOf(raw[i]) !== -1) continue;
      if (out.indexOf(w) === -1) out.push(w);
      if (SYN[w]) {
        var ex = SYN[w].split(" ");
        for (var j = 0; j < ex.length; j++) if (out.indexOf(ex[j]) === -1) out.push(ex[j]);
      }
    }
    return out;
  }

  function labelOf(el) {
    var bits = [
      el.getAttribute("aria-label"), el.getAttribute("title"),
      el.getAttribute("placeholder"), el.getAttribute("data-gender"),
      el.getAttribute("data-type"), el.getAttribute("name"),
      el.value && el.tagName === "INPUT" ? null : null
    ];
    var img = el.querySelector && el.querySelector("img[alt]");
    if (img) bits.push(img.getAttribute("alt"));
    var lab = el.id && document.querySelector('label[for="' + el.id + '"]');
    if (lab) bits.push(lab.textContent);
    bits.push((el.textContent || "").slice(0, 160));
    return " " + norm(bits.join(" ")) + " ";
  }

  var PICKABLE = 'a[href],button,[role="button"],input,select,textarea,' +
                 '.chip,.card,.size,.swatch,[data-open],[data-gender],[data-type],' +
                 '[data-sw],[data-q],[data-nav]';
  /* deliberately NOT in that list: [data-remove]. Taking something out of the
     bag should stay a deliberate tap, not something a misheard word can do. */

  function isField(el) {
    var t = el.tagName;
    return t === "INPUT" || t === "TEXTAREA" || t === "SELECT";
  }

  function findOnPage(text) {
    var toks = tokens(text);
    if (!toks.length) return null;
    var all = document.querySelectorAll(PICKABLE);
    var best = null, i, k, el, lab, sc, area, r;
    for (i = 0; i < all.length && i < 500; i++) {
      el = all[i];
      if (el.closest && el.closest(".sq-layer")) continue;
      if (!onScreen(el)) continue;
      lab = labelOf(el);
      if (lab.length < 3) continue;
      sc = 0;
      var flat = lab.trim();
      for (k = 0; k < toks.length; k++) {
        if (flat === toks[k]) sc += 8;                             /* the whole label */
        else if (lab.indexOf(" " + toks[k] + " ") !== -1) sc += 3; /* whole word */
        else if (toks[k].length >= 3 && lab.indexOf(toks[k]) !== -1) sc += 2;
      }
      if (sc < 3) continue;
      r = el.getBoundingClientRect();
      area = r.width * r.height;
      /* the smallest thing that matches is almost always the right thing */
      if (!best || sc > best.sc || (sc === best.sc && area < best.area)) {
        var nameEl = (el.querySelector && el.querySelector(".name, h3")) || el;
        var nm = (nameEl.textContent || el.getAttribute("aria-label") || "")
                   .replace(/\s+/g, " ").trim();
        best = { el: el, sc: sc, area: area, name: nm.slice(0, 30) };
      }
    }
    return best;
  }

  function resolveCmd(raw) {
    var text = String(raw || "").toLowerCase().replace(/[।,.?!]/g, " ").trim();
    if (!text) return;
    window.clearTimeout(timer);   /* a spoken command outranks the tour */

    /* "তৃতীয় জামাটা দেখাও" → the third card on screen */
    if (has(text, ["প্রোডাক্ট", "জামা", "পোশাক", "কার্ড", "product", "item"])) {
      for (var o = 0; o < ORDINALS.length; o++) {
        if (has(text, ORDINALS[o].w)) {
          var cards = document.querySelectorAll("#grid .card");
          var el = cards[ORDINALS[o].n - 1];
          if (onScreen(el)) {
            press(el, { say: bn(ORDINALS[o].n) + " নম্বরের পোশাকটি খুলে দিচ্ছি।" });
            return;
          }
          tell("ওই নম্বরের পোশাকটি এখন পর্দায় নেই।"); return;
        }
      }
    }

    /* ---------------- sizes ----------------
       Bengali speech comes back as letter NAMES — "এক্স এক্স এল", "ডাবল এক্স
       এল" — never as "XXL". Translate those to letters first, then look for
       the button. If that size is not on this garment, say which ones are,
       instead of "I could not find it". */
    var lt = " " + norm(text)
      .replace(/ট্রিপল\s*এক্স\s*এল/g, " xxxl ")
      .replace(/এক্স\s*এক্স\s*এক্স\s*এল/g, " xxxl ")
      .replace(/ডাবল\s*এক্স\s*এল/g, " xxl ")
      .replace(/এক্স\s*এক্স\s*এল/g, " xxl ")
      .replace(/double\s*x\s*l/g, " xxl ")
      .replace(/triple\s*x\s*l/g, " xxxl ")
      .replace(/extra\s*large/g, " xl ")
      .replace(/extra\s*small/g, " xs ")
      .replace(/large/g, " l ")
      .replace(/medium/g, " m ")
      .replace(/small/g, " s ")
      .replace(/एक्स\s*एक्स\s*एल/g, " xxl ")
      .replace(/एक्स\s*एल/g, " xl ")
      .replace(/एक्स\s*एस/g, " xs ")
      .replace(/बड़ा|लार्ज/g, " l ")
      .replace(/मीडियम|मध्यम/g, " m ")
      .replace(/छोटा|स्मॉल/g, " s ")
      .replace(/এক্সট্রা\s*লার্জ/g, " xl ")
      .replace(/এক্সট্রা\s*স্মল/g, " xs ")
      .replace(/এক্স\s*এল/g, " xl ")
      .replace(/এক্স\s*এস/g, " xs ")
      .replace(/লার্জ/g, " l ")
      .replace(/মিডিয়াম/g, " m ")
      .replace(/মাঝারি/g, " m ")
      .replace(/স্মল/g, " s ")
      .replace(/ছোট/g, " s ")
      .replace(/বড়/g, " xl ")
      .replace(/\s+/g, " ") + " ";
    /* the bare letter names, once the multi-word ones above are done */
    var LETTER = {
      "এল": "l", "এম": "m", "এস": "s", "এ": "", "ও": "",
      "एल": "l", "एम": "m", "एस": "s", "एक्स": "x",
      "ال": "l", "ام": "m", "اس": "s"
    };
    lt = " " + lt.split(" ").map(function (w) {
      return Object.prototype.hasOwnProperty.call(LETTER, w) ? LETTER[w] : w;
    }).join(" ").replace(/\s+/g, " ").trim() + " ";
    var SIZES = [
      { re: /\s(xxxl|3xl|xxx l)\s/, s: "XXXL", strong: true },
      { re: /\s(xxl|2xl|xx l)\s/,   s: "XXL",  strong: true },
      { re: /\sxl\s/,               s: "XL",   strong: true },
      { re: /\sxs\s/,               s: "XS",   strong: true },
      { re: /\sl\s/,                s: "L",    strong: false },
      { re: /\sm\s/,                s: "M",    strong: false },
      { re: /\ss\s/,                s: "S",    strong: false }
    ];
    var saidSize = has(text, ["সাইজ", "মাপ", "size", "साइज", "आकार", "مقاس",
                              "talla", "taille", "maap"]);
    var want = null;
    for (var z = 0; z < SIZES.length; z++) {
      if (SIZES[z].re.test(lt) && (SIZES[z].strong || saidSize)) { want = SIZES[z].s; break; }
    }
    if (want) {
      var sizeBtns = document.querySelectorAll(".sizes .size");
      if (!sizeBtns.length) {
        tell("আগে একটি পোশাক খুলুন, তারপর মাপটি বলুন।");
        return;
      }
      var have = [], hitBtn = null;
      for (var y = 0; y < sizeBtns.length; y++) {
        var lbl = (sizeBtns[y].textContent || "").trim().toUpperCase();
        have.push(lbl);
        if (lbl === want) hitBtn = sizeBtns[y];
      }
      if (hitBtn) { press(hitBtn, { say: want + " মাপটি বেছে নিলাম।" }); return; }
      acted = true;
      tell("এই পোশাকে " + want + " মাপটি নেই। রয়েছে — " + have.join(", ") + "।");
      return;
    }

    /* the named things */
    var missed = null;
    for (var i = 0; i < VOICE.length; i++) {
      var v = VOICE[i];
      if (!has(text, v.w)) continue;

      if (v.act === "close") {
        var scrim = document.getElementById("scrim");
        acted = true; if (scrim) scrim.click();
        tell(v.say); return;
      }
      acted = true; if (v.act === "up")   { window.scrollBy({ top: -VH() * .8, behavior: "smooth" }); tell(v.say); return; }
      acted = true; if (v.act === "down") { window.scrollBy({ top:  VH() * .8, behavior: "smooth" }); tell(v.say); return; }
      acted = true; if (v.act === "next") { poke(); return; }
      acted = true; if (v.act === "stop") { done = true; window.clearTimeout(timer); tell(v.say); return; }
      acted = true; if (v.act === "hide") { x.click(); return; }

      var target = $(v.sel);
      if (!onScreen(target)) {
        /* some steps live behind another one — "order" needs the bag open
           first. If she can get there in one hop, she does it herself. */
        var gate = v.via ? $(v.via) : null;
        if (gate && onScreen(gate)) {
          acted = true;
          press(gate, { say: v.viaSay || "" });
          (function (step) {
            window.setTimeout(function () {
              var t2 = $(step.sel);
              if (onScreen(t2)) press(t2, step);
            }, 2000);
          })(v);
          return;
        }
        missed = v; continue;                 /* maybe something else fits */
      }
      press(target, v);
      return;
    }

    /* "প্রোডাক্ট সিলেক্ট করো" with no number — the first card on screen */
    if (has(text, ["প্রোডাক্ট", "জামা", "পোশাক", "কার্ড", "product", "item"])) {
      var cards = document.querySelectorAll("#grid .card");
      for (var c = 0; c < cards.length; c++) {
        if (onScreen(cards[c])) {
          press(cards[c], { say: "এটি খুলে দিচ্ছি।" });
          return;
        }
      }
    }

    /* anything else that is written on the screen right now */
    var best = findOnPage(text);
    if (best) {
      if (best.el.id === "orderGo") {
        busy = true;
        pointAt(best.el, "শেষ চাপটি আপনি নিজেই দিন।");
        window.setTimeout(function () { busy = false; loop(); }, 4200);
        return;
      }
      press(best.el, {
        say: best.name ? "এই যে — " + best.name + "।" : "এখানে চাপ দিচ্ছি।",
        focus: isField(best.el)
      });
      return;
    }

    /* a bare "এটা ক্লিক করো" — he presses whatever he is pointing at */
    if (has(text, CLICK_WORDS)) {
      if (current && current.id !== "orderGo") { press(current, {}); return; }
      if (current) { tell("শেষ চাপটি আপনি নিজেই দিন।"); return; }
      tell("কোনটিতে? পর্দায় যা লেখা রয়েছে, তার নাম বলুন।");
      return;
    }

    if (missed) { tell("এটি এখন পর্দায় নেই; আগে ওই ধাপটি খুলে নিন।"); return; }
    tell("\u201C" + text.slice(0, 26) + "\u201D — এটি পর্দায় খুঁজে পেলাম না।");
  }

  /* ------------------------------------------------------------
     She answers in Bengali, always. But the visitor may not speak it.
     A browser recogniser only listens in ONE language at a time and has
     no "detect it for me", so she cycles through a short list — the
     visitor's own browser languages first, then Bengali, English, Hindi,
     Urdu, Arabic — and the moment a command in some language works, she
     stays in that language. Two misses in a row and she starts cycling
     again. The visitor never has to set anything.
     ------------------------------------------------------------ */
  var LANGS = (function () {
    var base = ["bn-BD", "en-US", "hi-IN", "ur-PK", "ar-SA"];
    var mine = [];
    try {
      var list = navigator.languages || [navigator.language || ""];
      for (var i = 0; i < list.length && i < 3; i++) {
        var t = String(list[i] || "");
        if (t && base.indexOf(t) === -1 && mine.indexOf(t) === -1) mine.push(t);
      }
    } catch (e) {}
    return mine.concat(base);
  })();
  var langAt = 0, langLock = "", misses = 0, rotateTimer = 0;

  function nextLang() {
    if (!wantVoice || !rec) return;
    try { rec.stop(); } catch (e) {}      /* onend picks the next one up */
  }
  function armRotate() {
    window.clearTimeout(rotateTimer);
    if (langLock) return;                 /* settled on a language — leave it */
    rotateTimer = window.setTimeout(nextLang, 7000);
  }

  var acted = false;     /* did the last utterance actually do something? */

  function heard(raw) {
    acted = false;
    resolveCmd(raw);
    if (acted) {
      langLock = rec ? rec.lang : "";     /* this is the visitor's language */
      misses = 0;
      window.clearTimeout(rotateTimer);
    } else {
      misses++;
      if (misses >= 2) { misses = 0; langLock = ""; langAt++; nextLang(); }
    }
    armRotate();
  }

  function listen(on) {
    if (!SR) return;
    wantVoice = on;
    if (!on) {
      voiceOn = false;
      mic.dataset.on = "0";
      window.clearTimeout(rotateTimer);
      if (rec) { try { rec.abort(); } catch (e) {} }
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
      return;
    }
    if (!rec) {
      rec = new SR();
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = function (ev) {
        for (var i = ev.resultIndex; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) heard(ev.results[i][0].transcript);
        }
      };
      rec.onspeechstart = function () { window.clearTimeout(rotateTimer); };
      rec.onerror = function (ev) {
        if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
          listen(false);
          tell("মাইক্রোফোন ব্যবহারের অনুমতি দিতে হবে। ঠিকানা-বারের তালার চিহ্নটি দেখুন।");
        }
      };
      rec.onend = function () {
        if (!wantVoice) return;
        if (!langLock) langAt++;
        window.setTimeout(function () {
          if (!wantVoice) return;
          try {
            rec.lang = langLock || LANGS[langAt % LANGS.length];
            rec.start();
            armRotate();
          } catch (e) {}
        }, 320);
      };
    }
    rec.lang = langLock || LANGS[langAt % LANGS.length];
    try { rec.start(); } catch (e) {}
    armRotate();
    voiceOn = true;
    canSpeak = true;
    mic.dataset.on = "1";
    tell("আমি শুনছি। আপনি যে ভাষায় স্বচ্ছন্দ, সেই ভাষাতেই বলুন; উত্তর দেব বাংলায়।");
  }

  mic.addEventListener("click", function (ev) {
    ev.stopPropagation();
    listen(!wantVoice);
  });

  /* expose a tiny hook so the page (or a test) can drive him */
  window.prowdSquirrel = {
    say: function (t) { heard(t); },
    voice: function (on) { listen(!!on); },
    tour: function (n) { startTour(n || situation(), 100); },
    pitch: function () { var t = salesTip(); return t ? t.say : null; },
    voicePick: function () {
      if (!VOICE_PICK) loadVoices();
      return VOICE_PICK
        ? { want: WANT_VOICE, name: VOICE_PICK.name, lang: VOICE_PICK.lang, matched: VOICE_OK }
        : { want: WANT_VOICE, name: null, lang: null, matched: false };
    },
    lines: function () {
      var c = document.querySelector("#grid .card");
      return c ? pitchLines(factsOf(c)) : [];
    },
    at: function () { return current; }
  };
})();
