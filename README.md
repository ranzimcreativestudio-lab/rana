# Dream of All

A small storefront for tops and dresses — men's and women's. Plain HTML, CSS and JavaScript with no build step and no dependencies, so it runs anywhere you can serve a folder.

**Live site:** https://halfseam-store.vercel.app/

---

## What's in it

- 16 products, 8 women's and 8 men's, filterable by gender and type
- Live search and four sort orders
- Product detail view with colour swatches, size picker and quantity
- Working cart — quantity steppers, remove, subtotal, free-delivery threshold, total
- Cart is saved in the browser, so a refresh doesn't lose it
- Every garment is a hand-drawn SVG illustration generated in code — no image files to host
- Light and dark themes, plus a manual toggle in the header
- Responsive from 360px up

> This is a front-end demo. Nothing is charged, no order is really placed, and there is no server. See [Going from demo to real shop](#going-from-demo-to-real-shop) below.

## Files

```
halfseam-store/
├── index.html                 the page markup
├── css/styles.css             all styling, driven by CSS custom properties
├── js/app.js                  products, garment illustrations, filtering, cart
├── .github/workflows/deploy.yml   publishes to GitHub Pages on every push
├── PUSH-FROM-YOUR-PC.md       step-by-step guide if you're new to Git
└── README.md
```

## Running it locally

Double-clicking `index.html` works, but the cart's saved state behaves better over a real server. If you have Python installed:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. With Node instead:

```bash
npx serve .
```

## Editing the shop

### Products

Everything lives in the `P` array near the top of `js/app.js`. One entry looks like this:

```js
{
  id: "w01",                    // must be unique
  name: "Linen Column Dress",
  gender: "women",              // "women" or "men"
  type: "Dress",                // filter chips are built from these automatically
  shape: "aline",               // which illustration to draw — see the list below
  price: 4850,
  oldPrice: 5400,               // optional — shows a struck-out price and a SALE badge
  tag: "New",                   // optional — "New", "Best seller", anything short
  fabric: "100% washed European linen, 190gsm",
  fit: "Straight through the body, falls below the knee",
  care: "Cold machine wash, line dry, warm iron",
  colors: [
    { n: "Bone", h: "#E9E3D6" },
    { n: "Clay", h: "#B98A70" }
  ]
}
```

Add, remove or reorder entries and the grid, the filter chips and the counter all update on their own.

### Garment shapes

`shape` picks the illustration. Available: `tee`, `henley`, `sweat`, `crop`, `shirt`, `polo`, `hoodie`, `blouse`, `cami`, `aline`, `wrap`, `slip`.

To invent a new one, add a line to the `SHAPES` object in `js/app.js`:

```js
vest: { sleeve: "none", neck: "v", hem: 196, hw: 38 }
```

- `sleeve` — `"none"`, `"short"` or `"long"`
- `neck` — `"crew"`, `"v"`, `"collar"`, `"polo"`, `"placket"`, `"hood"`, `"strap"`, `"wrap"`
- `hem` — how far down the garment reaches (roughly 150 for cropped, 200 for a top, 228 for a long dress)
- `hw` — half the hem width, so how wide it flares
- optional flags: `flare`, `rib`, `pocket`, `pouch`, `belt`

### Colours and type

The palette is a set of CSS custom properties at the top of `css/styles.css`. `:root` holds the light theme; the two blocks below it hold the dark theme. Change `--accent` and the buttons, badges and focus rings all follow.

Fonts are loaded from Google Fonts in `index.html` — Archivo for headings, Karla for body text, IBM Plex Mono for prices.

### Currency

Prices are in Bangladeshi taka. To change it, edit the `money()` function in `js/app.js`:

```js
function money(n){ return "৳" + n.toLocaleString("en-US"); }
```

Delivery is set just above `shipFor()` in `js/app.js`:

```js
var FREE_OVER=500, SHIP_LOCAL=80, SHIP_OUTSIDE=120;
```

`FREE_OVER` is the free-delivery threshold, `SHIP_LOCAL` the rate inside Khulna (where orders ship from) and `SHIP_OUTSIDE` the rate for every other district. `isLocal()` right below decides which one applies — it matches "khulna" or "খুলনা" in the district box.

## Deploying

The included workflow publishes the site to GitHub Pages every time you push to `main`. After your first push, go to **Settings → Pages** in your repository and set **Source** to **GitHub Actions**. That's the only setup step.

If you've never pushed to GitHub before, [PUSH-FROM-YOUR-PC.md](PUSH-FROM-YOUR-PC.md) walks through it from scratch.

Because it's a folder of static files, it also drops straight onto Netlify, Vercel, Cloudflare Pages, or any shared host's `public_html` — no build command, no output directory.

## Going from demo to real shop

To take actual orders you need three things this repo doesn't have:

1. **A backend** to receive orders, because prices sitting in JavaScript can be edited by anyone in their browser. Totals must be recalculated on a server you control.
2. **A payment provider.** In Bangladesh that usually means SSLCommerz, aamarPay, or bKash/Nagad merchant APIs; internationally, Stripe or PayPal.
3. **Somewhere to store orders and stock** — a database, or a hosted platform.

A common middle path is keeping this design as the front end and letting a headless commerce service (Shopify Storefront API, Snipcart, Medusa) handle carts, payment and orders. The cart logic in `app.js` is deliberately small and self-contained so it can be swapped for a provider's SDK.

## Licence

MIT — see [LICENSE](LICENSE). The code is yours to use commercially. Rename the brand to your own before you launch; "Dream of All" is the brand name — change it in index.html if you rebrand.
