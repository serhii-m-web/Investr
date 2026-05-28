# Investr

Marketing landing page for **Investr** — a mobile-first investment marketplace that connects founders and investors through curated deal flow, video pitches, and direct messaging.

The site is built as a static single-page layout assembled from Handlebars sections, with TypeScript for interactivity and SCSS for styling.

---

## About the product

Investr helps:

- **Founders** reach the right investors without cold outreach and broken warm-intro chains.
- **Investors** discover stage- and thesis-matched pitches in a swipe-style feed with video-first cards.

The landing page presents the value proposition, social proof, feature walkthroughs, waitlist signup, and FAQ.

### Page sections

| Section | Purpose |
|--------|---------|
| Hero | Main headline, CTA, app preview |
| Percent cards | Market statistics (two blocks) |
| Reviews | Investor testimonials carousel (Swiper) |
| Reverse cards | Pain points for founders vs investors |
| Changes | Tabbed feature sliders for investors / founders |
| Running | Step-by-step onboarding flow (tabbed) |
| Different | Product differentiators carousel |
| Form | Waitlist signup (role, name, email) |
| FAQ | Accessible accordion |

---

## Tech stack

- [Vite](https://vitejs.dev/) 4 + TypeScript
- [Handlebars](https://handlebarsjs.com/) via `vite-plugin-handlebars` (partials & sections)
- SCSS (BEM-style layout and component styles)
- [Swiper](https://swiperjs.com/) 12 — carousels
- [sharp](https://sharp.pixelplumbing.com/) — automatic WebP conversion for images in `public/`

---

## Features (development)

- **TypeScript** — typed config, scripts, and client code (`src/js`)
- **Reusable tabs** — `src/js/components/tabs.ts` + `src/styles/components/_tabs.scss`
- **`picture` helper** — WebP + fallback `<picture>` in templates
- **WebP pipeline** — `scripts/convertToWebp.ts` (dev/build + optional watch)
- **ESLint + Prettier** — lint and format for `.ts` files
- **GitHub Pages ready** — `base: './'` in Vite config

---

## Requirements

- **Node.js** 18+ (LTS recommended)
- npm

---

## Installation and usage

```sh
npm install
npm run dev
```

Dev server uses `src` as root, opens the browser, and hot-reloads templates, sections, styles, and scripts.

```sh
npm run build    # output → dist/
npm run preview  # preview production build
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview `dist/` locally |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | ESLint for `.ts` files |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (CI) |
| `npm run webp` | One-off WebP conversion |
| `npm run webp:watch` | Watch `public/` for new images |

Disable WebP on build/CI:

```sh
VITE_WEBP_CONVERT=false npm run build
```

---

## Project structure

```text
.
├─ public/                 # Static assets (images, icons, favicon)
├─ scripts/
│  └─ convertToWebp.ts      # PNG/JPEG → WebP in public/
├─ src/
│  ├─ index.html            # Main HTML entry
│  ├─ sections/             # Page blocks (Handlebars partials)
│  ├─ templates/            # Header, footer
│  ├─ js/
│  │  ├─ main.ts            # Swiper, tabs, FAQ accordion
│  │  └─ components/
│  │     └─ tabs.ts         # Reusable tab component
│  └─ styles/
│     ├─ base/              # Reset, variables, typography, forms
│     ├─ components/      # Shared UI (tabs)
│     ├─ layout/            # Section styles
│     └─ main.scss
├─ getHTMLFileNames.ts      # Multi-page HTML entries (if added)
├─ vite.config.ts
├─ tsconfig.json
└─ package.json
```

---

## Handlebars helpers

Configured in `vite.config.ts`:

- **`picture`** — `<picture>` with WebP source and fallback `<img>`
- **`array`** / **`object`** — utility helpers for template data

Example:

```hbs
{{{picture "/images/hero.png" alt="Investr app preview" class="hero__image"}}}
```

---

## Deploying to GitHub Pages

`vite.config.ts` uses `base: './'` for subdirectory hosting (e.g. `https://<user>.github.io/<repo>/`).

1. `npm run build`
2. Deploy contents of `dist/` (GitHub Actions workflow in `.github/workflows/static.yml` or manual `gh-pages` branch)

---

## License

MIT
