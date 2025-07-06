# 🚀 Deployment Guide - KushalWear

This guide will help you deploy the KushalWear e-commerce platform to various hosting platforms.

## 📋 Prerequisites

Before deployment, ensure you have:
- Node.js (v14 or higher)
- MongoDB database (local or cloud)
- Git repository access
- Environment variables configured

## 🌐 Deployment Options

### 1. Heroku Deployment

#### Setup
1. **Create Heroku account** and install Heroku CLI
2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create kushalwear-app
   ```

4. **Add MongoDB addon**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-production-secret-key
   heroku config:set NODE_ENV=production
   ```

6. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

7. **Run database setup**
   ```bash
   heroku run node scripts/setup-db.js
   heroku run node scripts/create-admin.js
   ```

#### Heroku Configuration
- **Buildpack**: Node.js (auto-detected)
- **Port**: Heroku assigns automatically
- **Database**: MongoDB Atlas (recommended for production)

### 2. Vercel Deployment

#### Setup
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Create vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   ```

### 3. Railway Deployment

#### Setup
1. **Connect GitHub repository** to Railway
2. **Add environment variables** in Railway dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

3. **Deploy automatically** from GitHub

### 4. DigitalOcean App Platform

#### Setup
1. **Create DigitalOcean account**
2. **Connect GitHub repository**
3. **Configure app settings**:
   - **Source**: GitHub repository
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`

4. **Add environment variables**:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas account**
2. **Create cluster** (free tier available)
3. **Set up database access**:
   - Create database user
   - Set network access (0.0.0.0/0 for all IPs)
4. **Get connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/kushalwear
   ```

### Local MongoDB (Development)

1. **Install MongoDB locally**
2. **Start MongoDB service**
3. **Use connection string**:
   ```
   mongodb://localhost:27017/kushalwear
   ```

## 🔧 Environment Variables

### Required Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kushalwear
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=3000
```

### Optional Variables
```env
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 📁 File Structure for Deployment

Ensure your deployment includes:
```
├── public/           # Static files (CSS, JS, images, HTML)
├── src/              # Backend source code
├── scripts/          # Utility scripts
├── docs/             # Documentation
├── server.js         # Main server file
├── package.json      # Dependencies
└── .env              # Environment variables (not in git)
```

## 🔒 Security Considerations

### Production Security
1. **Use HTTPS** (automatic on most platforms)
2. **Set strong JWT_SECRET**
3. **Configure CORS properly**
4. **Enable rate limiting**
5. **Use environment variables** for sensitive data

### Environment Variables Security
- Never commit `.env` files to git
- Use platform-specific secret management
- Rotate secrets regularly

## 🚀 Post-Deployment Steps

### 1. Database Initialization
```bash
# Run on deployed platform
node scripts/setup-db.js
node scripts/create-admin.js
```

### 2. Health Check
Test your deployment:
```bash
curl https://your-app-url.com/api/health
```

### 3. Admin Access
- Navigate to `/admin.html`
- Login with admin credentials:
  - Email: `admin@kushalwear.com`
  - Password: `Admin123!`

### 4. SSL Certificate
- Most platforms provide automatic SSL
- For custom domains, configure SSL certificates

## 📊 Monitoring and Logs

### Application Logs
- **Heroku**: `heroku logs --tail`
- **Vercel**: Dashboard logs
- **Railway**: Dashboard logs
- **DigitalOcean**: App platform logs

### Database Monitoring
- **MongoDB Atlas**: Built-in monitoring
- **Local MongoDB**: MongoDB Compass

## 🔄 Continuous Deployment

### GitHub Actions (Example)
```yaml
name: Deploy to Heroku
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 🐛 Troubleshooting Deployment

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json
   - Check build logs for errors

2. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check network access settings
   - Ensure database exists

3. **Static Files Not Loading**
   - Verify public directory structure
   - Check file paths in HTML files
   - Ensure static file serving is configured

4. **Environment Variables**
   - Verify all required variables are set
   - Check variable names and values
   - Restart application after changes

### Debug Commands
```bash
# Check application status
curl https://your-app-url.com/api/health

# Test database connection
node scripts/check-db.js

# Verify admin user
node scripts/check-admin.js
```

## 📈 Performance Optimization

### Production Optimizations
1. **Enable compression** (gzip)
2. **Use CDN** for static assets
3. **Implement caching** strategies
4. **Optimize images** (WebP format)
5. **Minify CSS/JS** files

### Database Optimization
1. **Create indexes** for frequently queried fields
2. **Use connection pooling**
3. **Implement caching** (Redis recommended)
4. **Monitor query performance**

## 🔄 Updates and Maintenance

### Regular Maintenance
1. **Update dependencies** regularly
2. **Monitor security advisories**
3. **Backup database** regularly
4. **Review and rotate** secrets
5. **Monitor application performance**

### Update Process
1. **Test changes** locally
2. **Deploy to staging** (if available)
3. **Deploy to production**
4. **Verify functionality**
5. **Monitor for issues**

---

**Happy Deploying! 🚀** 