# 🚀 LKHN Hackathon Platform - Deployment Guide

This guide will help you deploy your LKHN Technologies Hackathon Platform using Supabase and Vercel.

## 📋 Prerequisites

Before deploying, ensure you have:

- **Node.js 16+** installed locally
- **Git** installed and configured
- **Supabase account** ([signup here](https://supabase.com))
- **Vercel account** ([signup here](https://vercel.com))
- **Google OAuth credentials** (for Google sign-in)
- **Resend account** (optional, for email confirmations)

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization and set:
   - **Name**: `lkhn-hackathon`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### Step 2: Configure Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the complete schema from `supabase/schema.sql`:

```sql
-- Copy and paste the entire contents of supabase/schema.sql
-- This will create all tables, indexes, triggers, and RLS policies
```

### Step 3: Configure Authentication

1. Go to **Authentication > Settings**
2. Configure **Site URL**: `https://your-domain.com` (or localhost for development)
3. Add **Redirect URLs**:
   - `https://your-domain.com/**`
   - `http://localhost:3000/**` (for development)

### Step 4: Enable Google OAuth

1. Go to **Authentication > Providers**
2. Enable **Google**
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

#### Getting Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials > Create Credentials > OAuth 2.0 Client ID**
5. Set **Authorized redirect URIs**:
   - `https://your-supabase-url.supabase.co/auth/v1/callback`

### Step 5: Configure Row Level Security

The RLS policies are already included in the schema, but verify they're enabled:

1. Go to **Table Editor**
2. Check that RLS is enabled for:
   - `users` table
   - `projects` table
   - `user_projects` table

## 🌐 Frontend Deployment (Vercel)

### Step 1: Environment Variables

Create `.env.local` in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Email service
VITE_RESEND_API_KEY=your-resend-api-key

# Optional: Analytics
VITE_APP_ENV=production
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Add environment variables during deployment
# or add them in Vercel dashboard later
```

#### Option B: GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **New Project**
4. Import your GitHub repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables in Vercel dashboard

### Step 3: Configure Vercel Environment Variables

In your Vercel project dashboard:

1. Go to **Settings > Environment Variables**
2. Add all variables from your `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RESEND_API_KEY` (optional)
   - `VITE_APP_ENV=production`

## 📧 Email Confirmations (Supabase Edge Functions)

### Step 1: Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login
```

### Step 2: Deploy Edge Functions

```bash
# Deploy the email confirmation function
supabase functions deploy send-confirmation-email

# Set environment variables for Edge Function
supabase secrets set RESEND_API_KEY=your-resend-api-key
supabase secrets set SITE_URL=https://your-domain.com
```

### Step 3: Configure Resend (Optional)

1. Sign up at [Resend](https://resend.com)
2. Get your API key
3. Verify your domain or use their test domain
4. Add the API key to Supabase secrets (step 2 above)

## 🔒 Security Configuration

### Supabase Security Checklist

- ✅ **RLS Enabled**: All tables have Row Level Security enabled
- ✅ **API Keys**: Only use the `anon` key in frontend code
- ✅ **CORS**: Configure allowed origins in Supabase
- ✅ **Email Verification**: Consider enabling email confirmation
- ✅ **Rate Limiting**: Monitor and configure rate limits

### Environment Security

- ✅ **Never commit**: `.env.local` files to version control
- ✅ **Use**: Environment variables for all sensitive data
- ✅ **Rotate**: API keys regularly
- ✅ **Monitor**: Usage and errors in dashboards

## 📊 Monitoring and Analytics

### Supabase Monitoring

1. **Dashboard Metrics**: Monitor API usage, database performance
2. **Logs**: Check Edge Function logs for errors
3. **Auth Metrics**: Track user registrations and logins

### Vercel Monitoring

1. **Analytics**: Enable Vercel Analytics for page views
2. **Performance**: Monitor Core Web Vitals
3. **Functions**: Monitor serverless function performance

## 🚀 Post-Deployment Steps

### 1. Test All Features

- ✅ User registration (email + Google OAuth)
- ✅ Project browsing and selection
- ✅ Dashboard functionality
- ✅ Email confirmations
- ✅ Real-time updates

### 2. Configure DNS (Custom Domain)

1. **Vercel**: Add custom domain in project settings
2. **Configure DNS**: Point domain to Vercel
3. **SSL**: Automatic with Vercel

### 3. Set Up Analytics

```bash
# Add Vercel Analytics
npm install @vercel/analytics

# Add to your main.jsx
import { inject } from '@vercel/analytics'
inject()
```

### 4. Performance Optimization

- **Enable**: Vercel Edge Network
- **Optimize**: Images with Vercel Image Optimization
- **Cache**: Configure cache headers
- **Bundle**: Analyze bundle size

## 🔧 Development Setup

### Local Development with Supabase

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset

# Start your app
npm run dev
```

### Environment Variables for Development

```bash
# .env.local for development
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
VITE_APP_ENV=development
```

## 🐛 Troubleshooting

### Common Issues

**Authentication not working:**
- Check redirect URLs in Supabase
- Verify environment variables
- Check browser console for errors

**Database connection issues:**
- Verify Supabase URL and key
- Check RLS policies
- Monitor Supabase logs

**Build failures:**
- Check Node.js version (16+)
- Verify all dependencies installed
- Check environment variables in Vercel

**Email confirmations not sending:**
- Verify Edge Function deployment
- Check Resend API key
- Monitor Edge Function logs

### Support Resources

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Project Issues**: [GitHub Issues](https://github.com/theCephusHasLanded/Hackathon/issues)

## 📈 Scaling Considerations

### Database Scaling

- **Read Replicas**: Add for high read loads
- **Connection Pooling**: Configure for concurrent users
- **Indexing**: Monitor slow queries and add indexes

### Application Scaling

- **Edge Functions**: Consider for compute-heavy tasks
- **CDN**: Leverage Vercel's global CDN
- **Caching**: Implement proper caching strategies

### Cost Optimization

- **Supabase**: Monitor database and auth usage
- **Vercel**: Optimize function execution time
- **Email**: Monitor email sending quotas

---

## 🎯 Success Metrics

After deployment, monitor these metrics:

- **User Registrations**: Track signup completion rate
- **Project Selections**: Monitor average projects per user
- **Page Load Speed**: Target < 2 seconds
- **Uptime**: Maintain 99.9% availability
- **Email Delivery**: Track confirmation email success rate

## 🔄 Update and Maintenance

### Regular Tasks

- **Dependencies**: Update monthly
- **Security**: Monitor for vulnerabilities
- **Performance**: Regular performance audits
- **Backups**: Ensure database backups are working
- **Monitoring**: Review metrics weekly

### Version Control

- **Feature Branches**: Use for new features
- **Staging**: Deploy to staging before production
- **Rollback**: Have rollback plan ready
- **Documentation**: Keep deployment docs updated

---

**Need Help?** Check the [troubleshooting section](#-troubleshooting) or [open an issue](https://github.com/theCephusHasLanded/Hackathon/issues).