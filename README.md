# Tonal Focus

High-fidelity photography portfolio built with Next.js 14, Supabase, and a 90s-inspired interface. The site highlights medium-format film work via a dynamic filmstrip hero, curated galleries, and an admin surface for managing photos.

## Features

- **Next.js App Router** with ISR and on-demand revalidation for fast, cache-friendly pages.
- **Supabase** for database + storage: photos, thumbnails, categories, and admin workflows.
- **Filmstrip hero** that pulls featured Supabase images with horizontal scroll/pinning effects.
- **Admin tools** (protected routes) for uploading assets, toggling featured status, and ordering the filmstrip.
- **Tailwind CSS** styling with custom Tonal Focus palette and retro typography.
- **TypeScript** throughout, plus linting/formatting via the Next toolchain.

## Prerequisites

- Node.js 18+
- Supabase project with `photos`, `categories`, and storage buckets (`photos`, `thumbnails`).
- Resend account (optional) for contact form email delivery.

## Environment Variables

Create a `.env.local` file (not committed) with the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="anon-key"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"
RESEND_API_KEY="re_xxx"                  # optional
CONTACT_EMAIL="info@tonalfocus.com"       # optional
NEXT_PUBLIC_CONTACT_EMAIL="info@tonalfocus.com"
NEXT_PUBLIC_CONTACT_PHONE="+1 (555) 123-4567"
REVALIDATE_SECRET="local-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"  # used by scripts during development
```

> Add `REVALIDATE_SECRET` (and optionally `REVALIDATE_ENDPOINT`) to each Vercel environment so admin actions can bust the cache.

## Installation & Development

```bash
npm install
npm run dev
# visit http://localhost:3000
```

### Useful Scripts

- `npm run dev` – local development server.
- `npm run build` – production build (Next.js + type check).
- `npm run lint` – lint the project.
- `scripts/verify-filmstrip.js` – sanity check that six featured Supabase photos resolve with 200 status.
- `scripts/mark-featured.js` – CLI helper to feature/unfeature photos and trigger revalidation.

## Deployment

1. Push to GitHub (`feature/*`, `main`, etc.).
2. Vercel build picks up Supabase env vars and generates static output.
3. Admin actions (upload, feature toggle, reorder) automatically call `/api/revalidate` to refresh `/` and `/portfolio`.

For manual revalidation, POST to `/api/revalidate` with header `x-revalidate-token: <REVALIDATE_SECRET>` and optional body `{"paths": ["/custom"]}`.

## Project Structure

```
├── docs/                      # design and implementation notes
├── public/                    # static assets and fonts
├── scripts/                   # node helpers (verify, mark-featured, deploy)
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── api/               # edge/server routes (Supabase queries, revalidation)
│   │   ├── admin/             # admin UI (protected)
│   │   ├── layout.tsx
│   │   └── page.tsx           # homepage with filmstrip + featured gallery
│   ├── components/            # shared UI and feature components
│   ├── lib/                   # Supabase clients, auth, revalidation helper
│   └── types/                 # shared TypeScript types
├── next.config.js             # image host configuration derived from Supabase URL
├── tailwind.config.js
└── package.json
```

## Supabase Schema (Summary)

- `categories` – id, name, slug, description, ordering.
- `photos` – metadata (title, description, storage paths, is_featured, is_black_white, ordering) with public/private URLs.
- Storage buckets – `photos`, `thumbnails` (public) for original and generated assets.

## Admin & Revalidation Flow

- Uploads generate Supabase storage entries and DB rows, then trigger `revalidatePath('/')` and `/portfolio`.
- Featuring, unfeaturing, or reordering photos calls the same revalidation helper.
- Scripts call the `/api/revalidate` endpoint for external workflows.

## Design Direction

Upcoming gear showcase will mirror teenage.engineering’s minimalist line-art guides—clean outlines, labeled callouts, and gear-specific storytelling (Hasselblad 500c, Rolleiflex 3.5).

## Contributing

1. Create a branch (`feature/<issue-name>`).
2. Keep changes scoped; run lint and the verify script when touching photo flows.
3. Open a pull request referencing the GitHub issue.

---

Questions or ideas? Open an issue in GitHub—the repo is fully issue-driven now.
