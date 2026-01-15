# My Todo Frontend

Modern React (Vite) client for the **My Todo** MERN stack project. It delivers a token-authenticated dashboard where users can register, log in, and manage personal task lists through a responsive UI.

## Features

- **Authentication flow** – Signup with password-strength cues, animated login form, JWT storage in `localStorage`, and route guards (`PrivateRoute`/`AuthRoute`).
- **Task management** – Create, edit, delete single tasks, or bulk-delete selected tasks. Lists auto-refresh after mutations.
- **Reusable API layer** – `src/api.js` exposes `request`, `buildUrl`, and `API_BASE_URL`, automatically attaching the JWT and surfacing backend error messages.
- **Toast notifications & motion** – `react-toastify` for feedback and `framer-motion` animations in auth screens.
- **Modular styling** – Component-scoped CSS files under `src/components/style/` for add-task, auth, list, and navbar views.

## Tech Stack

- React 19 + React Router 7
- Vite 7 (build tooling, fast HMR)
- React Toastify, React Icons, Framer Motion
- Bun lockfile included, though npm/pnpm/yarn work as well

## Project Structure

```
frontend/
├── public/                 # Static assets served as-is
├── src/
│   ├── api.js              # API helper (base URL + request wrapper)
│   ├── App.jsx             # App shell, routing, guards, Toast container
│   ├── main.jsx            # ReactDOM entry point
│   ├── assets/             # Static media
│   └── components/
│       ├── AddTask.jsx
│       ├── UpdateTask.jsx
│       ├── List.jsx
│       ├── Login.jsx
│       ├── Signup.jsx
│       ├── NavBar.jsx
│       └── style/          # CSS modules for major views
├── package.json
├── bun.lock
├── vite.config.js
└── README.md (this file)
```

## Getting Started

### Prerequisites

- Node.js ≥ 18 (or Bun ≥ 1.0)
- Backend API running (defaults to `http://localhost:3200`)

### Installation

```bash
# install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create `.env` in the project root:

```
VITE_API_BASE_URL=http://localhost:3200
```

For production, point to your deployed backend (e.g., `https://api.example.com`). Vite exposes variables prefixed with `VITE_` to the browser, so never include secrets here.

### Available Scripts

```bash
npm run dev       # Start Vite dev server (default http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint (per eslint.config.js)
```

### Running the App

1. Start the backend (Express/Mongo service).
2. Start the frontend dev server: `npm run dev`.
3. Visit the printed URL, sign up for an account, then log in to manage tasks.

## Authentication Flow

- Signup persists `token`, `userId`, and `fullName` in `localStorage`.
- Protected routes (`/tasks`, `/add`, `/update/:id`) are wrapped by `PrivateRoute`, redirecting unauthenticated visitors to `/login`.
- Auth routes (`/login`, `/signup`) redirect logged-in users to `/tasks`.
- API helper injects `Authorization: Bearer <token>` so the backend can scope responses to the current user.

## API Helper Usage

```js
import { request } from "../api";

const data = await request("/tasks", { method: "GET" });
```

- `request(path, options)` automatically builds the absolute URL, stringifies JSON bodies, attaches the JWT, and throws descriptive errors when the backend responds with `{ success: false, message: "…" }`.

## QA Checklist

- [ ] Login/Signup flows succeed and redirect correctly.
- [ ] Task CRUD operations update the UI without refresh.
- [ ] Bulk delete requires explicit confirmation.
- [ ] Toast notifications appear for success/failure scenarios.
- [ ] `.env` correctly points to the intended backend.

## License

Not specified. Add a LICENSE file if distributing publicly.
