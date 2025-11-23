# Deployment Guide

## Deploy to Netlify

### Using Netlify CLI

1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize Netlify for your project:
```bash
netlify init
```

4. Deploy your site:
```bash
netlify deploy --prod
```

### Using Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `Rokkrs/mywebsite`
4. Build settings (auto-detected from netlify.toml):
   - Build command: `pnpm build`
   - Publish directory: `dist`
5. Click "Deploy site"

## Configure Custom Domain

### Step 1: Add Domain to Netlify

1. Go to your site dashboard on Netlify
2. Click on **"Domain settings"**
3. Click **"Add custom domain"**
4. Enter your domain name (e.g., `yourname.com`)
5. Click **"Verify"** and then **"Add domain"**

### Step 2: Configure DNS

You have two options:

#### Option A: Use Netlify DNS (Recommended - Easiest)

1. In Netlify, go to **Domain settings** → **DNS**
2. Click **"Set up Netlify DNS"**
3. Netlify will show you the nameservers (e.g., `dns1.p01.nsone.net`)
4. Go to your domain registrar (GoDaddy, Namecheap, etc.)
5. Update the nameservers to the ones Netlify provided
6. Wait for DNS propagation (can take up to 48 hours, usually much faster)

#### Option B: Use External DNS

Add these records at your domain registrar:

**For apex domain (yourname.com):**
- Type: `A`
- Name: `@`
- Value: `75.2.60.5` (Netlify's load balancer)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `your-site-name.netlify.app`

**Or use ALIAS/ANAME record (if supported):**
- Type: `ALIAS` or `ANAME`
- Name: `@`
- Value: `your-site-name.netlify.app`

### Step 3: Enable HTTPS

1. After DNS is configured, go to **Domain settings** in Netlify
2. Scroll to **HTTPS** section
3. Click **"Verify DNS configuration"**
4. Click **"Provision certificate"**
5. Netlify will automatically provision a free Let's Encrypt SSL certificate

### Step 4: Force HTTPS (Recommended)

1. In **Domain settings** → **HTTPS**
2. Enable **"Force HTTPS"** to redirect all HTTP traffic to HTTPS

## Automatic Deployments

Netlify automatically deploys your site when you push to the `main` branch on GitHub.

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Your site will rebuild and deploy automatically!

## Useful Commands

```bash
# Start local dev server
pnpm dev

# Build for production locally
pnpm build

# Preview production build locally
pnpm preview

# Deploy to Netlify (if using CLI)
netlify deploy --prod
```

## Environment Variables (if needed)

If you need to add environment variables:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add your variables (e.g., API keys)

## Branch Previews

Netlify can create preview deployments for pull requests:

1. Go to **Site settings** → **Build & deploy** → **Deploy contexts**
2. Enable **Deploy previews**
3. Now every PR will get a unique preview URL

## Troubleshooting

### Build fails
- Check the deploy log in Netlify dashboard
- Ensure `netlify.toml` is correctly configured
- Verify all dependencies are in `package.json`

### Domain not working
- Wait for DNS propagation (use [whatsmydns.net](https://www.whatsmydns.net))
- Verify DNS records are correct
- Check Netlify domain settings

### HTTPS not working
- Ensure DNS is fully propagated
- Try reprovisioning the certificate
- Check that CAA records allow Let's Encrypt

