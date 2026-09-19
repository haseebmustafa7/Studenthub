# StudentHub - Deployment Guide

This guide covers deploying StudentHub to free-tier hosting services.

## Prerequisites

- GitHub account
- Supabase project (already set up)
- Vercel account (for frontend)
- Render account (for backend)

## Part 1: Prepare for Deployment

### 1. Update Backend for Production

Ensure `backend/src/server.js` has proper error handling and production settings.

### 2. Update Frontend API URL

After deploying the backend, update `frontend/.env`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - StudentHub"
git branch -M main
git remote add origin https://github.com/yourusername/studenthub.git
git push -u origin main
```

## Part 2: Deploy Backend (Render)

### Steps:

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository

3. **Configure Service**
   ```
   Name: studenthub-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**
   - Click "Environment" tab
   - Add all variables from `backend/.env`:
     ```
     PORT=5000
     NODE_ENV=production
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_KEY=your_service_key
     SUPABASE_JWT_SECRET=your_jwt_secret
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://studenthub-backend-xxxx.onrender.com`

### Notes:
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free

## Part 3: Deploy Frontend (Vercel)

### Steps:

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add variables from `frontend/.env`:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     VITE_API_URL=https://studenthub-backend-xxxx.onrender.com/api
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your site: `https://studenthub.vercel.app`

### Notes:
- Automatic deployments on git push
- Free SSL certificate
- Unlimited bandwidth
- 100GB free per month

## Part 4: Update CORS in Backend

After frontend deployment, update backend environment variable:

1. Go to Render dashboard
2. Select your backend service
3. Environment → Edit `CORS_ORIGIN`
4. Set to: `https://your-frontend-url.vercel.app`
5. Save (auto-redeploys)

## Part 5: Update Supabase Settings

### 1. Add Redirect URLs

In Supabase dashboard:
- Go to **Authentication** → **URL Configuration**
- Add Site URL: `https://your-frontend-url.vercel.app`
- Add Redirect URLs:
  ```
  https://your-frontend-url.vercel.app
  https://your-frontend-url.vercel.app/**
  ```

### 2. Update Database Connection (if needed)

Your connection strings remain the same since Supabase is already hosted.

## Part 6: Test Production Deployment

### Checklist:

- [ ] Frontend loads successfully
- [ ] Can register a new student account
- [ ] Can login with student account
- [ ] Can login with admin account
- [ ] Can browse jobs
- [ ] Can view job details
- [ ] Can apply to jobs (student)
- [ ] Can post new jobs (admin)
- [ ] Can edit jobs (admin)
- [ ] Can manage applications (admin)
- [ ] Mobile responsive on all pages
- [ ] All API calls work
- [ ] No console errors

## Part 7: Custom Domain (Optional)

### Vercel Custom Domain

1. Go to project settings in Vercel
2. Domains → Add Domain
3. Enter your domain (e.g., `studenthub.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (a few hours)

### Render Custom Domain

1. Go to service settings in Render
2. Custom Domain → Add Custom Domain
3. Configure DNS records
4. SSL automatically provisioned

## Monitoring & Maintenance

### Vercel Analytics (Free)
- Automatically enabled
- View in Vercel dashboard
- Page views, performance metrics

### Render Logs
- View in Render dashboard
- Real-time logs
- Error tracking

### Supabase Monitoring
- Database size usage
- API requests
- Auth users
- Free tier limits:
  - 500MB database
  - 2GB file storage
  - 50,000 monthly active users

## Troubleshooting Deployment

### Frontend Not Loading
- Check environment variables in Vercel
- Verify build completed successfully
- Check browser console for errors
- Ensure `VITE_API_URL` is correct

### Backend Not Responding
- Check Render logs for errors
- Verify environment variables
- Ensure service is running (not sleeping)
- Check CORS_ORIGIN matches frontend URL

### Database Connection Errors
- Verify Supabase project is active
- Check SUPABASE_URL and keys
- Review Row Level Security policies
- Check Supabase logs

### CORS Errors
- Update `CORS_ORIGIN` in backend
- Redeploy backend service
- Clear browser cache

## Scaling (Future)

### When You Outgrow Free Tier:

**Render Paid Plans** ($7/month):
- No sleeping
- Faster CPUs
- More memory

**Vercel Pro** ($20/month):
- More bandwidth
- Faster builds
- Team features

**Supabase Pro** ($25/month):
- 8GB database
- 100GB file storage
- Daily backups
- No pausing

## Continuous Deployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

1. Push code to GitHub
2. Services auto-detect changes
3. Automatic build and deploy
4. Zero downtime deployments

### Development Workflow

```bash
# Feature development
git checkout -b feature/new-feature
# Make changes
git commit -m "Add new feature"
git push origin feature/new-feature

# After testing
git checkout main
git merge feature/new-feature
git push origin main
# Automatic deployment triggers
```

## Production Environment Variables

### Backend (.env.production)
```env
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=xxx
SUPABASE_JWT_SECRET=xxx
CORS_ORIGIN=https://studenthub.vercel.app
```

### Frontend (.env.production)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_API_URL=https://studenthub-backend.onrender.com/api
```

## Security Checklist for Production

- [ ] All environment variables set correctly
- [ ] No secrets in GitHub repository
- [ ] CORS configured properly
- [ ] HTTPS enabled (automatic with Vercel/Render)
- [ ] Supabase RLS policies enabled
- [ ] Rate limiting active
- [ ] Helmet security headers enabled
- [ ] Input validation on all forms
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection

## Backup Strategy

### Supabase Backups (Free Tier)
- Automatic daily backups (7 days retention)
- Manual backups available in dashboard

### Code Backups
- GitHub repository (primary)
- Local development copies

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Issues**: For your repository

## Cost Summary (Free Tier)

| Service | Cost | Limits |
|---------|------|--------|
| Vercel | Free | 100GB bandwidth/month |
| Render | Free | 750 hours/month, sleeps after 15 min |
| Supabase | Free | 500MB DB, 2GB storage |
| **Total** | **$0/month** | Sufficient for 100+ active users |

## Next Steps After Deployment

1. **Add Sample Jobs** as admin
2. **Test All Features** thoroughly
3. **Monitor Performance** in dashboards
4. **Collect User Feedback**
5. **Iterate and Improve**

---

**Congratulations!** Your StudentHub platform is now live and accessible worldwide! 🎉
