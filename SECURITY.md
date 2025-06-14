# 🔒 Security Guidelines

## Environment Variables

### ✅ What's Safe to Share
- `VITE_SUPABASE_URL` - This is your public Supabase URL
- `VITE_SUPABASE_ANON_KEY` - This is designed to be public (client-side safe)

### ⚠️ What to Keep Secret
- Service role keys (never use in frontend)
- Database passwords
- Email service API keys
- Any keys marked as "secret" in Supabase

## Current Setup

Your `.env.local` file contains:
- ✅ **Public Supabase URL**: Safe for client-side use
- ✅ **Anon Key**: Designed for frontend, protected by RLS policies

## Row Level Security (RLS)

Your database is protected by RLS policies that ensure:
- Users can only access their own data
- Projects are read-only for all users
- User selections are private to each user

## Best Practices

1. **Never commit** `.env.local` or `.env` files
2. **Rotate keys** if accidentally exposed
3. **Use service role keys** only in backend/Edge Functions
4. **Monitor** Supabase dashboard for unusual activity
5. **Enable MFA** on your Supabase account

## Deployment Security

When deploying to Vercel:
- Environment variables are encrypted at rest
- Only build process has access to variables
- Client receives only `VITE_` prefixed variables

## Emergency Procedures

If keys are compromised:
1. Go to Supabase Dashboard > Settings > API
2. Click "Reset" on the affected key
3. Update your deployment environment variables
4. Redeploy your application

---

**Note**: The anon key in your setup is designed to be public and is protected by your database's Row Level Security policies.