# CinemaDark

A fast, responsive movie watchlist web app built with React. Search for movies and TV shows, view detailed info, and save titles to a personal watchlist — synced to the cloud per user.

**Live Demo:** [cinema-dark.vercel.app](https://cinema-dark.vercel.app/search) &nbsp;|&nbsp; **GitHub:** [raihan-ops/cinema-dark](https://github.com/raihan-ops/cinema-dark) &nbsp;|&nbsp; **Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1bM4K8FzBnWyT9sOUjOP3HkQnvRt73Qom/view?usp=drive_link)

---

## Features

- **Search** — Real-time movie and TV show search powered by the TMDB API, with genre filtering and infinite scroll
- **Trending** — Browse this week's trending titles with an auto-playing carousel and a full paginated grid
- **Movie Details** — Full detail page with poster, genres, ratings, plot, trailer, cast, and similar titles
- **Watchlist** — Save titles to a personal watchlist, persisted per user in Firestore
- **Authentication** — Email/password sign up & login, Google social login, and forgot-password flow via Firebase Auth
- **Protected Routes** — Watchlist is only accessible to logged-in users
- **Responsive** — Works on all screen sizes; includes a dedicated mobile bottom navigation bar
- **Animations** — Page transitions, stagger effects, and hover micro-interactions via Framer Motion

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Animations | Framer Motion |
| Auth & DB | Firebase v12 (Auth + Firestore) |
| Movie API | TMDB API v3 |
| Notifications | Sonner |
| Icons | Lucide React |

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A free [TMDB API key](https://www.themoviedb.org/settings/api)
- A [Firebase project](https://console.firebase.google.com/) with **Authentication** and **Firestore** enabled

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cinema-dark.git
cd cinema-dark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

Open `.env` and add your credentials:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Where to get these keys:**
- **TMDB key** — Sign up at [themoviedb.org](https://www.themoviedb.org), go to Settings → API
- **Firebase keys** — In Firebase Console, go to Project Settings → Your Apps → SDK setup

### 4. Enable Firebase services

In your Firebase Console:
- **Authentication** → Sign-in method → Enable **Email/Password** and **Google**
- **Firestore Database** → Create database (start in test mode or set rules as below)

Recommended Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/wishlist/{movieId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── api/            # TMDB API helpers and Firestore CRUD
├── components/
│   ├── features/   # MovieCard, TrendingCard, TrendingRow
│   ├── layout/     # Navbar, Footer, BottomNav
│   ├── skeletons/  # Loading skeleton components
│   └── ui/         # Reusable primitives (Button, Input, Dialog, etc.)
├── hooks/          # useDebounce, useScrollToTop
├── lib/            # Firebase init, QueryClient, genre map, utils
├── pages/
│   ├── auth/       # LoginPage, SignupPage, ForgotPasswordPage
│   ├── movie/      # MovieDetailPage
│   ├── search/     # SearchPage
│   ├── trending/   # TrendingPage
│   └── watchlist/  # WatchlistPage
├── router/         # Route definitions and lazy loading
└── store/          # Zustand stores (auth, watchlist, ui)
```

---

## Pages

| Route | Description | Auth Required |
|---|---|---|
| `/search` | Search movies and TV shows | No |
| `/trending` | Browse trending titles | No |
| `/movie/:id` | Movie or TV show detail | No |
| `/watchlist` | Personal watchlist | Yes |
| `/login` | Sign in | No |
| `/signup` | Create account | No |
| `/forgot-password` | Password reset | No |

---

## API

This app uses the [TMDB API v3](https://developer.themoviedb.org/docs). A free API key is required.

Endpoints used:
- `GET /search/multi` — search movies and TV shows
- `GET /trending/all/week` — weekly trending titles
- `GET /movie/{id}?append_to_response=credits,videos,similar`
- `GET /tv/{id}?append_to_response=credits,videos,similar`
