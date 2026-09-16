/* ============================================================
   ProwdFashion — the white squirrel guide  (কাঠবিড়ালি)
   ------------------------------------------------------------
   A white squirrel lives on the page. Every so often it hops
   across to one of the important parts of the shop — the
   নারী/পুরুষ chips, the search box, the cart — sits down beside
   it, raises a paw at it and says what it is in Bengali.

   Self-contained on purpose: it injects its own CSS and markup,
   so the only change needed elsewhere is one <script> tag in
   index.html. Nothing here touches the shop's own state.

   - Never covers a click: the whole layer is pointer-events:none
     except the squirrel itself and its close button.
   - It sits BESIDE what it points at, never on top of it.
   - Respects prefers-reduced-motion (no hopping, tips still show).
   - Hidden on very small screens where it would crowd the page.
   - "Don't show again" is remembered in localStorage.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "prowdfashion.squirrel.off";
  var REDUCED = window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try { if (localStorage.getItem(KEY) === "1") return; } catch (e) {}

  /* ---------- the tips, in the order the squirrel gives them ----------
     sel : what to hop to (first match wins; skipped if missing)
     say : the line in the speech bubble                              */
  var TIPS = [
    { sel: "#genderChips", say: "নারী না পুরুষ — কার জন্য কিনছেন, এখান থেকে বেছে নিন।" },
    { sel: "#q",           say: "এখানে লিখে পছন্দের পোশাক খুঁজে নিন।" },
    { sel: "#typeChips",   say: "টি-শার্ট, পোলো… ধরন অনুযায়ী দেখুন।" },
    { sel: "#grid .card",  say: "ছবিতে ক্লিক করলে সাইজ, মাপ আর বিস্তারিত।" },
    { sel: "#sort",        say: "দাম কম-বেশি অনুযায়ী সাজিয়ে নিন।" },
    { sel: "#cartBtn",     say: "পছন্দ হলে ব্যাগে রাখুন — এখানে জমা থাকবে।" },
    { sel: "#waTalk",      say: "যেকোনো প্রশ্ন? WhatsApp-এ সরাসরি লিখুন।" },
    { sel: "#themeBtn",    say: "রাতে চোখ আরাম চাইলে এই বোতামটা চাপুন।" }
  ];

  /* ---------------------------- styles ---------------------------- */
  var CSS = [
    '.sq-layer{position:fixed;inset:0;z-index:70;pointer-events:none;}',
    '.sq-layer[hidden]{display:none!important;}',

    /* the squirrel — moved only by transform, so it can go anywhere */
    '.sq{position:fixed;left:0;top:0;width:100px;height:100px;',
    '  pointer-events:auto;cursor:pointer;will-change:transform;}',
    '.sq-svg{width:100%;height:100%;overflow:visible;display:block;',
    '  transform-origin:50% 60%;',
    '  filter:drop-shadow(0 8px 16px rgba(35,10,26,.30));}',
    '.sq[data-face="left"] .sq-svg{transform:scaleX(-1);}',

    /* the bits that move */
    '.sq .sq-tail{transform-origin:58px 96px;animation:sq-tail 2.4s ease-in-out infinite;}',
    '.sq .sq-head{transform-origin:70px 52px;animation:sq-head 5s ease-in-out infinite;}',
    '.sq .sq-ear{transform-origin:78px 30px;animation:sq-ear 6s ease-in-out infinite;}',
    '.sq .sq-lid{transform-origin:87px 41px;animation:sq-blink 5.4s infinite;}',
    '.sq .sq-arm{transform-origin:74px 68px;',
    '  transition:transform .5s cubic-bezier(.34,1.56,.64,1);}',
    '.sq[data-point="1"] .sq-arm{transform:rotate(-40deg);}',
    '.sq[data-hop="1"] .sq-tail{animation:sq-tail-hop .5s ease-in-out infinite;}',

    '@keyframes sq-tail{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(6deg)}}',
    '@keyframes sq-tail-hop{0%,100%{transform:rotate(-9deg)}50%{transform:rotate(11deg)}}',
    '@keyframes sq-head{0%,100%{transform:rotate(0)}30%{transform:rotate(-3.5deg)}',
    '  62%{transform:rotate(3deg)}}',
    '@keyframes sq-ear{0%,86%,100%{transform:rotate(0)}90%{transform:rotate(-13deg)}',
    '  94%{transform:rotate(7deg)}}',
    '@keyframes sq-blink{0%,93%,100%{transform:scaleY(0)}95.5%{transform:scaleY(1)}}',

    /* speech bubble */
    '.sq-say{position:fixed;max-width:248px;padding:11px 14px;border-radius:14px;',
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
    '  opacity:0;transition:opacity .3s ease,top .4s ease,left .4s ease,',
    '  width .4s ease,height .4s ease;}',
    '.sq-ring[data-on="1"]{opacity:.9;animation:sq-pulse 1.5s ease-in-out infinite;}',
    '@keyframes sq-pulse{0%,100%{box-shadow:0 0 0 0 rgba(194,11,116,.30)}',
    '  50%{box-shadow:0 0 0 7px rgba(194,11,116,0)}}',

    /* dismiss */
    '.sq-x{position:absolute;top:2px;right:0;width:21px;height:21px;border-radius:50%;',
    '  opacity:0;transition:opacity .2s ease;',
    '  border:1.5px solid var(--line-2,#D2BBCB);background:var(--surface,#fff);',
    '  color:var(--ink-2,#665A61);font-size:13px;line-height:1;cursor:pointer;',
    '  pointer-events:auto;display:flex;align-items:center;justify-content:center;padding:0;}',
    '.sq-x:hover{border-color:var(--accent,#C20B74);color:var(--accent,#C20B74);}',
    '.sq:hover .sq-x,.sq:focus-within .sq-x,.sq-x:focus{opacity:1;}',

    /* small screens: smaller squirrel, narrower bubble */
    '@media (max-width:620px){',
    '  .sq{width:84px;height:84px;}',
    '  .sq-say{max-width:196px;font-size:13.5px;padding:9px 12px;}',
    '}',
    /* no room at all */
    '@media (max-width:360px){.sq-layer{display:none;}}',
    '@media (prefers-reduced-motion:reduce){',
    '  .sq .sq-tail,.sq .sq-head,.sq .sq-ear,.sq .sq-lid,.sq-ring[data-on="1"]',
    '    {animation:none!important;}',
    '}'
  ].join("");

  /* ---------------------------- the squirrel ----------------------------
     Drawn the way a real squirrel actually holds itself when it stops to
     look at something: sitting up on its haunches, big tail curled behind
     the back, both forepaws held in front of the chest. Built in layers —
     under-fur, body, pale belly, shading, then loose fur strands on top —
     so the outline never reads as a flat cartoon shape.                  */
  var SVG = [
    '<svg class="sq-svg" viewBox="0 0 118 118" aria-hidden="true">',
      '<defs>',
        '<linearGradient id="sqFur" x1=".2" y1="0" x2=".8" y2="1">',
          '<stop offset="0" stop-color="#FFFFFF"/>',
          '<stop offset=".5" stop-color="#F6F0F4"/>',
          '<stop offset="1" stop-color="#DFD1DA"/>',
        '</linearGradient>',
        '<linearGradient id="sqTail" x1=".1" y1="1" x2=".9" y2="0">',
          '<stop offset="0" stop-color="#E7DAE4"/>',
          '<stop offset=".45" stop-color="#FBF7FA"/>',
          '<stop offset="1" stop-color="#FFFFFF"/>',
        '</linearGradient>',
        '<linearGradient id="sqBelly" x1="0" y1="0" x2="0" y2="1">',
          '<stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/>',
          '<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>',
        '</linearGradient>',
        '<radialGradient id="sqEye" cx=".34" cy=".28" r=".85">',
          '<stop offset="0" stop-color="#6B4C5E"/>',
          '<stop offset=".5" stop-color="#2D1C26"/>',
          '<stop offset="1" stop-color="#120A0F"/>',
        '</radialGradient>',
      '</defs>',

      /* ---------------- tail ----------------
         One crescent, drawn three times: a wide soft outline stroke, the
         same shape in fur colour to puff the edge out, then the fill. That
         gives a thick furry silhouette without any spiky strands. The fur
         direction is suggested by long curves that run WITH the tail.     */
      '<g class="sq-tail">',
        /* a wide soft outline, the same shape puffed out in fur colour, then
           long curves that run WITH the tail — fur, not spikes */
        '<path d="M61 101 C49 103 38 101 31 95 C23 89 18 79 17 68 C16 57 18 47 22 38 C27 28 35 20 45 15 C53 11 62 10 70 13 C59 18 49 26 43 35 C37 44 34 55 35 65 C36 77 44 87 56 91 Z"',
        '   fill="#E9DCE6" stroke="#CFBCCB" stroke-width="13"',
        '   stroke-linejoin="round" stroke-linecap="round"/>',
        '<path d="M61 101 C49 103 38 101 31 95 C23 89 18 79 17 68 C16 57 18 47 22 38 C27 28 35 20 45 15 C53 11 62 10 70 13 C59 18 49 26 43 35 C37 44 34 55 35 65 C36 77 44 87 56 91 Z"',
        '   fill="url(#sqTail)" stroke="url(#sqTail)" stroke-width="10"',
        '   stroke-linejoin="round" stroke-linecap="round"/>',
        '<path d="M52 95 C38 89 31 76 32 61 C33 47 41 33 54 24" fill="none"',
        '   stroke="#EFE5EC" stroke-width="2.6" stroke-linecap="round" opacity=".9"/>',
        '<path d="M44 97 C29 90 22 75 24 58 C26 42 36 28 51 19" fill="none"',
        '   stroke="#E2D4DE" stroke-width="1.8" stroke-linecap="round" opacity=".75"/>',
        '<path d="M36 94 C24 84 20 68 25 52" fill="none"',
        '   stroke="#F7F2F6" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>',
        '<path d="M66 15 C58 19 51 24 46 31" fill="none"',
        '   stroke="#EFE5EC" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>',
      '</g>',

      /* ---------------- haunch + body ---------------- */
      '<path d="M58 59 C45 65 41 87 50 98 C57 107 85 108 90 96 C96 81 88 62 75 56 Z"',
      '   fill="url(#sqFur)" stroke="#CBB7C6" stroke-width="1.7" stroke-linejoin="round"/>',
      /* pale chest, fading out so it is shading rather than a painted egg */
      '<path d="M65 70 C59 79 60 92 67 98 C74 103 84 100 86 92 C88 82 79 71 71 68 Z"',
      '   fill="url(#sqBelly)"/>',
      /* shading down the back and along the haunch */
      '<path d="M79 59 C89 68 92 83 88 95" fill="none" stroke="#DFD0DA"',
      '   stroke-width="2.2" stroke-linecap="round" opacity=".85"/>',
      '<path d="M53 76 C50 85 51 93 55 99" fill="none" stroke="#E4D6E0"',
      '   stroke-width="1.8" stroke-linecap="round" opacity=".8"/>',
      /* a few short fur marks on the flank */
      '<path d="M57 72 q5 3 4 7 M56 86 q5 2 5 6 M82 71 q-4 4 -3 8"',
      '   fill="none" stroke="#E0D1DB" stroke-width="1.4" stroke-linecap="round"/>',

      /* ---------------- hind foot ---------------- */
      '<path d="M57 96 C52 101 55 108 62 108 C71 108 77 104 76 99 C75 94 64 93 57 96 Z"',
      '   fill="#FCF8FB" stroke="#CBB7C6" stroke-width="1.5" stroke-linejoin="round"/>',
      '<path d="M61 107.5 L61 102 M66 108 L66 102 M71 106.5 L70 101"',
      '   stroke="#CFBDCB" stroke-width="1.1" stroke-linecap="round" fill="none"/>',

      /* ---------------- resting forepaw, tucked at the chest ---------- */
      '<path d="M72 71 C77 69 82 71.5 82.5 75.5 C83 79 78 81 74 79.5 C70.5 78 69 73 72 71 Z"',
      '   fill="#FFFFFF" stroke="#CBB7C6" stroke-width="1.4" stroke-linejoin="round"/>',
      '<path d="M77.5 70.5 L78.5 73.5 M81 72.5 L81 75.5" stroke="#D8C7D3"',
      '   stroke-width="1" stroke-linecap="round" fill="none"/>',

      /* ---------------- pointing arm ---------------- */
      '<g class="sq-arm">',
        '<path d="M74 68 C82 70 89 75 94 82" fill="none" stroke="#FBF7FA"',
        '   stroke-width="9" stroke-linecap="round"/>',
        '<path d="M74 68 C82 70 89 75 94 82" fill="none" stroke="#CBB7C6"',
        '   stroke-width="1.3" stroke-linecap="round" opacity=".45"/>',
        '<path d="M94 80 C99 78 103 81 103 85 C103 89 98 91 94 89 C90 87 90 82 94 80 Z"',
        '   fill="#FFFFFF" stroke="#CBB7C6" stroke-width="1.4" stroke-linejoin="round"/>',
        '<path d="M99 80.5 L102 78.5 M102 84 L106 84 M100.5 88 L103.5 90.5"',
        '   stroke="#CBB7C6" stroke-width="1.1" stroke-linecap="round" fill="none"/>',
      '</g>',

      /* ---------------- head ---------------- */
      '<g class="sq-head">',
        '<g class="sq-ear">',
          '<path d="M74 31 C71 21 79 15 85 21 C89 25 88 31 85 33 Z" fill="#FCF8FB"',
          '   stroke="#CBB7C6" stroke-width="1.5" stroke-linejoin="round"/>',
          '<path d="M77.5 28.5 C76 22 80.5 19 83 23 C84.5 26 84 28.5 82.5 29.5 Z"',
          '   fill="#F2C3DB" opacity=".8"/>',
          /* soft tufts, curved like fur rather than spikes */
          '<path d="M76 19 C74 15 74.5 12 77 11 M84 19 C85 15 86.5 13.5 88.5 13.5"',
          '   fill="none" stroke="#EFE5EC" stroke-width="2.2" stroke-linecap="round"/>',
        '</g>',
        /* skull and muzzle in one silhouette */
        '<path d="M69 34 C58 40 55 53 62 61 C70 69 88 68 96 60 C103 53 105 45 100 39',
        '   C94 31 79 29 69 34 Z"',
        '   fill="url(#sqFur)" stroke="#CBB7C6" stroke-width="1.7" stroke-linejoin="round"/>',
        /* cheek fur */
        '<path d="M65 55 q5 4 4 8 M72 61 q4 3 3 7" fill="none" stroke="#E0D1DB"',
        '   stroke-width="1.5" stroke-linecap="round"/>',
        /* brow */
        '<path d="M81 34 q7 -1.5 11 2.5" fill="none" stroke="#D9C8D4" stroke-width="1.7"',
        '   stroke-linecap="round"/>',
        /* eye */
        '<ellipse cx="87" cy="41.5" rx="4.8" ry="5.1" fill="url(#sqEye)"/>',
        '<circle cx="88.7" cy="39.5" r="1.6" fill="#fff"/>',
        '<circle cx="85.3" cy="43.8" r=".9" fill="#fff" opacity=".65"/>',
        '<ellipse class="sq-lid" cx="87" cy="41.5" rx="5.4" ry="5.7" fill="url(#sqFur)"/>',
        /* nose and mouth */
        '<path d="M99 44 C103.5 43 106 45.5 104.5 48.5 C103 51 99 51 97.5 48.5 Z"',
        '   fill="#BE6E9C"/>',
        '<path d="M101 45.8 q1.5 .4 1.8 1.7" stroke="#8A4F73" stroke-width=".9"',
        '   fill="none" stroke-linecap="round"/>',
        '<path d="M99.5 51 q-2.2 3 -5.2 1.5" fill="none" stroke="#AE93A4"',
        '   stroke-width="1.3" stroke-linecap="round"/>',
        /* whiskers */
        '<path d="M100 45 C106 42 110 40 114 39 M100 48.5 C106 48.5 110 49 114 50"',
        '   stroke="#CDBCC9" stroke-width="1" stroke-linecap="round" fill="none"/>',
        '<path d="M99 51.5 C104 54 108 57 111 60 M96 44 C100 40 103 37 105 35"',
        '   stroke="#CDBCC9" stroke-width="1" stroke-linecap="round" fill="none"/>',
        /* chin fluff */
        '<path d="M92 58 q4 3.5 3 6.5" fill="none" stroke="#E6D8E2" stroke-width="1.7"',
        '   stroke-linecap="round"/>',
      '</g>',
    '</svg>'
  ].join("");

  /* ---------------------------- build ---------------------------- */
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
  sq.setAttribute("role", "button");
  sq.setAttribute("tabindex", "0");
  sq.setAttribute("aria-label", "সাইট ঘুরে দেখার সাহায্যকারী কাঠবিড়ালি");
  sq.innerHTML = SVG;

  var x = document.createElement("button");
  x.className = "sq-x";
  x.type = "button";
  x.textContent = "×";
  x.setAttribute("aria-label", "কাঠবিড়ালিটি সরিয়ে দিন");
  sq.appendChild(x);

  layer.appendChild(ring);
  layer.appendChild(say);
  layer.appendChild(sq);
  document.body.appendChild(layer);

  /* ---------------------------- movement ----------------------------
     The squirrel is placed with transform, so it can sit anywhere on
     the screen — beside a chip near the top just as easily as at the
     bottom. It travels in little hops instead of sliding.            */
  var VW = function () { return window.innerWidth; };
  var VH = function () { return window.innerHeight; };
  var size = function () { return sq.offsetWidth || 100; };

  var px = Math.round(VW() * 0.70);
  var py = Math.round(VH() - size() - 18);
  var raf = 0, moving = false, onDone = null;
  var fromX = px, fromY = py, toX = px, toY = py, t0 = 0, dur = 0, hops = 1;
  var bubbleSide = "right";   /* which side of the squirrel the bubble opens */

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function placeBubble() {
    if (say.dataset.on !== "1") return;
    var bw = say.offsetWidth, bh = say.offsetHeight, s = size();
    var left, tail;
    if (bubbleSide === "right") {          /* opens to the right of him */
      left = px + s / 2 - 26; tail = "left";
    } else {                                /* opens to the left */
      left = px + s / 2 + 26 - bw; tail = "right";
    }
    left = clamp(left, 8, VW() - bw - 8);

    var above = py - bh - 12;
    var under = py + s - 6;
    var top = above, below = "0";
    if (above < 8) { top = under; below = "1"; }

    /* on a narrow screen the bubble can land on the very thing he is
       pointing at — if so, put it on the other side of him */
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
    say.style.top  = Math.round(top) + "px";
  }

  function draw(arc) {
    sq.style.transform = "translate(" + Math.round(px) + "px," +
                         Math.round(py + (arc || 0)) + "px)";
    placeBubble();
  }
  draw(0);

  function face(dx) {
    if (Math.abs(dx) < 6) return;          /* a straight-up hop keeps facing */
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
    /* ease-in-out so he pushes off and lands softly */
    var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    px = fromX + (toX - fromX) * e;
    py = fromY + (toY - fromY) * e;
    var arc = -Math.abs(Math.sin(p * Math.PI * hops)) * 26;
    draw(arc);
    if (p < 1) { raf = requestAnimationFrame(tick); }
    else { draw(0); finish(); }
  }

  function hopTo(nx, ny, then) {
    var s = size();
    nx = clamp(Math.round(nx), 6, VW() - s - 6);
    ny = clamp(Math.round(ny), 54, VH() - s - 6);
    onDone = then || null;

    var dist = Math.sqrt((nx - px) * (nx - px) + (ny - py) * (ny - py));
    if (REDUCED || dist < 8) {
      face(nx - px); px = nx; py = ny; draw(0); finish(); return;
    }
    face(nx - px);
    fromX = px; fromY = py; toX = nx; toY = ny;
    hops = Math.max(1, Math.round(dist / 110));
    dur  = 380 + hops * 190;
    t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    moving = true;
    sq.dataset.hop = "1";
    if (!raf) raf = requestAnimationFrame(tick);
  }

  /* where to sit so the element stays fully visible: beside it if there
     is room, otherwise just under it. Never on top of it. */
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

  /* ---------------------------- tips ---------------------------- */
  var idx = -1, timer = 0, holding = false;
  var given = 0, done = false;   /* one gentle pass, then he stops nagging */
  var MAX_TIPS = 6;
  var lastUserScroll = 0, autoScroll = false;

  function clearTip() {
    say.dataset.on = "0";
    ring.dataset.on = "0";
    sq.dataset.point = "0";
  }

  function markRing(r) {
    ring.style.left   = (r.left - 6) + "px";
    ring.style.top    = (r.top - 6) + "px";
    ring.style.width  = (r.width + 12) + "px";
    ring.style.height = (r.height + 12) + "px";
    ring.dataset.on = "1";
  }

  function visible(r) {
    return r.width > 0 && r.height > 0 && r.top > 46 && r.bottom < VH() - 40;
  }

  /* If the thing is off screen he brings the page to it first — that is how
     he can visit the নারী/পুরুষ chips or a product card, not just the header.
     He never does this right after the visitor has scrolled themselves. */
  function showTip(tip, el) {
    var r = el.getBoundingClientRect();
    if (visible(r) || REDUCED || Date.now() - lastUserScroll < 4000) {
      markRing(r);
      hopAndPoint(tip, el, el.getBoundingClientRect());
      return;
    }
    ring.dataset.on = "0";      /* don't leave the old ring behind mid-scroll */
    autoScroll = true;
    try { el.scrollIntoView({ behavior: "smooth", block: "center" }); }
    catch (e) { el.scrollIntoView(); }
    window.setTimeout(function () {
      autoScroll = false;
      var rr = el.getBoundingClientRect();
      markRing(rr);
      hopAndPoint(tip, el, rr);
    }, 760);
  }

  function hopAndPoint(tip, el, r) {

    var spot = spotFor(r);
    var cx = r.left + r.width / 2;

    hopTo(spot.x, spot.y, function () {
      /* turn towards the thing, then raise the paw at it */
      if (spot.side === "right") sq.dataset.face = "left";
      else if (spot.side === "left") sq.dataset.face = "right";
      else face(cx - (px + size() / 2));

      sq.dataset.point = "1";
      bubbleSide = (sq.dataset.face === "left") ? "right" : "left";

      say.textContent = tip.say;
      say.style.left = "-9999px";          /* measure before placing */
      say.dataset.on = "1";
      placeBubble();
    });
  }

  function idle() {
    clearTip();
    var s = size();
    hopTo(40 + Math.random() * Math.max(40, VW() - s - 80),
          VH() - s - (14 + Math.random() * 40));
  }

  function nextTip() {
    if (holding) return;

    if (given >= MAX_TIPS) { done = true; idle(); return; }

    /* take the next thing on the list that is actually rendered */
    var tries = 0, tip = null, el = null;
    while (tries < TIPS.length) {
      idx = (idx + 1) % TIPS.length;
      tries++;
      var t = TIPS[idx];
      var e = document.querySelector(t.sel);
      if (!e) continue;
      var r = e.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) { tip = t; el = e; break; }
    }

    if (!tip) { idle(); return; }
    given++;
    showTip(tip, el);
  }

  function loop() {
    window.clearTimeout(timer);
    if (done) return;                 // quiet until tapped
    timer = window.setTimeout(function () {
      clearTip();
      window.setTimeout(function () { nextTip(); loop(); }, 520);
    }, 7200);
  }

  /* first tip shortly after the shop has drawn itself */
  window.setTimeout(function () { nextTip(); loop(); }, 2600);

  /* tapping him gives the next tip straight away */
  function poke(ev) {
    if (ev && ev.target === x) return;
    window.clearTimeout(timer);
    if (done) { done = false; given = 0; idx = -1; }   /* tap = run the tour again */
    clearTip();
    window.setTimeout(function () { nextTip(); loop(); }, 280);
  }
  sq.addEventListener("click", poke);
  sq.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); poke(); }
  });

  x.addEventListener("click", function (ev) {
    ev.stopPropagation();
    window.clearTimeout(timer);
    layer.hidden = true;
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
  });

  /* keep the ring — and the squirrel — glued to the element as the page moves */
  function follow() {
    if (ring.dataset.on !== "1" || idx < 0) return;
    var e = document.querySelector(TIPS[idx].sel);
    if (!e) { clearTip(); return; }
    var r = e.getBoundingClientRect();
    if (r.bottom < 40 || r.top > VH() - 20) { clearTip(); return; }
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
  window.addEventListener("scroll", function () {
    if (!autoScroll) lastUserScroll = Date.now();
    follow();
  }, { passive: true });
  window.addEventListener("resize", function () {
    var s = size();
    px = clamp(px, 6, VW() - s - 6);
    py = clamp(py, 54, VH() - s - 6);
    draw(0);
    follow();
  });

  /* stay out of the way while a sheet or dialog is open */
  function watchSheets() {
    var scrim = document.getElementById("scrim");
    var lb = document.getElementById("lightbox");
    var busy = (scrim && scrim.getAttribute("data-shown") === "true") ||
               (lb && !lb.hidden) ||
               document.body.style.overflow === "hidden";
    if (busy !== holding) {
      holding = busy;
      layer.style.opacity = busy ? "0" : "1";
      layer.style.transition = "opacity .25s ease";
      if (busy) clearTip();
    }
  }
  window.setInterval(watchSheets, 600);
})();
