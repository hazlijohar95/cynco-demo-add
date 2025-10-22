# Deployment Guide

This guide covers deploying Cynco Accounting to various platforms.

## Table of Contents

- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Supabase Edge Functions](#supabase-edge-functions)
- [Environment Variables](#environment-variables)

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   
   In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Automatic Deployments

Connect your GitHub repository in Vercel dashboard for automatic deployments on push.

## Netlify Deployment

### Using Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Using Netlify Dashboard

1. Connect your GitHub repository
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables
4. Deploy

## Self-Hosted Deployment

### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
       listen 80;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Enable gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t cynco-accounting .
   docker run -p 80:80 cynco-accounting
   ```

### Using PM2

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Build the app**
   ```bash
   npm run build
   ```

3. **Serve with PM2**
   ```bash
   pm2 serve dist 8080 --name cynco-accounting
   pm2 save
   pm2 startup
   ```

## Supabase Edge Functions

### Deploy Edge Functions

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy Functions**
   ```bash
   supabase functions deploy ai-chat
   ```

### Set Secrets

```bash
supabase secrets set GROQ_API_KEY=your_api_key
```

### Monitor Functions

```bash
# View logs
supabase functions logs ai-chat

# View metrics
supabase functions inspect ai-chat
```

## Environment Variables

### Required Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJxxx...

# Optional Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

### Setting Environment Variables

#### Local Development
Create `.env` file in project root:
```bash
cp .env.example .env
# Edit .env with your values
```

#### Production (Vercel)
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
```

#### Production (Netlify)
```bash
netlify env:set VITE_SUPABASE_URL "your_value"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "your_value"
```

## Build Optimization

### Production Build

```bash
npm run build
```

### Build Configuration

Edit `vite.config.ts` for build optimizations:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
```

## Performance Optimization

### Enable Compression

Most platforms enable gzip/brotli automatically. For custom setups:

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

**Express:**
```javascript
const compression = require('compression');
app.use(compression());
```

### CDN Configuration

Use a CDN for static assets:

**Cloudflare:**
1. Add your domain to Cloudflare
2. Enable Auto Minify (JS, CSS, HTML)
3. Enable Brotli compression
4. Set caching rules

### Analytics

Add analytics to track performance:

```typescript
// Google Analytics
import ReactGA from 'react-ga4';
ReactGA.initialize('G-XXXXXXXXXX');

// Track page views
ReactGA.send({ hitType: "pageview", page: window.location.pathname });
```

## Monitoring

### Error Tracking

**Sentry:**
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

**Web Vitals:**
```bash
npm install web-vitals
```

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Security

### HTTPS

Always use HTTPS in production. Most platforms (Vercel, Netlify) provide this automatically.

### Security Headers

Add security headers:

**Netlify (_headers file):**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Rollback Strategy

### Version Rollback

**Vercel:**
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote deployment-url
```

**Netlify:**
```bash
# Rollback to previous deployment
netlify rollback
```

### Database Migrations

For future database deployments:
1. Always backup data before migrations
2. Test migrations in staging first
3. Have rollback scripts ready
4. Monitor post-deployment

## Troubleshooting

### Build Failures

**Issue:** Build fails with dependency errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue:** Environment variables not loading
- Verify variables are set in platform dashboard
- Check variable names (VITE_ prefix required for Vite)
- Rebuild after adding variables

### Runtime Errors

**Issue:** Edge functions not working
- Check function is deployed: `supabase functions list`
- Verify secrets are set: `supabase secrets list`
- Check logs: `supabase functions logs ai-chat`

## Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Edge functions deployed
- [ ] API keys secured
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Performance monitoring active
- [ ] Security headers set
- [ ] HTTPS enabled
- [ ] Backup strategy in place

---

*For questions or issues with deployment, please open an issue on GitHub.*
