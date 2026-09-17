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
      { sel: "#genderChips", say: "নারী না পুরুষ — কার জন্য কিনছেন, এখান থেকে বেছে নিন।" },
      { sel: "#typeChips",   say: "টি-শার্ট, পোলো… ধরন অনুযায়ী দেখুন।" },
      { sel: "#q",           say: "নাম লিখে সরাসরি খুঁজে নিতে পারেন।" },
      { sel: "#sort",        say: "দাম কম-বেশি অনুযায়ী সাজিয়ে নিন।" },
      { sel: "#grid .card",  say: "ছবিতে ক্লিক করলে সাইজ, মাপ আর বিস্তারিত।" },
      { sel: "#cartBtn",     say: "পছন্দ হলে ব্যাগে রাখুন — এখানে জমা থাকবে।" },
      { sel: "#waTalk",      say: "যেকোনো প্রশ্ন? WhatsApp-এ সরাসরি লিখুন।" },
      { sel: "#themeBtn",    say: "রাতে চোখ আরাম চাইলে এই বোতামটা চাপুন।" }
    ],
    /* a product is open */
    detail: [
      { sel: ".sheet-media, .shot", say: "ছবিতে চাপলে বড় করে দেখা যায়।" },
      { sel: ".swatches, [data-sw]", say: "রঙ এখান থেকে বদলে নিন।" },
      { sel: ".sizes",      say: "আগে সাইজ বাছুন — নিচের মাপের চার্টে মিলিয়ে নিন।" },
      { sel: ".size-chart", say: "বুক আর লম্বার মাপ এখানে দেওয়া আছে।" },
      { sel: ".stepper",    say: "কয়টা নেবেন, এখানে বাড়ান বা কমান।" },
      { sel: "#addBtn",     say: "ব্যাগে রাখতে এই বোতামটা চাপুন।" },
      { sel: "#buyBtn",     say: "সরাসরি কিনতে চাইলে Buy Now চাপুন।" }
    ],
    /* the bag */
    cart: [
      { sel: "#cartBody .lrow, #cartBody", say: "সংখ্যা এখান থেকেই বাড়ানো-কমানো যায়।" },
      { sel: "#cartFoot",  say: "৳৫০০-এর বেশি হলে ডেলিভারি ফ্রি।" },
      { sel: "#checkout",  say: "সব ঠিক থাকলে Place order চাপুন।" }
    ],
    /* the order form */
    order: [
      { sel: "#oName",  say: "আপনার নাম লিখুন।" },
      { sel: "#oPhone", say: "১১ সংখ্যার মোবাইল নম্বর — কুরিয়ার এখানেই ফোন করবে।" },
      { sel: "#oDist",  say: "জেলার নাম লিখুন।" },
      { sel: "#oAddr",  say: "বাসা, রোড, এলাকা — যেন কুরিয়ার সহজে খুঁজে পায়।" },
      { sel: "#oPromo", say: "প্রমো কোড থাকলে এখানে বসান।" },
      { sel: "#orderSum", say: "মোট কত আসছে, একবার দেখে নিন।" },
      { sel: "#orderGo", say: "সব ঠিক? শেষ চাপটা আপনি নিজে দিন।" }
    ]
  };

  /* ============================================================
     2. WHAT IT UNDERSTANDS WHEN YOU SPEAK (Bengali, then English)
     ============================================================ */
  /* Most specific phrases first: "ব্যাগে রাখো" must win over "ব্যাগ". */
  var VOICE = [
    { w: ["ব্যাগে রাখ", "ব্যাগে দাও", "ব্যাগে ভর", "অ্যাড কর", "add to bag", "add"],
      sel: "#addBtn", say: "ব্যাগে রাখছি।" },
    { w: ["অর্ডার কর", "অর্ডার দাও", "অর্ডার দিব", "place order", "checkout"],
      sel: "#checkout", say: "অর্ডার ফর্ম খুলছি।" },
    { w: ["কনফার্ম", "নিশ্চিত", "confirm"], sel: "#orderGo", noClick: true,
      say: "শেষ চাপটা আপনি নিজে দিন — এটা আমি চাপব না।" },
    { w: ["সাইজ চার্ট", "মাপের চার্ট", "মাপ দেখ", "size chart"], sel: ".size-chart",
      noClick: true, say: "এই যে মাপের চার্ট।" },
    { w: ["এখনি কিন", "কিনব", "কিনবো", "buy now", "buy"], sel: "#buyBtn",
      say: "কেনার ধাপে নিচ্ছি।" },
    { w: ["নারী", "মেয়ে", "women", "woman"], sel: '#genderChips [data-gender="women"]',
      say: "নারীদের পোশাক দেখাচ্ছি।" },
    { w: ["পুরুষ", "ছেলে", "men", "man"], sel: '#genderChips [data-gender="men"]',
      say: "পুরুষদের পোশাক দেখাচ্ছি।" },
    { w: ["সবাই", "সবকিছু", "সব দেখ", "সবগুলো", "everyone"],
      sel: '#genderChips [data-gender="all"]',
      say: "সব দেখাচ্ছি।" },
    { w: ["ব্যাগ", "কার্ট", "bag", "cart"], sel: "#cartBtn", say: "ব্যাগ খুলছি।" },
    { w: ["খোঁজ", "খুঁজ", "সার্চ", "search"], sel: "#q", focus: true,
      say: "লিখুন, খুঁজে দিচ্ছি।" },
    { w: ["থিম", "রাত", "অন্ধকার", "আলো", "theme", "dark", "light"], sel: "#themeBtn",
      say: "থিম বদলে দিলাম।" },
    { w: ["হোয়াটস", "whatsapp"], sel: "#waTalk", noClick: true,
      say: "এখানে চাপলে WhatsApp খুলবে — আপনি চাপুন।" },
    { w: ["বাড়াও", "বাড়া", "আরেকটা", "more"], sel: '.stepper [data-q="1"]',
      say: "একটা বাড়ালাম।" },
    { w: ["কমাও", "কমা", "less"], sel: '.stepper [data-q="-1"]', say: "একটা কমালাম।" },
    { w: ["সাজাও", "সর্ট", "sort"], sel: "#sort", focus: true, say: "এখান থেকে সাজান।" },
    { w: ["রঙ", "রং", "কালার", "colour", "color"], sel: ".swatches", noClick: true,
      say: "রঙ এখান থেকে বেছে নিন।" },
    /* the order form, field by field */
    { w: ["নাম লিখ", "নাম বস", "আপনার নাম", "your name"], sel: "#oName", focus: true,
      say: "নামটা এখানে লিখুন।" },
    { w: ["মোবাইল", "ফোন", "নম্বর", "mobile", "phone"], sel: "#oPhone", focus: true,
      say: "১১ সংখ্যার নম্বর এখানে।" },
    { w: ["জেলা", "district"], sel: "#oDist", focus: true, say: "জেলার নাম এখানে।" },
    { w: ["ঠিকানা", "বাসা", "address"], sel: "#oAddr", focus: true,
      say: "পুরো ঠিকানা এখানে লিখুন।" },
    { w: ["প্রমো", "কুপন", "promo", "coupon"], sel: "#oPromo", focus: true,
      say: "কোডটা এখানে বসান।" },
    { w: ["মোট", "টোটাল", "total"], sel: "#orderSum", noClick: true,
      say: "মোট এইটুকু আসছে।" },
    { w: ["বন্ধ", "ক্লোজ", "close"], act: "close", say: "বন্ধ করলাম।" },
    { w: ["উপরে", "উপর", "up", "top"], act: "up", say: "উপরে যাচ্ছি।" },
    { w: ["নিচে", "নিচ", "down"], act: "down", say: "নিচে যাচ্ছি।" },
    { w: ["পরের", "পরবর্তী", "next"], act: "next", say: "" },
    { w: ["থাম", "চুপ", "stop"], act: "stop", say: "আচ্ছা, চুপ থাকলাম।" },
    { w: ["লুকাও", "চলে যাও", "hide"], act: "hide", say: "" }
  ];

  var ORDINALS = [
    { w: ["প্রথম", "১", "এক ", "first", "one"], n: 1 },
    { w: ["দ্বিতীয়", "২", "দুই", "second", "two"], n: 2 },
    { w: ["তৃতীয়", "৩", "তিন", "third", "three"], n: 3 },
    { w: ["চতুর্থ", "৪", "চার", "fourth", "four"], n: 4 },
    { w: ["পঞ্চম", "৫", "পাঁচ", "fifth", "five"], n: 5 },
    { w: ["ষষ্ঠ", "৬", "ছয়", "sixth", "six"], n: 6 }
  ];
  var CLICK_WORDS = ["ক্লিক", "চাপ", "টিপ", "প্রেস", "খোল", "দেখাও", "click", "press", "open", "tap"];

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
  hit.setAttribute("aria-label", "সাহায্যকারী কাঠবিড়ালি — পরের কথাটি শুনুন");
  sq.appendChild(hit);

  var btns = document.createElement("div");
  btns.className = "sq-btns";

  var mic = document.createElement("button");
  mic.className = "sq-btn sq-mic";
  mic.type = "button";
  mic.innerHTML = MIC;
  mic.setAttribute("aria-label", "ভয়েস কমান্ড চালু বা বন্ধ করুন");

  var x = document.createElement("button");
  x.className = "sq-btn sq-x";
  x.type = "button";
  x.textContent = "×";
  x.setAttribute("aria-label", "কাঠবিড়ালিটি সরিয়ে দিন");

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
  var MAX_TIPS = 6;
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
     Her voice. Browsers hand back a different list of voices on every
     device, so pick the best available: a Bengali female voice first,
     then any Bengali one, then any female voice at all. If nothing on
     the device is identifiably female, lift the pitch so it still
     reads as a young woman rather than a man.
     --------------------------------------------------------------- */
  var VOICES = [], VOICE_PICK = null, VOICE_FEM = false;
  var FEMALE_RE = /(female|woman|girl|\bfem\b|aarohi|swara|kalpana|tanishaa|priya|heera|veena|raveena|lekha|zira|susan|samantha|karen|moira|tessa|fiona|serena|amelie|nandini|sadia|anu)/i;
  var MALE_RE = /(\bmale\b|\bman\b|\bboy\b|david|mark|rishi|hemant|ravi|prabhat|alex|daniel|fred|george|james|oliver)/i;

  function rankVoice(v) {
    var n = (v.name || "") + " " + (v.voiceURI || "");
    var sc = 0;
    if (/^bn/i.test(v.lang)) sc += 120;
    else if (/^en[-_]?IN/i.test(v.lang)) sc += 35;
    else if (/^hi/i.test(v.lang)) sc += 25;
    else if (/^en/i.test(v.lang)) sc += 12;
    if (FEMALE_RE.test(n)) sc += 60;
    if (MALE_RE.test(n)) sc -= 80;
    if (/google/i.test(n)) sc += 6;
    if (v.localService) sc += 3;
    return sc;
  }
  function loadVoices() {
    try { VOICES = window.speechSynthesis.getVoices() || []; } catch (e) { VOICES = []; }
    VOICE_PICK = null;
    var bestScore = -1;
    for (var i = 0; i < VOICES.length; i++) {
      var sc = rankVoice(VOICES[i]);
      if (sc > bestScore) { bestScore = sc; VOICE_PICK = VOICES[i]; }
    }
    VOICE_FEM = !!(VOICE_PICK && FEMALE_RE.test(VOICE_PICK.name || ""));
  }
  if (window.speechSynthesis) {
    loadVoices();
    try { window.speechSynthesis.addEventListener("voiceschanged", loadVoices); }
    catch (e) { window.speechSynthesis.onvoiceschanged = loadVoices; }
  }

  function speak(text) {
    if (!voiceOn || !text || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      if (!VOICE_PICK) loadVoices();
      if (VOICE_PICK) u.voice = VOICE_PICK;
      u.lang = (VOICE_PICK && /^bn/i.test(VOICE_PICK.lang)) ? VOICE_PICK.lang : "bn-BD";
      u.rate  = 1.0;
      u.pitch = VOICE_FEM ? 1.25 : 1.6;   /* lift it if the device has no female voice */
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

  /* the next thing on the current list that is ALREADY on screen —
     he never scrolls the page to find something */
  function nextTip() {
    if (hidden || busy) return;
    if (given >= MAX_TIPS) { done = true; idle(); return; }
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
  window.setTimeout(function () { startTour(situation(), 2400); }, 200);

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
    "on", "to", "me", "please", "go", "and", "a", "an"
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
    "সেরা": "best seller", "স্টক": "stock", "রিভিউ": "review"
  };

  function norm(t) {
    return String(t || "").toLowerCase()
      .replace(/[\u200b\u200c\u200d]/g, "")
      .replace(/[^0-9a-z\u0980-\u09FF]+/g, " ")
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

  function heard(raw) {
    var text = String(raw || "").toLowerCase().replace(/[।,.?!]/g, " ").trim();
    if (!text) return;
    window.clearTimeout(timer);   /* a spoken command outranks the tour */

    /* "তৃতীয় জামাটা দেখাও" → the third card on screen */
    if (has(text, ["প্রোডাক্ট", "জামা", "পোশাক", "কার্ড", "product", "item"])) {
      for (var o = 0; o < ORDINALS.length; o++) {
        if (has(text, ORDINALS[o].w)) {
          var cards = document.querySelectorAll("#grid .card");
          var el = cards[ORDINALS[o].n - 1];
          if (onScreen(el)) { press(el, { say: ORDINALS[o].n + " নম্বরটা খুলছি।" }); return; }
          tell("ওই নম্বরটা এখন পর্দায় নেই।"); return;
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
    var LETTER = { "এল": "l", "এম": "m", "এস": "s", "এ": "", "ও": "" };
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
    var saidSize = has(text, ["সাইজ", "মাপ", "size"]);
    var want = null;
    for (var z = 0; z < SIZES.length; z++) {
      if (SIZES[z].re.test(lt) && (SIZES[z].strong || saidSize)) { want = SIZES[z].s; break; }
    }
    if (want) {
      var sizeBtns = document.querySelectorAll(".sizes .size");
      if (!sizeBtns.length) {
        tell("আগে একটা পোশাক খুলুন — তারপর সাইজ বলুন।");
        return;
      }
      var have = [], hitBtn = null;
      for (var y = 0; y < sizeBtns.length; y++) {
        var lbl = (sizeBtns[y].textContent || "").trim().toUpperCase();
        have.push(lbl);
        if (lbl === want) hitBtn = sizeBtns[y];
      }
      if (hitBtn) { press(hitBtn, { say: want + " সাইজ বেছে নিলাম।" }); return; }
      tell(want + " সাইজটা এই পোশাকে নেই। আছে — " + have.join(", ") + "।");
      return;
    }

    /* the named things */
    var missed = null;
    for (var i = 0; i < VOICE.length; i++) {
      var v = VOICE[i];
      if (!has(text, v.w)) continue;

      if (v.act === "close") {
        var scrim = document.getElementById("scrim");
        if (scrim) scrim.click();
        tell(v.say); return;
      }
      if (v.act === "up")   { window.scrollBy({ top: -VH() * .8, behavior: "smooth" }); tell(v.say); return; }
      if (v.act === "down") { window.scrollBy({ top:  VH() * .8, behavior: "smooth" }); tell(v.say); return; }
      if (v.act === "next") { poke(); return; }
      if (v.act === "stop") { done = true; window.clearTimeout(timer); tell(v.say); return; }
      if (v.act === "hide") { x.click(); return; }

      var target = $(v.sel);
      if (!onScreen(target)) { missed = v; continue; }  /* maybe something else fits */
      press(target, v);
      return;
    }

    /* "প্রোডাক্ট সিলেক্ট করো" with no number — the first card on screen */
    if (has(text, ["প্রোডাক্ট", "জামা", "পোশাক", "কার্ড", "product", "item"])) {
      var cards = document.querySelectorAll("#grid .card");
      for (var c = 0; c < cards.length; c++) {
        if (onScreen(cards[c])) {
          press(cards[c], { say: "এটা খুলছি।" });
          return;
        }
      }
    }

    /* anything else that is written on the screen right now */
    var best = findOnPage(text);
    if (best) {
      if (best.el.id === "orderGo") {
        busy = true;
        pointAt(best.el, "শেষ চাপটা আপনি নিজে দিন।");
        window.setTimeout(function () { busy = false; loop(); }, 4200);
        return;
      }
      press(best.el, {
        say: best.name ? "এই যে — " + best.name + "।" : "এখানে চাপছি।",
        focus: isField(best.el)
      });
      return;
    }

    /* a bare "এটা ক্লিক করো" — he presses whatever he is pointing at */
    if (has(text, CLICK_WORDS)) {
      if (current && current.id !== "orderGo") { press(current, {}); return; }
      if (current) { tell("শেষ চাপটা আপনি নিজে দিন।"); return; }
      tell("কোনটায়? পর্দায় যা লেখা আছে তার নাম বলুন।");
      return;
    }

    if (missed) { tell("এটা এখন পর্দায় নেই — আগে ওই ধাপটা খুলুন।"); return; }
    tell("\u201C" + text.slice(0, 26) + "\u201D — এটা পর্দায় খুঁজে পেলাম না।");
  }

  function listen(on) {
    if (!SR) return;
    wantVoice = on;
    if (!on) {
      voiceOn = false;
      mic.dataset.on = "0";
      if (rec) { try { rec.abort(); } catch (e) {} }
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
      return;
    }
    if (!rec) {
      rec = new SR();
      rec.lang = "bn-BD";
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = function (ev) {
        for (var i = ev.resultIndex; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) heard(ev.results[i][0].transcript);
        }
      };
      rec.onerror = function (ev) {
        if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
          listen(false);
          tell("মাইক্রোফোনের অনুমতি দিতে হবে — ব্রাউজারের ঠিকানা বারে তালার আইকনে দেখুন।");
        }
      };
      rec.onend = function () {
        if (wantVoice) { window.setTimeout(function () { try { rec.start(); } catch (e) {} }, 350); }
      };
    }
    try { rec.start(); } catch (e) {}
    voiceOn = true;
    mic.dataset.on = "1";
    tell("শুনছি। বলুন — নারী, পুরুষ, ব্যাগ, সাইজ এল, ব্যাগে রাখো।");
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
    at: function () { return current; }
  };
})();
