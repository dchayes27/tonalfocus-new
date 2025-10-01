# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tonal Focus is a high-fidelity photography portfolio built with Next.js 14 App Router, Supabase, and a 90s-inspired interface. The site showcases medium-format film work with a dynamic filmstrip hero, curated galleries, and admin tools for managing photos.

## Common Development Commands

```bash
# Development
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build with type checking
npm run lint             # Run ESLint

# Admin utilities
node scripts/mark-featured.js      # Mark photos as featured (interactive CLI)
node scripts/verify-filmstrip.js   # Verify 6 featured photos exist and URLs resolve
node scripts/generate-admin-hash.js # Generate bcrypt hash for admin password
```

## Environment Setup

Copy `.env.example` to `.env.local` and configure:

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Admin auth**: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (use `generate-admin-hash.js` to create hash)
- **Revalidation**: `REVALIDATE_SECRET` (required for cache busting after admin actions)
- **Email** (optional): `RESEND_API_KEY`, `CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_EMAIL`

## Architecture Overview

### Next.js App Router Structure
- **ISR with on-demand revalidation**: Homepage and portfolio use ISR for performance
- **Server Components**: Default for all pages, client components marked with `"use client"`
- **API Routes**: Supabase queries, admin auth, revalidation, contact form

### Supabase Integration
- **Two client types**:
  - `createServerClient()` – Cookie-based client for server components (uses anon key)
  - `createServiceRoleClient()` – Service role client for admin operations (bypasses RLS)
- **Storage buckets**: `photos` and `thumbnails` (both public)
- **Database schema**: `photos` and `categories` tables with RLS policies

### Revalidation Flow
Admin actions (upload, feature toggle, reorder) trigger cache invalidation:
1. Admin UI calls server action
2. Server action updates Supabase
3. Calls `triggerRevalidation()` which runs `revalidatePath('/')` and `revalidatePath('/portfolio')`
4. Next.js regenerates static pages on next request

External scripts use POST to `/api/revalidate` with `x-revalidate-token` header.

### Admin Authentication
- Basic bcrypt-based auth (not Supabase Auth)
- Protected routes use middleware in `src/lib/auth/admin.ts`
- Admin pages at `/admin`, `/admin/photos`, `/admin/categories`

## Key Files & Directories

### Core Infrastructure
- `src/lib/supabase-server.ts` – Server-side Supabase clients (anon + service role)
- `src/lib/supabase-public.ts` – Browser client for public pages
- `src/lib/revalidate.ts` – Cache invalidation helper
- `src/lib/storage.ts` – Photo upload, thumbnail generation, EXIF extraction
- `src/lib/auth/admin.ts` – Admin authentication logic

### App Router Pages
- `src/app/page.tsx` – Homepage with filmstrip hero + featured gallery
- `src/app/portfolio/page.tsx` – Full gallery view
- `src/app/admin/` – Admin UI (protected routes)
- `src/app/api/` – API routes (Supabase queries, revalidation, contact)

### Components
- `src/components/home/` – Homepage-specific components (filmstrip, hero, about/contact rows)
- `src/components/photography/` – Photo display components (lightbox, grid)
- `src/components/admin/` – Admin UI components (photo uploader, drag-drop ordering)
- `src/components/ui/` – Reusable UI primitives

### Database
- `database/schema.sql` – Complete Supabase schema (tables, indexes, RLS policies)
- `database/migrations/` – Schema evolution scripts
- `database/STORAGE_SETUP.md` – Instructions for Supabase storage bucket setup

## Design System

### Color Palette (90s-inspired)
- `primary.teal` (#5F8375) – Main accent color
- `primary.beige` (#D9D3C3) – Electronics beige
- `primary.charcoal` (#2E2E2E) – Soft black
- `primary.mauve` (#8B6F88) – Dusty mauve
- `secondary.gray`, `secondary.sepia`, `secondary.offWhite` – Supporting colors

### Typography
- `font-sans` (Inter) – Body text
- `font-pixel` – Retro pixel font for UI accents
- `font-ms-serif` – Serif font for headings

### Image Configuration
`next.config.js` dynamically configures `remotePatterns` from `NEXT_PUBLIC_SUPABASE_URL` for Next.js Image optimization.

## Important Conventions

### Photo Workflow
1. **Upload**: Admin uploads photo → generates thumbnail → extracts EXIF → saves to Supabase storage + DB
2. **Featuring**: Mark photo as `is_featured=true` → triggers revalidation
3. **Ordering**: Drag-drop in admin UI updates `display_order` field → triggers revalidation
4. **Filmstrip**: Homepage pulls 6 featured photos ordered by `display_order`

### TypeScript
- All components and utilities use TypeScript
- Types defined in `src/types/` and inline interfaces
- `tsconfig.json` configured for Next.js 14 App Router

### Image Handling
- Originals stored in `photos` bucket
- Thumbnails (800px wide, quality 80) in `thumbnails` bucket
- EXIF data extracted and stored in `photos.metadata` JSONB field
- `is_black_white` flag for filtering B&W vs color photos

### Deployment
- Vercel deployment auto-triggered on push to `main`
- Environment variables must be set in Vercel dashboard
- `REVALIDATE_SECRET` required for on-demand revalidation to work in production

## Common Tasks

### Adding Photos
1. Use admin UI at `/admin/photos` to upload
2. Or manually insert into Supabase, then run `mark-featured.js` to feature

### Changing Featured Photos
Run `node scripts/mark-featured.js` and select option (mark all, mark latest 6, mark specific, or unmark all)

### Verifying Homepage
Run `node scripts/verify-filmstrip.js` to ensure 6 featured photos exist and URLs resolve

### Database Migrations
1. Write SQL in `database/migrations/`
2. Apply via Supabase dashboard SQL editor or CLI
3. Update `database/schema.sql` to reflect current state

### Testing Admin Auth
Generate password hash: `node scripts/generate-admin-hash.js`
Set in `.env.local` as `ADMIN_PASSWORD_HASH`
