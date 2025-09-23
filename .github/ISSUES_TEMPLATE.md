# Tonal Focus Portfolio - Issue Templates

Copy these to GitHub Issues for tracking. Issues are organized by priority (P0 = Critical, P1 = Core, P2 = Polish).

---

## 🚨 P0: CRITICAL PRODUCTION FIXES

### Issue #1: Fix portfolio page infinite loading
**Title:** 🚨 P0: Fix portfolio page infinite loading - Convert to server component
**Labels:** bug, critical, P0
**Assignee:** @dchayes27

#### Problem
The portfolio page at `/portfolio` is stuck showing "Loading gallery..." because it uses client-side data fetching that fails in production.

#### Root Cause
- Using `'use client'` with `useEffect` for data fetching
- Likely missing environment variables in production
- No error boundaries to handle failures gracefully

#### Solution
Convert `/portfolio` page to a server component with static generation and ISR.

#### Acceptance Criteria
- [ ] Portfolio page loads immediately without spinner
- [ ] Images are server-rendered with proper SEO
- [ ] Implements ISR with 1-hour revalidation
- [ ] Graceful error handling if Supabase is unavailable

#### Files to Change
- `src/app/portfolio/page.tsx`
- `src/app/api/photos/route.ts`

---

### Issue #2: Configure Vercel environment variables
**Title:** 🚨 P0: Add missing environment variables to Vercel
**Labels:** bug, configuration, P0
**Assignee:** @dchayes27

#### Problem
Production deployment is missing critical environment variables.

#### Tasks
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (for server-side)
- [ ] Add `RESEND_API_KEY` for contact form
- [ ] Add `CONTACT_EMAIL` for form recipient
- [ ] Add `REVALIDATE_SECRET` for ISR webhook

#### Verification
- [ ] Portfolio page loads data
- [ ] Contact form sends emails
- [ ] Admin panel can upload images

---

### Issue #3: Fix database schema inconsistency
**Title:** 🚨 P0: Standardize B&W field naming in database
**Labels:** bug, database, P0
**Assignee:** @dchayes27

#### Problem
Database has both `is_color` and `is_black_white` fields causing confusion.

#### Solution
Standardize on `is_black_white` throughout the codebase.

#### Tasks
- [ ] Create migration to drop `is_color` column
- [ ] Update all TypeScript interfaces
- [ ] Update admin panel to use `is_black_white`
- [ ] Verify API endpoints use consistent field

---

## 🎯 P1: CORE FEATURES

### Issue #4: Implement ISR with on-demand revalidation
**Title:** P1: Add on-demand revalidation API endpoint
**Labels:** enhancement, performance, P1
**Assignee:** @dchayes27

#### Description
Add webhook endpoint for Vercel to revalidate pages when content changes.

#### Tasks
- [ ] Create `/api/revalidate` endpoint
- [ ] Add secret token validation
- [ ] Implement `revalidatePath` for portfolio and homepage
- [ ] Add webhook call from admin panel after changes

---

### Issue #5: Add image blur placeholders
**Title:** P1: Generate blur placeholders for smooth image loading
**Labels:** enhancement, UX, P1
**Assignee:** @dchayes27

#### Description
Generate base64 blur placeholders for all images to improve perceived performance.

#### Tasks
- [ ] Add plaiceholder package
- [ ] Generate blur data during upload
- [ ] Store blur data in database
- [ ] Use blur placeholders in Image components

---

### Issue #6: Optimize Image component usage
**Title:** P1: Fix Next.js Image component configuration
**Labels:** performance, P1
**Assignee:** @dchayes27

#### Tasks
- [ ] Add proper `sizes` attribute to all Image components
- [ ] Set `priority` on above-the-fold images
- [ ] Remove invalid `quality` from next.config.js
- [ ] Use appropriate image formats (webp/avif)

---

## ✨ P2: POLISH & ENHANCEMENTS

### Issue #7: Add SEO metadata and JSON-LD
**Title:** P2: Implement comprehensive SEO with metadata and structured data
**Labels:** SEO, enhancement, P2
**Assignee:** @dchayes27

#### Tasks
- [ ] Add metadata to all pages
- [ ] Implement OpenGraph images
- [ ] Add JSON-LD for Person/Organization
- [ ] Add JSON-LD for ImageObject on photos
- [ ] Create sitemap.xml
- [ ] Add robots.txt

---

### Issue #8: Create contact sheet view
**Title:** P2: Design and implement film contact sheet gallery view
**Labels:** enhancement, design, P2
**Assignee:** @dchayes27

#### Description
Create authentic film contact sheet view matching the 90s aesthetic.

#### Tasks
- [ ] Design contact sheet CSS grid
- [ ] Add frame numbers to photos
- [ ] Implement view toggle (grid/contact sheet)
- [ ] Add film sprocket hole decorations (optional)

---

### Issue #9: Add keyboard navigation to lightbox
**Title:** P2: Implement keyboard controls for image viewer
**Labels:** enhancement, accessibility, P2
**Assignee:** @dchayes27

#### Tasks
- [ ] Add arrow key navigation
- [ ] Add ESC to close
- [ ] Add number keys for quick jump
- [ ] Add focus trap when lightbox is open

---

### Issue #10: Implement film metadata system
**Title:** P2: Add and display photography metadata (EXIF, film stock, etc.)
**Labels:** enhancement, P2
**Assignee:** @dchayes27

#### Tasks
- [ ] Extract EXIF data on upload
- [ ] Create metadata edit form in admin
- [ ] Display metadata in lightbox
- [ ] Add film stock, camera, development notes fields

---

## 🔄 WORKFLOW ISSUES

### Issue #11: Set up CI/CD pipeline
**Title:** DevOps: Configure GitHub Actions for testing and deployment
**Labels:** devops, testing
**Assignee:** @dchayes27

#### Tasks
- [ ] Add TypeScript checking action
- [ ] Add ESLint action
- [ ] Add build verification
- [ ] Add Lighthouse CI performance budget
- [ ] Auto-deploy to staging on PR

---

### Issue #12: Add error monitoring
**Title:** DevOps: Implement Sentry error tracking
**Labels:** monitoring, devops
**Assignee:** @dchayes27

#### Tasks
- [ ] Set up Sentry account
- [ ] Install Sentry Next.js SDK
- [ ] Configure error boundaries
- [ ] Add performance monitoring
- [ ] Set up alerts for critical errors
