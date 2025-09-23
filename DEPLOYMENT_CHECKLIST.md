# Tonal Focus - Deployment Checklist

## 🚀 Pre-Deployment Verification

### Local Testing
- [ ] Start dev server: `npm run dev`
- [ ] Test admin login at http://localhost:3000/admin
  - Username: `admin`
  - Password: `tonalfocus2025`
- [ ] Test photo upload in admin panel
- [ ] Test drag-and-drop reordering
- [ ] Verify B&W detection works
- [ ] Check portfolio page loads correctly
- [ ] Test contact form submission

### Production Environment Variables (Vercel)
- [x] `NEXT_PUBLIC_SUPABASE_URL`
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `SUPABASE_SERVICE_ROLE_KEY`
- [x] `RESEND_API_KEY`
- [x] `CONTACT_EMAIL`
- [x] `REVALIDATE_SECRET`
- [ ] `ADMIN_PASSWORD_HASH` ← **ADD THIS NOW!**
  - Value: `$2b$10$UObToJK9YZ8QKS7lATkHROxYkCxXp/bS7UbEylTdVRD6qwpZ5Qk..`

### Production Testing
- [ ] Visit https://tonalfocus-new.vercel.app
- [ ] Check portfolio loads with images
- [ ] Test admin login at /admin
- [ ] Upload a test photo
- [ ] Verify it appears in portfolio
- [ ] Test contact form

## 🔧 Troubleshooting

### Admin Login Not Working?
1. **Local:** Check `.env.local` has correct `ADMIN_PASSWORD_HASH`
2. **Production:** Verify hash is added to Vercel env vars
3. **Both:** Username is `admin`, password is `tonalfocus2025`

### Portfolio Not Loading?
1. Check Supabase dashboard for photos table
2. Verify all env vars are set in Vercel
3. Check browser console for errors

### Images Not Displaying?
1. Check Supabase Storage bucket is public
2. Verify image URLs in database are correct
3. Check CORS settings in Supabase

## 📱 Contact Info for Issues
- Supabase Dashboard: https://app.supabase.com
- Vercel Dashboard: https://vercel.com/dan-blandballads-projects/tonalfocus-new
- GitHub Repo: https://github.com/dchayes27/tonalfocus-new

## 🎉 Ready for Launch!
Once all boxes are checked, your portfolio is ready for production use.
