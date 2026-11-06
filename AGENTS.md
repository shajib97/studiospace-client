<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# StudioSpace Client Guidelines

## Project scope

- This is the StudioSpace web client, built with Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS, and shadcn/ui with Base UI. The Express API is maintained in the separate `studiospace-server` repository. Both services use MongoDB Atlas.
- Route pages and handlers live in `src/app`. Shared UI lives in `src/components`, server and auth helpers in `src/lib`, and shared studio types in `src/types/studio.ts`. Use the `@/*` alias for imports from `src`.
- Public flows include studio discovery and details under `/studios`, plus `/how-it-works` and `/about`. Account flows include `/login`, `/register`, and `/dashboard`. Listing management uses `/add-studio`, `/my-listings`, and `/studios/edit/[id]`. Users view and cancel their booking requests in `/my-bookings`.
- Keep changes focused on the requested feature. Reviews are currently display-only. Host confirmation and review submission are outside the current assignment implementation.

## Rendering and data flow

- Prefer Server Components for pages and server-side data fetching. Use `"use client"` for focused components that need browser state, event handlers, or client navigation.
- Type dynamic route `params` and page `searchParams` as promises and await them. Follow the existing Suspense, loading, empty, error, and not-found patterns.
- Use server-side fetches or same-origin Route Handlers under `src/app/api` to reach Express. Read the backend base URL from the server-only `API_URL`.
- Use `cache: "no-store"` for user-specific or frequently changing data. Check upstream status and validate the JSON fields the UI relies on. Encode dynamic URL segments and validate route IDs where appropriate.

## Authentication and authorization

- Better Auth handles email/password, Google, and GitHub sign-in. Preserve the existing account-linking behavior when changing authentication.
- `src/proxy.ts` handles redirects for protected routes. Keep page and Route Handler session checks where they protect user-owned data. Express enforces authentication and ownership for protected API operations.
- Preserve origin checks and session validation in mutation Route Handlers. Use the existing `createApiToken` helper and short-lived JWT flow for authenticated requests to Express. Preserve the HttpOnly cookie behavior where the API token is set as a cookie.
- Derive the acting user from the verified session or token. Express must verify ownership before changing a listing or cancelling a booking.
- Keep credentials and server-only configuration in environment variables. Never expose secrets through `NEXT_PUBLIC_*` or commit real `.env` values.

## Listings, bookings, and reviews

- Use the existing add/edit form and field conventions. Keep the current photo when a listing is edited without a replacement upload.
- Send image uploads through `/api/upload-image`. Preserve authentication and image type and size checks before forwarding to ImgBB. Keep allowed external image hosts aligned with `images.remotePatterns` in `next.config.ts`.
- New booking requests start as `Pending`. Users can cancel their own pending requests. Express rejects requests that overlap a `Confirmed` booking for the same studio. Preserve the API's availability error in the UI so the user can choose another slot.
- Keep the booking form's local-time input and preserve the existing date serialization when sending requests. For overlap checks, use the same studio and date for both slots.
- Demo reviews come from studio data. Support studios with no reviews, and keep the review list, average rating, and review count consistent when editing demo data.

## UI conventions

- Reuse primitives in `src/components/ui` and existing feature components. Follow their Base UI APIs and use the existing `cn` helper and variant conventions.
- Use semantic Tailwind tokens such as `bg-background`, `text-muted-foreground`, and `border-border` so changes work in both light and dark mode.
- Use `sonner` for mutation feedback. Prevent duplicate submissions while a request is pending, handle failures explicitly, and refresh or revalidate affected data after success.

## Validation and deployment

- Run `npm run lint` and `npm run build` for client changes. The client currently has no automated test script. Report lint, build, and manual checks separately.
- Deploy Express before the Next.js client. Set the client's `API_URL` to the deployed Express URL. Set Express `CLIENT_URL` and the client's `BETTER_AUTH_URL` to the stable production frontend origin. Keep `API_JWT_SECRET` identical on both services and register the production OAuth callback URLs.
- After deployment, verify public studio browsing, sign-in, and a protected action from the production site. For booking changes, confirm that a rejected overlap leaves the booking collection unchanged.
