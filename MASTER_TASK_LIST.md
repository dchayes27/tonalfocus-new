# Tonal Focus - Master Task List
*Last Updated: January 27, 2025*

## ✅ COMPLETED TODAY (January 27, 2025)

### P0 - Critical Production Fixes
- [x] Fix Portfolio Page Loading - Converted to server component
- [x] Fix Environment Variables on Vercel - All keys added
- [x] Fix static generation - Created public Supabase client
- [x] Deploy to production - Site live at https://tonalfocus-new.vercel.app

## 🚀 IMMEDIATE NEXT STEPS

### P0 - Remaining Critical Fix
- [ ] **Standardize Database Fields**
  - Drop `is_color` column (use only `is_black_white`)
  - Create migration file: `002_consolidate_bw_field.sql`
  - Test in development before production

### Domain Setup
- [ ] **Connect tonalfocus.com to new deployment**
  - Remove from old project
  - Add to tonalfocus-new project
  - Update DNS if needed

## 📝 P1 - Core Features (3-4 days)

### Performance Optimization
- [ ] **Implement ISR with On-Demand Revalidation**
  ```typescript
  // Add revalidation API endpoint
  // Set revalidate: 3600 on pages
  ```

- [ ] **Add Blur Placeholders**
  - Install plaiceholder
  - Generate base64 blur data for each image
  - Store in database

- [ ] **Fix Image Component Usage**
  - Add proper sizes attribute
  - Implement priority loading for above-fold images
  - Add blur placeholder support

## 🎨 P2 - Polish & Enhancement (2-3 days)

### SEO & Metadata
- [ ] **Implement Proper Metadata**
  - Dynamic OG images for each photo
  - Photo-specific titles and descriptions
  - JSON-LD structured data

- [ ] **Add Contact Sheet View**
  - Grid layout mimicking film contact sheets
  - Frame numbers display
  - Film metadata overlay

### User Experience
- [ ] **Keyboard Navigation**
  - Arrow keys for prev/next
  - ESC to close lightbox
  - Numbered keys for quick jump

- [ ] **Film Metadata System**
  - Camera/lens information
  - Film stock details
  - Development notes
  - EXIF data display

## 🔮 P3 - Advanced Features (Optional)

### Future Enhancements
- [ ] Client-side image viewer with gestures
- [ ] Collection/Project pages with custom slugs
- [ ] Print shop integration
- [ ] Newsletter signup with Resend
- [ ] Analytics (Vercel Analytics or Plausible)
- [ ] Blog/Stories section
- [ ] Client galleries with password protection

## 📊 Performance Targets

### Current Status
- ✅ Site is live and functional
- ✅ Portfolio loads with server-side rendering
- ⚠️ Custom domain not connected

### Target Metrics
- LCP: < 2.5s (achieve with blur placeholders)
- CLS: < 0.1 (add proper image dimensions)
- FID: < 100ms (already good)
- Bundle Size: < 200KB JS

## 🐛 Known Issues

1. **Database Schema Mismatch**
   - Both `is_color` and `is_black_white` fields exist
   - Need to consolidate to single field

2. **Custom Domain**
   - tonalfocus.com shows "DEPLOYMENT_NOT_FOUND"
   - Need to update domain configuration in Vercel

3. **No Error Boundaries**
   - Add error boundaries for graceful failures
   - Implement fallback UI for loading states

## 💡 Quick Wins Available

- [x] ~~Fix portfolio loader~~ ✅ DONE
- [x] ~~Add Vercel env vars~~ ✅ DONE
- [ ] Test image upload in production
- [ ] Add loading skeletons
- [ ] Implement basic analytics
- [ ] Add sitemap.xml
- [ ] Add robots.txt

## 📅 Suggested Sprint Plan

### Week 1 (This Week)
- Day 1: ✅ Fix portfolio loading and env vars (DONE)
- Day 2: Database schema cleanup, domain setup
- Day 3: ISR implementation, blur placeholders

### Week 2
- Days 4-5: SEO and metadata improvements
- Days 6-7: Contact sheet view and keyboard navigation

### Week 3
- Polish and testing
- Performance optimization
- Launch preparation

## 🎯 Definition of Done

A task is complete when:
- [ ] Code is tested locally
- [ ] TypeScript has no errors
- [ ] Deployed to production
- [ ] Verified working on live site
- [ ] Documentation updated if needed

---

*Note: This document combines the technical review recommendations with actual implementation status. Items marked as DONE have been verified working in production.*
