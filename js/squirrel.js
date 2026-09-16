/* ============================================================
   ProwdFashion — the white squirrel guide  (কাঠবিড়ালি)
   ------------------------------------------------------------
   A small white squirrel walks along the bottom of the page.
   Every so often it stops under one of the important parts of
   the shop, lifts a paw at it, and says what it is in Bengali.

   Self-contained on purpose: it injects its own CSS and markup,
   so the only change needed elsewhere is one <script> tag in
   index.html. Nothing here touches the shop's own state.

   - Never covers a click: the whole layer is pointer-events:none
     except the squirrel itself and its close button.
   - Respects prefers-reduced-motion (no walking, tips still show).
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
     sel   : what to point at (first match wins; skipped if missing)
     say   : the line in the speech bubble
     where : "top" pins the highlight ring to a header item          */
  var TIPS = [
    { sel: "#q",           say: "এখানে লিখে পছন্দের পোশাক খুঁজুন।" },
    { sel: "#genderChips", say: "নারী না পুরুষ — বেছে নিন এখান থেকে।" },
    { sel: "#typeChips",   say: "টি-শার্ট, পোলো… ধরন অনুযায়ী দেখুন।" },
    { sel: "#grid .card",  say: "ছবিতে ক্লিক করলে সাইজ, মাপ আর বিস্তারিত।" },
    { sel: "#sort",        say: "দাম কম-বেশি অনুযায়ী সাজিয়ে নিন।" },
    { sel: "#waTalk",      say: "যেকোনো প্রশ্ন? WhatsApp-এ সরাসরি লিখুন।" },
    { sel: "#cartBtn",     say: "পছন্দ হলে ব্যাগে রাখুন, এখানে জমা থাকবে।" },
    { sel: "#themeBtn",    say: "রাতে চোখ আরাম চাইলে এই বোতামটা চাপুন।" }
  ];

  /* ---------------------------- styles ---------------------------- */
  var CSS = [
    '.sq-layer{position:fixed;inset:0;z-index:70;pointer-events:none;}',
    '.sq-layer[hidden]{display:none!important;}',

    /* the squirrel */
    '.sq{position:fixed;bottom:14px;left:0;width:96px;height:96px;',
    '  pointer-events:auto;cursor:pointer;',
    '  transition:transform .05s linear;will-change:transform;}',
    '.sq svg{width:100%;height:100%;overflow:visible;display:block;',
    '  filter:drop-shadow(0 6px 14px rgba(35,10,26,.28));}',
    '.sq[data-face="left"] svg{transform:scaleX(-1);}',

    /* body parts that move */
    '.sq .sq-tail{transform-origin:64px 56px;animation:sq-tail 1.6s ease-in-out infinite;}',
    '.sq .sq-legF{transform-origin:40px 74px;}',
    '.sq .sq-legB{transform-origin:56px 74px;}',
    '.sq[data-walk="1"] .sq-legF{animation:sq-legF .42s linear infinite;}',
    '.sq[data-walk="1"] .sq-legB{animation:sq-legB .42s linear infinite;}',
    '.sq[data-walk="1"]{animation:sq-bob .42s ease-in-out infinite;}',
    '.sq .sq-arm{transform-origin:33px 58px;transition:transform .45s cubic-bezier(.34,1.56,.64,1);}',
    '.sq[data-point="1"] .sq-arm{transform:rotate(-62deg);}',
    '.sq .sq-lid{transform-origin:29px 36px;animation:sq-blink 4.2s infinite;}',

    '@keyframes sq-tail{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(9deg)}}',
    '@keyframes sq-legF{0%{transform:rotate(16deg)}50%{transform:rotate(-16deg)}100%{transform:rotate(16deg)}}',
    '@keyframes sq-legB{0%{transform:rotate(-16deg)}50%{transform:rotate(16deg)}100%{transform:rotate(-16deg)}}',
    '@keyframes sq-bob{0%,100%{margin-bottom:0}50%{margin-bottom:3px}}',
    '@keyframes sq-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}',

    /* speech bubble */
    '.sq-say{position:fixed;max-width:250px;padding:11px 14px;border-radius:14px;',
    '  background:var(--surface,#fff);color:var(--ink,#150F13);',
    '  border:1.5px solid var(--accent,#C20B74);',
    '  box-shadow:0 14px 34px -14px rgba(35,10,26,.45);',
    '  font-family:"Hind Siliguri",system-ui,sans-serif;font-size:14.5px;line-height:1.65;',
    '  opacity:0;transform:translateY(6px) scale(.96);transform-origin:bottom left;',
    '  transition:opacity .25s ease,transform .25s cubic-bezier(.34,1.56,.64,1);}',
    '.sq-say[data-on="1"]{opacity:1;transform:translateY(0) scale(1);}',
    '.sq-say::after{content:"";position:absolute;bottom:-8px;left:22px;width:13px;height:13px;',
    '  background:var(--surface,#fff);border-right:1.5px solid var(--accent,#C20B74);',
    '  border-bottom:1.5px solid var(--accent,#C20B74);transform:rotate(45deg);}',
    '.sq-say[data-tail="right"]::after{left:auto;right:22px;}',

    /* the ring drawn around whatever it points at */
    '.sq-ring{position:fixed;border:2.5px dashed var(--accent,#C20B74);border-radius:12px;',
    '  opacity:0;transition:opacity .3s ease,top .45s ease,left .45s ease,',
    '  width .45s ease,height .45s ease;}',
    '.sq-ring[data-on="1"]{opacity:.9;animation:sq-pulse 1.5s ease-in-out infinite;}',
    '@keyframes sq-pulse{0%,100%{box-shadow:0 0 0 0 rgba(194,11,116,.30)}',
    '  50%{box-shadow:0 0 0 7px rgba(194,11,116,0)}}',

    /* dismiss */
    '.sq-x{position:absolute;top:6px;right:0;width:21px;height:21px;border-radius:50%;',
    '  opacity:0;transition:opacity .2s ease;',
    '  border:1.5px solid var(--line-2,#D2BBCB);background:var(--surface,#fff);',
    '  color:var(--ink-2,#665A61);font-size:13px;line-height:1;cursor:pointer;',
    '  pointer-events:auto;display:flex;align-items:center;justify-content:center;padding:0;}',
    '.sq-x:hover{border-color:var(--accent,#C20B74);color:var(--accent,#C20B74);}',
    '.sq:hover .sq-x,.sq:focus-within .sq-x,.sq-x:focus{opacity:1;}',

    /* small screens: smaller squirrel, narrower bubble */
    '@media (max-width:620px){',
    '  .sq{width:68px;height:68px;bottom:10px;}',
    '  .sq-say{max-width:200px;font-size:13.5px;padding:9px 12px;}',
    '}',
    /* no room at all, or the visitor asked for less motion */
    '@media (max-width:360px){.sq-layer{display:none;}}',
    '@media (prefers-reduced-motion:reduce){',
    '  .sq,.sq .sq-tail,.sq .sq-legF,.sq .sq-legB,.sq .sq-lid,.sq-ring[data-on="1"]{animation:none!important;}',
    '  .sq{transition:none;}',
    '}'
  ].join("");

  /* ---------------------------- the squirrel ---------------------------- */
  /* Drawn side-on, facing right: bushy tail behind, one paw free to point. */
  var SVG = [
    '<svg viewBox="0 0 96 96" aria-hidden="true">',
      '<defs>',
        '<linearGradient id="sqFur" x1="0" y1="0" x2="0" y2="1">',
          '<stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EFE7EC"/>',
        '</linearGradient>',
      '</defs>',

      /* tail — behind the body */
      '<g class="sq-tail">',
        '<path d="M62 60 C84 60 92 40 80 24 C74 16 62 16 58 24 C66 22 74 28 74 38',
        '         C74 50 66 54 60 54 Z" fill="url(#sqFur)" stroke="#D8CBD3" stroke-width="1.6"',
        '         stroke-linejoin="round"/>',
      '</g>',

      /* back leg */
      '<g class="sq-legB"><path d="M53 65 C57 70 59 75 58 79 C57 82 50 82 49 79 C48 74 50 69 53 65 Z"',
      '      fill="#F3ECF0" stroke="#D8CBD3" stroke-width="1.4" stroke-linejoin="round"/></g>',

      /* body */
      '<path d="M30 46 C22 52 22 68 32 74 C40 79 58 79 64 72 C70 65 68 52 60 46 Z"',
      '      fill="url(#sqFur)" stroke="#D8CBD3" stroke-width="1.7" stroke-linejoin="round"/>',

      /* front leg */
      '<g class="sq-legF"><path d="M35 65 C39 70 41 75 40 79 C39 82 32 82 31 79 C30 74 32 69 35 65 Z"',
      '      fill="#FFFFFF" stroke="#D8CBD3" stroke-width="1.4" stroke-linejoin="round"/></g>',

      /* pointing arm */
      '<g class="sq-arm">',
        '<path d="M33 58 C29 60 26 64 26 68" fill="none" stroke="#F3ECF0" stroke-width="7"',
        '      stroke-linecap="round"/>',
        '<path d="M33 58 C29 60 26 64 26 68" fill="none" stroke="#D8CBD3" stroke-width="1.2"',
        '      stroke-linecap="round" opacity=".5"/>',
        '<circle cx="26" cy="69" r="4" fill="#FFFFFF" stroke="#D8CBD3" stroke-width="1.3"/>',
      '</g>',

      /* head */
      '<path d="M22 34 C14 40 14 52 22 57 C30 62 42 60 45 52 C48 43 40 32 30 31 Z"',
      '      fill="url(#sqFur)" stroke="#D8CBD3" stroke-width="1.7" stroke-linejoin="round"/>',
      /* ear */
      '<path d="M26 31 C24 23 30 20 33 26 C35 30 33 33 30 33 Z" fill="#FFFFFF"',
      '      stroke="#D8CBD3" stroke-width="1.5" stroke-linejoin="round"/>',
      '<path d="M27.5 30 C26.5 26 29 24.5 30.5 27.5" fill="#F6CFE4"/>',

      /* face */
      '<circle cx="29" cy="43" r="3.3" fill="#2A1B24"/>',
      '<circle cx="30.1" cy="41.9" r="1.1" fill="#fff"/>',
      '<rect class="sq-lid" x="25.7" y="39.7" width="6.6" height="6.6" rx="3.3" fill="url(#sqFur)"/>',
      '<circle cx="17.5" cy="48.5" r="2.1" fill="#C77BA4"/>',
      '<path d="M20 52 q3 2.6 6 .4" fill="none" stroke="#A98FA0" stroke-width="1.3" stroke-linecap="round"/>',
      /* whiskers */
      '<path d="M16 46 L8 43 M16 49.5 L7 49.5 M16.5 52 L9 55" stroke="#CBBCC6"',
      '      stroke-width="1.1" stroke-linecap="round" fill="none"/>',
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

  /* ---------------------------- movement ---------------------------- */
  var W = function () { return window.innerWidth; };
  var size = function () { return sq.offsetWidth || 96; };

  var posX = Math.round(W() * 0.12);      // where he is now
  var goX  = posX;                        // where he is heading
  var raf = 0;
  var onArrive = null;

  /* the bubble rides along with him, so it is never left behind mid-walk */
  function placeBubble() {
    if (say.dataset.on !== "1") return;
    var bw = say.offsetWidth, bh = say.offsetHeight;
    var left = posX + size() / 2 - 26;
    var tail = "left";
    if (left + bw > W() - 10) {           // would run off the right edge
      left = posX + size() / 2 + 26 - bw;
      tail = "right";
    }
    say.dataset.tail = tail;
    say.style.left = Math.max(10, Math.min(W() - bw - 10, left)) + "px";
    say.style.top  = (window.innerHeight - (sq.offsetHeight + 22) - bh) + "px";
  }

  function place() {
    sq.style.transform = "translateX(" + posX + "px)";
    placeBubble();
  }
  place();

  function face(dir) { sq.dataset.face = dir < 0 ? "left" : "right"; }

  function arrived() {
    sq.dataset.walk = "0";
    raf = 0;
    var cb = onArrive; onArrive = null;
    if (cb) cb();
  }

  function step() {
    var dx = goX - posX;
    if (Math.abs(dx) < 2) { posX = goX; place(); arrived(); return; }
    /* quick over long gaps, easing down as he gets close */
    var speed = Math.min(11, Math.max(2.2, Math.abs(dx) / 11));
    posX += dx > 0 ? speed : -speed;
    place();
    raf = requestAnimationFrame(step);
  }

  function walkTo(target, then) {
    var max = W() - size() - 8;
    goX = Math.max(8, Math.min(max, Math.round(target)));
    onArrive = then || null;
    if (Math.abs(goX - posX) < 2 || REDUCED) {
      posX = goX; place(); arrived(); return;
    }
    face(goX - posX);
    sq.dataset.walk = "1";
    if (!raf) raf = requestAnimationFrame(step);
  }

  /* ---------------------------- tips ---------------------------- */
  var idx = -1, timer = 0, holding = false;
  var given = 0, done = false;   /* one gentle pass, then he stops nagging */
  var MAX_TIPS = 6;              /* about what fits on one screen — then quiet */

  function clearTip() {
    say.dataset.on = "0";
    ring.dataset.on = "0";
    sq.dataset.point = "0";
  }

  function showTip(tip, el) {
    var r = el.getBoundingClientRect();

    /* ring around the element */
    ring.style.left   = (r.left - 6) + "px";
    ring.style.top    = (r.top - 6) + "px";
    ring.style.width  = (r.width + 12) + "px";
    ring.style.height = (r.height + 12) + "px";
    ring.dataset.on = "1";

    /* walk under it — only once he is there does he point and speak */
    var want = r.left + r.width / 2 - size() / 2;
    walkTo(want, function () {
      sq.dataset.point = "1";
      say.textContent = tip.say;
      say.style.left = "-9999px";           // measure before placing
      say.dataset.on = "1";
      placeBubble();
    });
  }

  function nextTip() {
    if (holding) return;

    /* tour finished — he just potters about until someone taps him */
    if (given >= MAX_TIPS) {
      done = true;
      clearTip();
      walkTo(40 + Math.random() * (W() - size() - 80));
      return;
    }

    /* only point at things actually on screen — no surprise scrolling */
    var tries = 0, tip = null, el = null;
    while (tries < TIPS.length) {
      idx = (idx + 1) % TIPS.length;
      tries++;
      var t = TIPS[idx];
      var e = document.querySelector(t.sel);
      if (!e) continue;
      var r = e.getBoundingClientRect();
      var onScreen = r.width > 0 && r.height > 0 &&
                     r.top > 40 && r.bottom < window.innerHeight - 110;
      if (onScreen) { tip = t; el = e; break; }
    }

    if (!tip) {                 // nothing visible right now — just stroll
      clearTip();
      walkTo(40 + Math.random() * (W() - size() - 80));
      return;
    }
    given++;
    showTip(tip, el);
  }

  function loop() {
    window.clearTimeout(timer);
    if (done) return;                 // quiet until tapped
    timer = window.setTimeout(function () {
      clearTip();
      window.setTimeout(function () { nextTip(); loop(); }, 500);
    }, 7000);
  }

  /* first tip shortly after the shop has drawn itself */
  window.setTimeout(function () { nextTip(); loop(); }, 2600);

  /* tapping him gives the next tip straight away */
  function poke(ev) {
    if (ev && ev.target === x) return;
    window.clearTimeout(timer);
    if (done) { done = false; given = 0; idx = -1; }   /* tap = run the tour again */
    clearTip();
    window.setTimeout(function () { nextTip(); loop(); }, 260);
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

  /* keep the ring glued to its element while the page moves */
  function follow() {
    if (ring.dataset.on !== "1" || idx < 0) return;
    var e = document.querySelector(TIPS[idx].sel);
    if (!e) { clearTip(); return; }
    var r = e.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) { clearTip(); return; }
    ring.style.left = (r.left - 6) + "px";
    ring.style.top  = (r.top - 6) + "px";
  }
  window.addEventListener("scroll", follow, { passive: true });
  window.addEventListener("resize", function () {
    walkTo(posX);            // re-clamp inside the new width
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
