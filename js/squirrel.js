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

  try { if (localStorage.getItem(KEY) === "1") return; } catch (e) {}

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
    { w: ["সবাই", "সবকিছু", "everyone"], sel: '#genderChips [data-gender="all"]',
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
    '.sq .sq-ear{transform-origin:92px 30px;animation:sq-ear 7s ease-in-out infinite;}',
    '.sq .sq-lid{transform-origin:104px 42px;animation:sq-blink 5.6s infinite;}',
    '.sq .sq-arm{transform-origin:94px 72px;',
    '  transition:transform .5s cubic-bezier(.34,1.56,.64,1);}',
    '.sq[data-point="1"] .sq-arm{transform:rotate(-55deg);}',
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
    '  .sq{width:86px;height:86px;}',
    '  .sq-say{max-width:196px;font-size:13.5px;padding:9px 12px;}',
    '  .sq-btn{opacity:.85;}',
    '}',
    '@media (max-width:360px){.sq-layer{display:none;}}',
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
        '<radialGradient id="sqEye" cx=".34" cy=".26" r=".9">',
          '<stop offset="0" stop-color="#6E4F61"/>',
          '<stop offset=".42" stop-color="#31202B"/>',
          '<stop offset="1" stop-color="#0E070B"/>',
        '</radialGradient>',
        '<radialGradient id="sqNose" cx=".35" cy=".28" r=".9">',
          '<stop offset="0" stop-color="#D98FB6"/>',
          '<stop offset="1" stop-color="#A9578A"/>',
        '</radialGradient>',
      '</defs>',

      /* contact shadow on the ground */
      '<ellipse class="sq-shadow" cx="84" cy="121" rx="29" ry="5.2"',
      '   fill="#2A0F20" opacity=".16"/>',

      /* ------------------------- tail -------------------------
         Plume: a frayed silhouette, then overlapping strokes that
         run WITH the hair, lightest on the outside of the curve. */
      '<g class="sq-tail">',
        '<g filter="url(#sqFrayTail)">',
          /* the plume, broad the way a squirrel's actually is */
          '<path d="M76 116 C48 118 25 105 16 82 C7 59 13 32 30 18 C43 7 60 2 76 5',
          '         C62 18 54 34 52 52 C50 72 56 92 68 104 C71 108 74 112 76 116 Z"',
          '      fill="url(#sqPlume)"/>',
          /* volume down the middle of the plume */
          '<path d="M72 110 C50 103 35 85 35 61 C35 39 47 21 66 11"',
          '      fill="none" stroke="#FFFFFF" stroke-width="22" stroke-linecap="round"',
          '      opacity=".5"/>',
          '<path d="M70 106 C52 98 42 82 43 62 C44 43 53 28 68 18"',
          '      fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"',
          '      opacity=".55"/>',
        '</g>',
        '<g filter="url(#sqFrayFine)" fill="none" stroke-linecap="round">',
          '<path d="M66 108 C47 99 36 82 37 60 C38 40 47 24 63 13"',
          '      stroke="#FFFFFF" stroke-width="3.2" opacity=".9"/>',
          '<path d="M60 112 C39 103 27 84 28 60 C29 40 39 23 57 11"',
          '      stroke="#DFD0DA" stroke-width="1.8" opacity=".6"/>',
          '<path d="M74 8 C63 12 54 19 48 28 M24 26 C18 35 15 44 14 54"',
          '      stroke="#F3ECF1" stroke-width="2.6" opacity=".8"/>',
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
      '   stroke="#D3C1CE" stroke-width="1.15" stroke-linecap="round" fill="none"',
      '   opacity=".9"/>',

      /* ------------------- the arm that does the pointing -------------------
         At rest it hangs forward from the shoulder. To explain something it
         swings up to horizontal — the gesture a person reads as "look here". */
      '<g class="sq-arm">',
        /* a soft shadow behind the limb, so a white arm still reads
           against a white chest */
        '<g filter="url(#sqFrayFine)" opacity=".7">',
          '<path d="M95 73.5 C100 79.5 104 86.5 105 93.5" fill="none" stroke="#CBB7C6"',
          '      stroke-width="13" stroke-linecap="round"/>',
        '</g>',
        '<g filter="url(#sqFrayFine)">',
          '<path d="M94 72 C99 78 103 85 104 92" fill="none" stroke="#FDFBFC"',
          '      stroke-width="10.5" stroke-linecap="round"/>',
          '<path d="M104 89 C109.5 87.5 113 92 112 96.5 C111 101 104 102 100.5 98.5',
          '         C97.5 95 99.5 90.5 104 89 Z" fill="#FFFFFF"/>',
        '</g>',
        '<path d="M94 72 C99 78 103 85 104 92" fill="none" stroke="#C9B4C4"',
        '   stroke-width="1.5" stroke-linecap="round" opacity=".8"/>',
        '<path d="M104 89 C109.5 87.5 113 92 112 96.5 C111 101 104 102 100.5 98.5',
        '         C97.5 95 99.5 90.5 104 89 Z" fill="none" stroke="#C9B4C4"',
        '   stroke-width="1.4" stroke-linejoin="round" opacity=".85"/>',
        '<path d="M108 88.5 L110 85.5 M112 92 L115.5 91 M110.5 97 L113 99.5"',
        '   stroke="#CDB9C8" stroke-width="1.15" stroke-linecap="round" fill="none"/>',
      '</g>',

      /* ------------------------- head ------------------------- */
      '<g class="sq-head">',
        '<g class="sq-ear">',
          '<g filter="url(#sqFrayFine)">',
            '<path d="M86 31 C81 12 94 2 102 12 C107 19 105 30 100 33 Z" fill="#FCF9FB"/>',
          '</g>',
          '<path d="M89.5 28 C86.5 15 94.5 9 98.5 16.5 C101 21 100 27.5 98 29.5 Z"',
          '   fill="#EFB9D5" opacity=".75"/>',
          '<path d="M86.5 14 C84 10 84 7 86.5 5.5 M100 12 C101.5 8 103 6.5 105.5 6.5"',
          '   fill="none" stroke="#F4EDF2" stroke-width="2.2" stroke-linecap="round"/>',
        '</g>',
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
        '<g stroke="#CDBCC9" stroke-width=".95" stroke-linecap="round" fill="none"',
        '   opacity=".9">',
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

  layer.appendChild(ring);
  layer.appendChild(say);
  layer.appendChild(sq);
  document.body.appendChild(layer);

  /* ============================================================
     6. MOVEMENT — little hops, anywhere on the screen
     ============================================================ */
  var VW = function () { return window.innerWidth; };
  var VH = function () { return window.innerHeight; };
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

  function speak(text) {
    if (!voiceOn || !text || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "bn-BD"; u.rate = .98; u.pitch = 1.15;
      var vs = window.speechSynthesis.getVoices() || [];
      for (var i = 0; i < vs.length; i++) {
        if (/^bn/i.test(vs[i].lang)) { u.voice = vs[i]; break; }
      }
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

  x.addEventListener("click", function (ev) {
    ev.stopPropagation();
    hidden = true;
    window.clearTimeout(timer);
    listen(false);
    layer.hidden = true;
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
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
  function press(el, opts) {
    opts = opts || {};
    opts.say = opts.say || "";
    busy = true;
    window.clearTimeout(timer);
    pointAt(el, opts.say);
    window.setTimeout(function () {
      try {
        if (opts.noClick) { /* his paw stays off this one */ }
        else if (opts.focus && el.focus) el.focus();
        else el.click();
      } catch (e) {}
      window.setTimeout(function () { busy = false; loop(); }, 1300);
    }, REDUCED ? 180 : 900);
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

    /* "এল সাইজ" */
    if (has(text, ["সাইজ", "size"])) {
      var sizes = document.querySelectorAll(".sizes .size");
      var names = [
        { w: ["এক্স এল", "এক্সএল", "xl", "এক্স-এল"], m: /^xl$/i },
        { w: ["এল", " l ", "লার্জ", "large"], m: /^l$/i },
        { w: ["এম", "মিডিয়াম", "medium", " m "], m: /^m$/i },
        { w: ["এস", "স্মল", "small", " s "], m: /^s$/i }
      ];
      for (var n = 0; n < names.length; n++) {
        if (has(" " + text + " ", names[n].w)) {
          for (var k = 0; k < sizes.length; k++) {
            if (names[n].m.test(sizes[k].textContent.trim())) {
              press(sizes[k], { say: sizes[k].textContent.trim() + " সাইজ বেছে নিলাম।" });
              return;
            }
          }
        }
      }
    }

    /* the named things */
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
      if (!onScreen(target)) {
        tell("এটা এখন পর্দায় নেই — আগে ওই ধাপটা খুলুন।");
        return;
      }
      press(target, v);
      return;
    }

    /* a bare "এটা ক্লিক করো" — he presses whatever he is pointing at */
    if (has(text, CLICK_WORDS)) {
      if (current && current.id !== "orderGo") { press(current, {}); return; }
      if (current) { tell("শেষ চাপটা আপনি নিজে দিন।"); return; }
      tell("কোনটা? নাম বলুন — যেমন নারী, ব্যাগ, সাইজ এল।");
      return;
    }

    tell("বুঝলাম না। বলুন: নারী, পুরুষ, ব্যাগ, সাইজ এল, ব্যাগে রাখো।");
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
