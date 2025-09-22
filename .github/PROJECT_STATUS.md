# Tonal Focus Portfolio - Project Status

## Current Sprint (January 2025)

### Active Branch: `fix/portfolio-server-component`
**Issue:** #1 - Fix portfolio page infinite loading
**Started:** January 27, 2025
**Status:** IN PROGRESS

---

## Work Log

### January 27, 2025
- Created project tracking structure
- Set up GitHub issues template
- Created feature branch for portfolio fix
- Next: Convert portfolio page to server component

---

## Quick Commands Reference

### Git Workflow
```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b fix/[issue-name]

# Commit changes
git add -A
git commit -m "fix: [description] (#issue-number)"

# Push and create PR
git push -u origin fix/[issue-name]

# After PR merged
git checkout main
git pull origin main
git branch -d fix/[issue-name]
```

### Testing Commands
```bash
# Local development
npm run dev

# Production build test
npm run build && npm start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

### Deployment
```bash
# Deploy to Vercel
./deploy-to-vercel.sh

# Push to GitHub (triggers auto-deploy)
./sync-github.sh
```

---

## Environment Variables Checklist

### Required for Production
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only)
- [ ] `RESEND_API_KEY` - For contact form emails
- [ ] `CONTACT_EMAIL` - Where form submissions go
- [ ] `REVALIDATE_SECRET` - For ISR webhook security
- [ ] `ADMIN_PASSWORD_HASH` - BCrypt hash for admin login

### Optional
- [ ] `NEXT_PUBLIC_GA_ID` - Google Analytics
- [ ] `SENTRY_DSN` - Error tracking

---

## Issue Priority Queue

### 🚨 P0 - Critical (Do First)
1. ✅ Create tracking structure
2. ⏳ Fix portfolio page loading (#1)
3. ⏳ Configure Vercel env vars (#2)
4. ⏳ Fix database schema (#3)

### 🎯 P1 - Core Features (Do Second)
5. ⏳ Implement ISR revalidation (#4)
6. ⏳ Add blur placeholders (#5)
7. ⏳ Optimize Image components (#6)

### ✨ P2 - Polish (Do Third)
8. ⏳ SEO & metadata (#7)
9. ⏳ Contact sheet view (#8)
10. ⏳ Keyboard navigation (#9)
11. ⏳ Film metadata (#10)

### 🔄 DevOps (Ongoing)
12. ⏳ CI/CD pipeline (#11)
13. ⏳ Error monitoring (#12)

---

## Notes for Next Session

If work is interrupted, the next person should:
1. Check this status file for context
2. Look at current branch with `git status`
3. Continue from the "Next:" item in Work Log
4. Update this file with progress

Current task details are in: `.github/ISSUES_TEMPLATE.md`
