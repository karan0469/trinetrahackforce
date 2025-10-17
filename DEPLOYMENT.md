# 🚀 Deployment Guide

## Backend Deployment Options

### Option 1: Railway (Recommended - Free Tier)

1. **Sign up** at https://railway.app

2. **Create New Project** → Deploy from GitHub

3. **Add MongoDB**:
   - Click "New" → "Database" → "MongoDB"
   - Copy the connection string

4. **Add Backend Service**:
   - Click "New" → "GitHub Repo" → Select your repo
   - Set root directory: `/backend`

5. **Set Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb://... (from Railway MongoDB)
   JWT_SECRET=your-super-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. **Deploy** - Railway will auto-deploy

7. **Copy backend URL** (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. Sign up at https://render.com
2. Create "Web Service" from GitHub
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables
7. Deploy

### Option 3: Heroku

```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create good-citizen-api

# Add MongoDB addon
heroku addons:create mongodb:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set CLOUDINARY_CLOUD_NAME=...
# ... (add all env vars)

# Deploy
git push heroku main
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Sign up** at https://vercel.com

2. **Import Project** from GitHub

3. **Configure**:
   - Framework: Create React App
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `build`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

5. **Deploy** - Vercel auto-deploys on git push

6. **Custom Domain** (Optional):
   - Add your domain in Vercel settings
   - Update DNS records

### Option 2: Netlify

1. Sign up at https://netlify.com
2. "New site from Git"
3. Select repository
4. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
5. Add environment variable: `REACT_APP_API_URL`
6. Deploy

### Option 3: GitHub Pages

```bash
cd frontend

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/good-citizen",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

## Database Setup

### MongoDB Atlas (Free Tier)

1. **Sign up** at https://www.mongodb.com/cloud/atlas

2. **Create Cluster**:
   - Choose free tier (M0)
   - Select region closest to you
   - Create cluster

3. **Create Database User**:
   - Database Access → Add New User
   - Choose password authentication
   - Save credentials

4. **Whitelist IP**:
   - Network Access → Add IP Address
   - Allow access from anywhere (0.0.0.0/0) for development
   - Restrict in production

5. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Use in backend environment variables

## Image Storage (Cloudinary)

1. **Sign up** at https://cloudinary.com (Free tier: 25GB)

2. **Get Credentials**:
   - Dashboard → Account Details
   - Copy Cloud Name, API Key, API Secret

3. **Add to Backend .env**:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

## Email Setup (Gmail)

1. **Enable 2FA** on Gmail account

2. **Generate App Password**:
   - Google Account → Security → 2-Step Verification
   - App passwords → Select app: Mail, device: Other
   - Copy 16-character password

3. **Add to Backend .env**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

## Production Checklist

### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (random 32+ characters)
- [ ] Configure CORS for frontend domain only
- [ ] Enable rate limiting
- [ ] Set up MongoDB indexes
- [ ] Configure error logging (e.g., Sentry)
- [ ] Set up monitoring (e.g., UptimeRobot)
- [ ] Regular database backups
- [ ] SSL/HTTPS enabled

### Frontend
- [ ] Update API URL to production
- [ ] Remove console.logs
- [ ] Optimize images
- [ ] Enable production build
- [ ] Configure CDN (automatic on Vercel/Netlify)
- [ ] Add meta tags for SEO
- [ ] Set up analytics (Google Analytics)
- [ ] Test on multiple devices
- [ ] Lighthouse score > 90

### Security
- [ ] Environment variables properly set
- [ ] No secrets in code
- [ ] HTTPS everywhere
- [ ] Secure headers (Helmet.js)
- [ ] Input validation
- [ ] Rate limiting
- [ ] CORS configured
- [ ] MongoDB user has limited permissions

## Post-Deployment

### Testing
```bash
# Test API
curl https://your-api.railway.app/api/health

# Test frontend
# Open browser to your frontend URL
# Create account, make report, verify as admin
```

### Monitoring
- Set up UptimeRobot for uptime monitoring
- Configure Sentry for error tracking
- Add Google Analytics for usage stats
- Monitor MongoDB performance

### Maintenance
- Weekly database backups
- Monthly dependency updates
- Security patch monitoring
- Performance optimization

## Cost Estimate

### Free Tier Setup:
- Railway: Free (500 hours/month)
- Vercel: Free (unlimited)
- MongoDB Atlas: Free (512MB)
- Cloudinary: Free (25GB storage, 25GB bandwidth)
- Total: **$0/month**

### Paid Setup (Recommended for production):
- Railway: $5/month (unlimited hours)
- Vercel Pro: $20/month (custom domain, analytics)
- MongoDB Atlas: $9/month (2GB storage)
- Cloudinary: $0-89/month (based on usage)
- Total: **~$35-114/month**

## Troubleshooting

### Backend not responding
- Check logs on Railway/Render
- Verify MongoDB connection string
- Check environment variables
- Test API endpoint directly

### Frontend can't connect to backend
- Verify REACT_APP_API_URL
- Check CORS settings on backend
- Ensure backend is deployed and running
- Check browser console for errors

### Images not uploading
- Verify Cloudinary credentials
- Check file size limits
- Ensure Multer is configured
- Check backend logs

---

**Need Help?** Check hosting provider documentation or create an issue!
