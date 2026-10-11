# Kino XII

A cinema booking frontend for browsing films and showtimes, choosing seats, and managing tickets. Built with Next.js App Router and backed by the [Kino XII API](https://api.kinoxii.redberryinternship.ge/docs).

## What the app does

- **Discover films:** featured titles, now playing and coming soon carousels, movie details, and a recently viewed list stored in the browser.
- **Find a showtime:** filter sessions by venue, date, format, language, and time of day; sort and paginate results. Filters live in the URL, so a view can be shared, refreshed, or revisited with the Back button.
- **Sign in or register:** authentication happens in modals. Registration supports an optional avatar. Protected requests use a bearer token; an expired session prompts for login and retries the interrupted request.
- **Book tickets:** open the booking popup from a movie or showtime, select seats and ticket types, hold seats, complete checkout, and view the confirmation. The flow handles hold expiry and seat conflicts.
- **Manage an account:** update profile information, browse upcoming and past tickets, and request a refund when the API marks an order as refundable.
- **Get notified:** signed in users can subscribe to a coming soon film from the home page.

## Tech stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, Axios, React Hook Form, Zod, and Embla Carousel. The project uses **pnpm** (`packageManager: pnpm@11.7.0`).

## Run locally

Use a recent Node.js version (Node.js 22+ is recommended for the included test scripts) and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). For a production run:

```bash
pnpm build
pnpm start
```

No `.env` file is required for local development. The Axios client in [`lib/api.ts`](lib/api.ts) points to `https://api.kinoxii.redberryinternship.ge/api`, so the app needs access to that API for live data and booking. When you deploy, set `NEXT_PUBLIC_SITE_URL` to the public origin (for example, `https://your-domain.example`) to enable canonical URLs and the sitemap. Vercel's production URL is used automatically when available.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Featured films, recently viewed, now playing, and coming soon |
| `/sessions` | Searchable and filterable showtimes |
| `/movie/[movieId]` | Movie details and showtimes; the route parameter is the movie **slug** |
| `/account` | Profile and tickets (`?tab=tickets` opens the tickets view) |

Booking uses a popup on the movie route. `?bookingSession=<sessionId>` opens it for a specific showtime; `?book=1` starts from the movie's available showtimes. There is no separate seat selection page. Login and registration also use popups instead of dedicated routes.

The sessions page keeps `date`, `sort`, `page`, and optional `search` in its query string. Multi-select filters use repeated `venues[]`, `formats[]`, `languages[]`, and `bands[]` parameters. Changing a filter or sort returns to page 1.

## How booking state works

The seat map and ticket rules come from the API. New accounts must complete their profile before booking. A selected seat is held when the user continues to checkout; the API returns the hold's prices, subtotal, and expiry. An unpaid live hold can be restored after a refresh, while leaving the booking releases it. Checkout renders confirmation from the returned order. Card fields are used only for the checkout request and are not saved in browser storage.

Authentication tokens and recently viewed films are stored in browser local storage. A stored token is checked against `/me` when the app restores the session. Booking hold IDs are stored by user and session so an active checkout can be restored.

## Project layout

```text
app/                  Next.js routes, root layout, and query provider
features/
  account/            Profile, tickets, and refunds
  auth/               Login, registration, session, and auth guards
  booking/            Booking popup, holds, checkout, and confirmation
  common/             Shared header, footer, and UI components
  home/               Home page sections and notifications
  movie/              Movie details and movie showtimes
  recently-viewed/    Browser-local movie history
  seats/              Seat map data and selection
  sessions/           Filters, showtime results, sorting, and pagination
lib/                  Shared Axios client and route helpers
public/               Static assets
```

Feature directories keep their own API calls, components, hooks, types, schemas, and tests where needed. The `@/` import alias points to the repository root.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test:booking
pnpm test:account
pnpm test:recent
pnpm build
```

The focused tests cover booking behavior, account refund logic, and recently viewed history. See the [API documentation](https://api.kinoxii.redberryinternship.ge/docs) for backend endpoints and response shapes.
