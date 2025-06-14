# 🚀 Quick Deployment Guide

## Prerequisites Checklist
- [ ] Supabase account created
- [ ] Vercel account created  
- [ ] GitHub repo: https://github.com/theCephusHasLanded/Hackathon

## 1. Supabase Setup (5 minutes)

1. **Create Project**: Go to [supabase.com](https://supabase.com) → New Project
2. **Run Schema**: Copy `supabase/schema.sql` → Run in SQL Editor
3. **Get Credentials**: Settings → API → Copy URL and anon key

## 2. Vercel Deployment (3 minutes)

1. **Import Project**: [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. **Repository**: `https://github.com/theCephusHasLanded/Hackathon`
3. **Settings**: Framework: Vite, Build: `npm run build`, Output: `dist`

## 3. Environment Variables (2 minutes)

Add in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
VITE_APP_ENV=production
```

## 4. Configure Auth Redirect (1 minute)

In Supabase → Authentication → Settings:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

## 5. Deploy! 🎉

Click "Deploy" in Vercel - your app will be live in ~2 minutes!

## Test Your Deployment

✅ Visit your Vercel URL  
✅ Try user registration  
✅ Test project selection  
✅ Check dashboard functionality  

## Optional: Custom Domain

1. Vercel Dashboard → Domains → Add Domain
2. Configure DNS records as instructed
3. SSL automatically provisioned

---

**Total Time: ~10 minutes to full deployment!**