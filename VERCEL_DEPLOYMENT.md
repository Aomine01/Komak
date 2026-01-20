# Deploying to Vercel - Step-by-Step Guide

## 🎯 Prerequisites

- ✅ GitHub repository created: https://github.com/Amin0001/Komak
- ✅ Supabase project set up with database table
- ✅ Code ready for deployment

---

## 📋 Step 1: Push to GitHub

```bash
# Navigate to your project
cd c:\Users\SHAROFIDDIN\Desktop\Komak

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production-ready KO'MAK LOYIHASI"

# Add remote (your repo)
git remote add origin https://github.com/Amin0001/Komak.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to **https://vercel.com**
2. Click **"Add New"** → **"Project"**
3. **Import** your GitHub repository: `Amin0001/Komak`
4. Vercel will auto-detect it's a Vite project
5. **Configure** the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

6. **Add Environment Variables**:
   - Click **"Environment Variables"**
   - Add:
     ```
     VITE_SUPABASE_URL = https://tbfajuryfbbiqpykzvra.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

7. Click **"Deploy"**

8. Wait 1-2 minutes for deployment

9. Your app will be live at: `https://komak.vercel.app` (or similar)

### Option B: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Follow the prompts and add environment variables when asked.

---

## ⚙️ Step 3: Configure Environment Variables in Vercel

If you didn't add them during setup:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://tbfajuryfbbiqpykzvra.supabase.co`
   - Environment: **Production**, **Preview**, **Development** (check all)

4. Add:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your full Supabase anon key
   - Environment: **Production**, **Preview**, **Development** (check all)

5. Click **Save**

6. Click **"Redeploy"** to apply the new variables

---

## ✅ Step 4: Verify Deployment

1. Visit your deployment URL
2. Fill out the form with test data
3. Submit and verify:
   - Success message appears
   - Data shows up in Supabase Table Editor
   - Cooldown timer activates

---

## 🔄 Future Updates

Every time you push to GitHub:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will **automatically redeploy** your app! 🎉

---

## 🐛 Troubleshooting

### Build Fails

- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Make sure `.env` is in `.gitignore` (don't commit it!)

### Form Not Working After Deployment

- Verify environment variables are set in Vercel
- Check Vercel Function Logs for errors
- Verify Supabase RLS policies allow anonymous INSERT

### 404 Error

- Check that build output directory is `dist`
- Verify Vite config is correct

---

## 📊 Monitoring

- **Analytics**: Enable Vercel Analytics in project settings
- **Logs**: View real-time logs in Vercel Dashboard
- **Supabase**: Monitor submissions in Table Editor

---

## 🎯 Custom Domain (Optional)

1. In Vercel project settings
2. Go to **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

---

**Need help?** Check Vercel documentation or Supabase docs.
