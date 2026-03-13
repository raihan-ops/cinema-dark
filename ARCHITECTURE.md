# CinemaDark — Architecture Plan

## Tech Stack

| Concern        | Tool                        |
| -------------- | --------------------------- |
| Framework      | React 19 + JavaScript (JSX) |
| Build Tool     | Vite                        |
| Routing        | React Router v7             |
| UI Components  | shadcn/ui                   |
| Styling        | Tailwind CSS v4             |
| Server State   | TanStack Query v5           |
| Client State   | Zustand v5                  |
| Auth           | Firebase Authentication     |
| Persistence    | Firestore (per-user)        |
| Movie API      | TMDB API                    |
| Animations     | Framer Motion               |

> No TypeScript. All files use `.jsx` / `.js`.

---

## Folder Structure

```
src/
├── api/                        # Raw API call functions
│   ├── tmdb.js                 # TMDB fetch helpers
│   └── firebase.js             # Firestore read/write helpers
│
├── components/                 # Shared, reusable UI
│   ├── ui/                     # shadcn/ui auto-generated components
│   ├── MovieCard.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   └── PageTransition.jsx
│
├── features/                   # Feature-scoped logic + UI
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── useAuthForm.js
│   ├── search/
│   │   ├── SearchPage.jsx
│   │   └── useMovieSearch.js   # React Query hook
│   ├── movie/
│   │   ├── MovieDetailPage.jsx
│   │   └── useMovieDetail.js   # React Query hook
│   └── watchlist/
│       ├── WatchlistPage.jsx
│       └── useWatchlist.js
│
├── store/                      # Zustand stores
│   ├── authStore.js            # user, isLoggedIn, login/logout actions
│   └── watchlistStore.js       # movies[], add/remove, Firestore sync
│
├── hooks/                      # Generic shared custom hooks
│   └── useDebounce.js
│
├── lib/                        # Config + utilities
│   ├── firebase.js             # Firebase app init
│   ├── queryClient.js          # TanStack Query client config
│   └── utils.js                # cn() and other helpers (from shadcn)
│
├── router/
│   └── index.jsx               # All routes + ProtectedRoute usage
│
├── App.jsx
└── main.jsx
```

---

## State Management Strategy

```
┌─────────────────────────────────────┐
│           Server State              │
│         TanStack Query              │
│  - Movie search results             │
│  - Movie detail data                │
│  - Cached & background-refetched   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│           Client State              │
│             Zustand                 │
│  - Auth (user object, uid)          │
│  - Watchlist (movies array)         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│           Persistence               │
│  Firebase Auth   →   authStore      │
│  Firestore       →   watchlistStore │
└─────────────────────────────────────┘
```

---

## Routing Map

```
/               →  redirect to /search
/login          →  LoginPage         (public)
/signup         →  SignupPage        (public)
/search         →  SearchPage        (public)
/movie/:id      →  MovieDetailPage   (public)
/watchlist      →  WatchlistPage     (protected — requires auth)
*               →  404 NotFoundPage
```

`ProtectedRoute` wraps `/watchlist`. Unauthenticated users are redirected to `/login`.

---

## Data Flow

```
User types in SearchBar
  → useDebounce (300ms)
    → useMovieSearch (React Query)
      → tmdb.searchMovies(query)
        → renders MovieCard grid

User clicks "+ Watchlist"
  → watchlistStore.addMovie(movie)
    → Firestore update: users/{uid}/watchlist
      → optimistic UI update via Zustand

User logs in
  → Firebase signInWithEmailAndPassword
    → authStore.setUser(user)
      → watchlistStore.loadFromFirestore(uid)
        → Zustand hydrated, watchlist ready
```

---

## Component Design Principles

- **`MovieCard`** — used in both Search and Watchlist pages. Accepts a `variant` prop
  (`"search"` | `"watchlist"`) to conditionally render "+ Watchlist" vs "Remove" button.
- **`ProtectedRoute`** — reads from `authStore`, redirects to `/login` if not authenticated.
- **`PageTransition`** — Framer Motion `AnimatePresence` wrapper applied at the router level
  for smooth page-to-page transitions.
- **`Navbar`** — reads `authStore` reactively; shows Watchlist link only when logged in,
  toggles Login / Logout accordingly.

---

## shadcn/ui Usage

shadcn/ui components are copied into `src/components/ui/` and owned by the project.
They are styled via Tailwind and can be customized freely to match the Figma design.

Planned shadcn components:
- `Button`
- `Input`
- `Card`
- `Badge`
- `Skeleton` (loading states)
- `Dialog` (modals if needed)
- `Toast` / `Sonner` (notifications)
- `Avatar`
- `Separator`

---

## Key Architectural Decisions

| Decision                          | Rationale                                              |
| --------------------------------- | ------------------------------------------------------ |
| React 19 + JavaScript (no TS)     | Faster iteration, no type overhead for a prototype     |
| Feature folders over type folders | Co-locates logic with its UI, scales cleanly           |
| TanStack Query for API data       | Caching, loading/error states, deduplication built-in  |
| Zustand for auth + watchlist      | Lightweight, no boilerplate, easy Firebase sync        |
| Firestore over localStorage       | Real per-user persistence, multi-device ready          |
| shadcn/ui                         | Own the components fully, tailored to Figma design     |
| Framer Motion                     | Page transitions, hover effects, micro-interactions    |

---

## Implementation Phases

```
Phase 1 — Scaffold
  Vite + React 19 setup, Tailwind v4, shadcn init,
  React Router v7, Firebase init, folder structure

Phase 2 — Auth
  Firebase Auth integration, authStore (Zustand),
  Login + Signup pages, ProtectedRoute

Phase 3 — Search
  TMDB API helpers, SearchPage, MovieCard component,
  useMovieSearch (React Query), debounce, loading + error states

Phase 4 — Movie Detail
  MovieDetailPage, full metadata display (poster, genres,
  plot, rating, release date), add/remove watchlist button

Phase 5 — Watchlist
  WatchlistPage, Firestore read/write, watchlistStore sync,
  per-user data isolation

Phase 6 — Polish
  Framer Motion page transitions + microinteractions,
  responsive layout (mobile-first), loading skeletons,
  empty states, error boundaries, final Figma alignment
```

---

## Design Tokens (from Figma Style Guide)

### Color Palette

#### Primary — Rose
| Token              | Hex       | Usage                        |
| ------------------ | --------- | ---------------------------- |
| `rose-base`        | `#E31048` | Primary buttons, active CTA  |
| `rose-deep`        | `#BE1230` | Hover state on primary       |
| `rose-soft`        | `#FB7186` | Active / pressed state       |

#### Neutrals & Surfaces
| Token              | Hex       | Usage                              |
| ------------------ | --------- | ---------------------------------- |
| `black`            | `#0F0708` | Page background                    |
| `surface`          | `#1A1112` | Card / modal background            |
| `border`           | `#2D1A1E` | Dividers, input borders, card edge |
| `text-primary`     | `#FAFAFA` | Headings, body text                |
| `text-secondary`   | `#A1A1AA` | Muted labels, placeholders         |

#### Semantic Colors
| Token       | Hex       | Usage                     |
| ----------- | --------- | ------------------------- |
| `success`   | `#22C55E` | Success toasts, confirmed |
| `warning`   | `#F59E0B` | Warnings, alerts          |
| `error`     | `#E31048` | Error states (reuses rose)|

---

### Typography

**Font Family:** `Inter` (Google Fonts)

| Scale       | Size  | Weight       | Line Height | Usage                  |
| ----------- | ----- | ------------ | ----------- | ---------------------- |
| Display     | 48px  | Bold (700)   | 1.0         | Hero titles            |
| Heading 1   | 32px  | Semibold (600) | 1.2       | Page headings          |
| Heading 2   | 24px  | Semibold (600) | 1.3       | Section headings       |
| Body Base   | 16px  | Regular (400)  | 1.5       | Paragraphs, card text  |
| Small       | 14px  | Regular (400)  | 1.5       | Labels, metadata       |
| Caption     | 12px  | Regular (400)  | 1.4       | Tags, badges, footnotes|

---

### Spacing Scale (8px grid)

| Token  | Value | Usage                     |
| ------ | ----- | ------------------------- |
| `xs`   | 4px   | Tight gaps (icon padding) |
| `sm`   | 8px   | Micro spacing             |
| `md`   | 16px  | Base gap (card internals) |
| `lg`   | 24px  | Section padding           |
| `xl`   | 32px  | Content blocks            |
| `2xl`  | 48px  | Page sections             |
| `3xl`  | 64px  | Hero / large gaps         |

---

### Border Radius

| Token   | Value  | Usage                          |
| ------- | ------ | ------------------------------ |
| `sm`    | 4px    | Badges, small tags             |
| `md`    | 8px    | Inputs, small cards            |
| `lg`    | 12px   | Movie cards                    |
| `xl`    | 16px   | Modals, panels                 |
| `full`  | 9999px | Pills, avatar circles, chips   |

---

### Buttons

| Variant     | Background  | Text     | Border         | Hover           |
| ----------- | ----------- | -------- | -------------- | --------------- |
| Primary     | `#E31048`   | `#FAFAFA`| none           | `#BE1230`       |
| Secondary   | `#1A1112`   | `#FAFAFA`| `1px #2D1A1E`  | border `#E31048`|
| Ghost       | transparent | `#FAFAFA`| none           | bg `#1A1112`    |
| Icon        | `#E31048`   | —        | none           | `#BE1230`       |

Border radius on all buttons: `8px`. Padding: `12px 20px`.

---

### Inputs

| State     | Background | Border          | Text      |
| --------- | ---------- | --------------- | --------- |
| Default   | `#1A1112`  | `1px #2D1A1E`   | `#FAFAFA` |
| Focused   | `#1A1112`  | `1px #E31048`   | `#FAFAFA` |
| Error     | `#1A1112`  | `1px #E31048`   | `#FAFAFA` |
| Disabled  | `#0F0708`  | `1px #2D1A1E`   | `#A1A1AA` |

Placeholder color: `#A1A1AA`. Border radius: `8px`. Height: `48px`.

---

### Movie Card

- Background: `#1A1112`
- Border: `1px solid #2D1A1E`
- Border radius: `12px`
- Hover: border color → `#E31048`, slight `translateY(-4px)` lift
- Poster aspect ratio: `2/3`
- Padding (content area): `16px`

---

### Shadows

```
card-shadow:  0 4px 24px rgba(15, 7, 8, 0.6)
glow-rose:    0 0 20px rgba(227, 16, 72, 0.25)   /* used on hover/active cards */
```

---

### Tailwind Config Mapping (`tailwind.config.js`)

```js
theme: {
  extend: {
    colors: {
      rose: {
        base:  '#E31048',
        deep:  '#BE1230',
        soft:  '#FB7186',
      },
      surface: {
        black:   '#0F0708',
        card:    '#1A1112',
        border:  '#2D1A1E',
      },
      text: {
        primary:   '#FAFAFA',
        secondary: '#A1A1AA',
      },
      success: '#22C55E',
      warning: '#F59E0B',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    fontSize: {
      display: ['48px', { lineHeight: '1.0', fontWeight: '700' }],
      h1:      ['32px', { lineHeight: '1.2', fontWeight: '600' }],
      h2:      ['24px', { lineHeight: '1.3', fontWeight: '600' }],
      body:    ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      small:   ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
    },
    borderRadius: {
      sm:   '4px',
      md:   '8px',
      lg:   '12px',
      xl:   '16px',
      full: '9999px',
    },
    boxShadow: {
      card:  '0 4px 24px rgba(15, 7, 8, 0.6)',
      glow:  '0 0 20px rgba(227, 16, 72, 0.25)',
    },
    spacing: {
      xs:  '4px',
      sm:  '8px',
      md:  '16px',
      lg:  '24px',
      xl:  '32px',
      '2xl': '48px',
      '3xl': '64px',
    },
  },
},
```

---

## Environment Variables

```
VITE_TMDB_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

All secrets live in `.env.local` and are never committed to Git.

---

## Page-by-Page Design Breakdown (from Figma)

> Extracted via Figma API. All measurements are exact from the design file.
> Desktop breakpoint: 1280px. Mobile breakpoint: 390px.

---

### Shared — Navbar

**Desktop (1280x73) & Mobile (390x69)**
- Background: `#211115`
- Logo: Film icon (rose `#E21D48`) + text **"CinemaDark"** — 20px / 800 weight / `#F1F5F9`
- Desktop nav links: **Search**, **Watchlist**, **Logout** — 14px / 600 / `#CBD5E1` — horizontal row
- Unauthenticated state: nav shows only **"Sign Up"** button (rose, 84x36, 14px / 700)
- Mobile: hamburger menu → slide-in nav drawer

---

### Shared — Footer

**Desktop (1280x105) & Mobile (390x95)**
- Background: `#211115`
- Left: Social icon links (3 icons, 20px, `#F1F5F9`)
- Center: Copyright — "© 2024 CinemaDark. All rights reserved." — 12px–14px / `#6B7280`
- Right links: **Privacy Policy** | **Terms of Service** | **Contact Support** — 12px–14px / `#94A3B8`

---

### Page 1 — Login (`/login`)

**Layout:** Full-bleed cinematic background image + dark gradient overlay. Centered glass card.

```
┌─────────────────────────────────────────┐
│  NAVBAR  (Logo + "Sign Up" button)      │
├─────────────────────────────────────────┤
│                                         │
│  [ Background Image + Gradient ]        │
│                                         │
│    ┌──────────────────────────────┐     │
│    │  Overlay Card (blur)         │     │
│    │  ─────────────────────────  │     │
│    │  "Welcome Back"  24px/900   │     │
│    │  "Your cinematic journey…"  │     │
│    │                              │     │
│    │  [ Email Address         ]  │     │
│    │  [ Password          👁  ]  │     │
│    │  ☐ Remember me for 30 days  │     │
│    │                              │     │
│    │  [    Sign In   →   ]        │     │
│    │                              │     │
│    │  ─────────── or ──────────  │     │
│    │  Don't have an account?      │     │
│    │  Create Account              │     │
│    │                              │     │
│    │  [ G ] [ 𝕏 ] [ ⬛ ]          │     │
│    └──────────────────────────────┘     │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

**Card specs:**
- Desktop: `440x649`, Mobile: `358x571`
- Background: `#211115`, border: subtle, blur backdrop
- Padding: `40px`

**Form fields:**
- Label: 10–12px / 600 / `#94A3B8`
- Input: height `46px`, bg `#211115`, border `#2D1A1E` → focus border `#E21D48`
- Placeholder: `#6B7280`
- Password toggle icon: `#647080`
- "Forgot?" link: 10–12px / 500 / `#E21D48`

**Sign In button:**
- Full width (`308px`), height `52px`, bg `#E21D48`, text `16px / 700 / #FFFFFF`
- Arrow icon right side

**Footer text:**
- "Don't have an account?" `14px / #94A3B8` + **"Create Account"** `14px / 700 / #E21D48`

**Social buttons:** 3× `46x46` dark (`#211115`) rounded icon buttons

---

### Page 2 — Signup (`/signup`)

**Layout:** Identical to Login page — same card, same background, same structure.

**Differences from Login:**
- Title: **"Create Account"** instead of "Welcome Back"
- Subtitle: "Start your cinematic journey today"
- Form fields: **Full Name**, **Email**, **Password**, **Confirm Password**
- Submit button text: **"Create Account"**
- Footer text: "Already have an account?" + **"Sign In"** (rose link)
- No "Remember me" checkbox; no "Forgot?" link

---

### Page 3 — Movie Search (`/search`)

**Layout:** 1280px desktop, `#211115` background

```
┌──────────────────────────────────────────────────────────┐
│  NAVBAR  (Logo + Search | Watchlist | Logout)            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  "Find your next obsession."  48px / 900 / #F1F5F9      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🔍  Search movies, actors, or genres             │   │
│  └──────────────────────────────────────────────────┘   │
│    Input: 672x56, bg #1E293B, 18px / 500 / #94A3B8      │
│                                                          │
│  ── Trending Now ────────────────────────  View All →   │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                           │
│  │    │ │    │ │    │ │    │  ← 220x330 poster cards   │
│  │ ▶  │ │ ▶  │ │ ▶  │ │ ▶  │  ← rose play + bookmark  │
│  └────┘ └────┘ └────┘ └────┘                           │
│  Title 16px/700  Year•Genre 14px/500 #94A3B8           │
│                                                          │
│  ── Search Results ──────────  [All] [Movies] [TV]      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ Poster       │ │ Poster       │ │ Poster       │    │
│  │              │ │              │ │              │    │
│  │ Title   8.4  │ │ Title   7.2  │ │ Title   9.0  │    │
│  │ Year • Genre │ │ Year • Genre │ │ Year • Genre │    │
│  │[Details][+WL]│ │[Details][+WL]│ │[Details][+WL]│    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                          │
│              [ Load More Results ]                       │
├──────────────────────────────────────────────────────────┤
│  FOOTER                                                  │
└──────────────────────────────────────────────────────────┘
```

**Search bar:**
- Container: `672x56`, bg `#1E293B`, border-radius `8px`
- Left: search icon (`#1E293B` bg, `38x56`)
- Input: placeholder "Search movies, actors, or genres" `18px / 500 / #94A3B8`

**Trending Now card (220x386):**
- Poster: `220x330`, border-radius `12px`
- Overlay on hover: dark + 2 icon buttons (rose play `27x30`, white bookmark `30x30`)
- Title below: `16px / 700 / #F1F5F9`
- Meta: `14px / 500 / #94A3B8` — "Year • Genre"

**Search Result card (320x322, bg `#1E293B`):**
- Left: poster thumbnail
- Right content area (278px wide):
  - Title: `18px / 700 / #F1F5F9` + Rating badge (rose `38x24`, `14px / 700`)
  - Meta: `14px / 400 / #94A3B8` — "Year • Genre"
- Actions row:
  - **"Details"** button: `134x38`, rose bg, white text `14px / 700`
  - **"+ Watchlist"** button: `136x38`, outlined, rose text `14px / 700`

**Filter tabs:**
- Active: `49x30`, rose bg, rose text `12px / 700`
- Inactive: `74–91x30`, bg `#1E293B`, text `#647080` `12px / 700`

**Load More button:** `208x48`, bg `#1E293B`, text `#CBD5E1` `16px / 700`

---

### Page 4 — Movie Details (`/movie/:id`)

**Layout:** 1280px desktop

```
┌──────────────────────────────────────────────────────────┐
│  NAVBAR                                                  │
├──────────────────────────────────────────────────────────┤
│  ← Back to Search                                        │
│  ┌────────────────────────── Full-bleed backdrop ──────┐ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────┐   ┌──────────────────────────────────┐  │
│  │             │   │  [Sci-Fi] [Adventure] [Drama]    │  │
│  │   POSTER    │   │                                  │  │
│  │  350x521    │   │  "Interstellar"   60px/900       │  │
│  │             │   │  Nov 7, 2014 | 2h 49m | USA, UK  │  │
│  ├─────────────┤   │                                  │  │
│  │[Add Watchlist]  │  ┌────────┐ ┌─────────┐ ┌────┐  │  │
│  │[Watch Trailer]  │  │IMDb    │ │Tomatom. │ │Meta│  │  │
│  └─────────────┘   │  │ 8.7/10 │ │  73%    │ │ 74 │  │  │
│                    │  └────────┘ └─────────┘ └────┘  │  │
│                    │                                  │  │
│                    │  Plot Summary  20px/700          │  │
│                    │  Plot text...  18px/400 #CBD5E1  │  │
│                    │                                  │  │
│                    │  Director:  Christopher Nolan    │  │
│                    │  Writers:   J. Nolan, C. Nolan   │  │
│                    │  Stars:     McConaughey, …       │  │
│                    └──────────────────────────────────┘  │
│                                                          │
│  ── Similar Movies ───────────────────────  View all →  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                   │
│  └────┘ └────┘ └────┘ └────┘ └────┘                   │
├──────────────────────────────────────────────────────────┤
│  FOOTER                                                  │
└──────────────────────────────────────────────────────────┘
```

**"Back to Search" link:** `← Back to Search`, `14px / 600 / #CBD5E1`, arrow icon left

**Poster column (350px):**
- Poster card: `350x521`, border `#2D1A1E`, border-radius `12px`
- **"Add to Watchlist"** button: `350x56`, rose, `Add to Watchlist` `16px / 700`
- **"Watch Trailer"** button: `350x56`, rose, play icon + `Watch Trailer` `16px / 700`

**Info column (706px):**
- Genre badges: rose pills, `12px / 700`, `24px` height
- Title: `60px / 900 / #FFFFFF`
- Meta row: Release date | Runtime | Country — `14px / 500 / #E21D48`
- Rating boxes (`224x101–103`, rose border):
  - Label: `12px / 700 / #E21D48`
  - Score: `30px / 900 / #FFFFFF`
- Plot Summary heading: `20px / 700 / #FFFFFF`
- Plot text: `18px / 400 / #CBD5E1`
- Crew labels: `12px / 700 / #E21D48`; values: `16px / 600 / #FFFFFF`

**Similar Movies:** horizontal scroll of small poster cards with IMDb badge overlay

---

### Page 5 — Watchlist (`/watchlist`)

**Layout:** 1280px desktop, protected route

```
┌──────────────────────────────────────────────────────────┐
│  NAVBAR                                                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  "My Watchlist"  32px/700                               │
│  "X movies saved"  16px/400 #94A3B8                     │
│                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ Poster       │ │ Poster       │ │ Poster       │    │
│  │              │ │              │ │              │    │
│  │ Title   8.7  │ │ Title   7.2  │ │ Title   9.0  │    │
│  │ Year • Genre │ │ Year • Genre │ │ Year • Genre │    │
│  │[Details][✕ ] │ │[Details][✕ ] │ │[Details][✕ ] │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  FOOTER                                                  │
└──────────────────────────────────────────────────────────┘
```

**Card spec:** Same `320x322` card as Search Results.
- **"Details"** button: rose, `134x38`
- **"Remove"** button (✕): outlined/ghost, `136x38`, rose text

**Empty State (`/watchlist` with no items):**
- Centered illustration/icon
- Heading: "Your watchlist is empty" `24px / 700`
- Sub: "Start adding movies to build your collection." `16px / #94A3B8`
- CTA button: **"Discover Movies"** → routes to `/search`, rose bg

---

### Page 6 — No Results State

- Centered layout
- Heading: "No results found" `24px / 700`
- Sub: "Try different keywords or check spelling." `16px / #94A3B8`
- Search input repeated for retry
- Optional: "Browse Trending" section below

---

### Mobile Variants (390px)

All pages have dedicated mobile designs in Figma (frames ending in "Mobile Nav").

| Page            | Key Mobile Changes                                |
| --------------- | ------------------------------------------------- |
| Navbar          | Hamburger → slide-in drawer, no inline nav links  |
| Login/Signup    | Card is near full-width (`358px`), same structure |
| Search          | Single-column card grid, search bar full-width    |
| Movie Detail    | Poster stacks above info column                   |
| Watchlist       | Single-column card grid                           |

---

### Component Map (Figma → React)

| Figma Element              | React Component              |
| -------------------------- | ---------------------------- |
| Header / Navbar            | `components/Navbar.jsx`      |
| Footer                     | `components/Footer.jsx`      |
| Login card form            | `features/auth/LoginPage.jsx`|
| Signup card form           | `features/auth/SignupPage.jsx`|
| Hero + search bar          | `features/search/SearchPage.jsx` |
| Trending horizontal row    | `components/TrendingRow.jsx` |
| Search result card         | `components/MovieCard.jsx` (variant="search") |
| Watchlist card             | `components/MovieCard.jsx` (variant="watchlist") |
| Movie detail layout        | `features/movie/MovieDetailPage.jsx` |
| Rating box (IMDb/RT/Meta)  | `components/RatingBadge.jsx` |
| Genre badge pill           | `components/GenreBadge.jsx`  |
| Empty state                | `components/EmptyState.jsx`  |
| Loading skeleton           | shadcn `Skeleton` component  |
