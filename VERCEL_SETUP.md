# 🚀 Hướng dẫn Setup Vercel cho ChillPomodoro

## 🎯 Tại sao Vercel?

- ✅ **Miễn phí** cho personal projects
- ✅ **Tự động deploy** khi push GitHub
- ✅ **Fast global CDN**
- ✅ **Preview URLs** cho mỗi commit
- ✅ **Easy rollback**
- ✅ **Analytics** (optional)
- ✅ **Zero config** cho Vite/React

---

## 📋 Setup lần đầu (15 phút)

### Bước 1: Tạo tài khoản Vercel

1. Vào https://vercel.com
2. Click "Sign Up"
3. **Chọn "Continue with GitHub"** ← Quan trọng!
4. Authorize Vercel

**Kết quả:** Vercel được kết nối với GitHub của bạn

---

### Bước 2: Push code lên GitHub (nếu chưa)

```bash
# Tại folder ChillPorodomo

# 1. Init git (nếu chưa)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit"

# 4. Tạo repo trên GitHub
# Vào github.com → New repository
# Tên: ChillPorodomo
# Public hoặc Private (cả 2 đều OK)

# 5. Add remote
git remote add origin https://github.com/[username]/ChillPorodomo.git

# 6. Push
git branch -M main
git push -u origin main
```

**Kiểm tra:** Code đã có trên GitHub ✅

---

### Bước 3: Import vào Vercel

#### Cách 1: Web UI (Dễ nhất)

1. Vào https://vercel.com/dashboard
2. Click "**Add New...**" → "**Project**"
3. Chọn repository **ChillPorodomo**
4. Vercel tự động detect:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "**Deploy**"

**Đợi 1-2 phút... 🕐**

6. Done! 🎉
   - Production URL: `https://chillporodomo.vercel.app`
   - Hoặc: `https://chillporodomo-[random].vercel.app`

#### Cách 2: CLI (Advanced)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login
# → Mở browser để authorize

# 3. Deploy
cd D:\Development\Projects\ChillPorodomo
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - Project name? chillporodomo
# - Directory? ./
# - Want to override settings? N

# 4. Deploy production
vercel --prod
```

**Kết quả:** Same như Cách 1

---

### Bước 4: Custom Domain (Optional)

Nếu có domain riêng (vd: chillpomodoro.com):

1. Vercel Dashboard → Project → Settings
2. **Domains** tab
3. Add domain: `chillpomodoro.com`
4. Follow instructions để update DNS
5. Wait for DNS propagation (5-30 phút)

**Lợi ích:**
- Professional URL
- SEO tốt hơn
- Branding

---

## 🔄 Workflow sau khi setup

### Deploy tự động (Khuyến nghị ⭐)

```bash
# Mỗi khi có thay đổi:

# 1. Commit
git add .
git commit -m "Add new feature"

# 2. Push
git push

# 3. Vercel tự động:
# - Detect push
# - Build project
# - Deploy lên production
# - Gửi email thông báo
# - Update URL

# → Không làm gì thêm! 🎉
```

**Timeline:**
```
Push → 10s → Build starts
      → 1-2 phút → Build completes
      → 5s → Deploy to CDN
      → Done! Production updated
```

### Deploy manual

```bash
# Nếu muốn control thủ công:

vercel          # Deploy preview
vercel --prod   # Deploy production
```

---

## 📊 Monitoring & Management

### View Deployments

1. Vercel Dashboard
2. Click project **ChillPorodomo**
3. Tab "**Deployments**"

**Thấy:**
- Tất cả deployments
- Status (Success/Failed)
- Commit message
- Preview URLs
- Logs

### View Logs

```bash
# CLI
vercel logs [deployment-url]

# Hoặc Web UI
# Click deployment → View Function Logs
```

### Analytics (Optional)

1. Project Settings → Analytics
2. Enable Analytics
3. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

---

## 🎯 Features hay của Vercel

### 1. Preview Deployments

```
Mỗi pull request tạo preview URL:

PR #1: https://chillpomodoro-git-feature-1.vercel.app
PR #2: https://chillpomodoro-git-feature-2.vercel.app

→ Test trước khi merge!
```

### 2. Instant Rollback

```
Deployment có lỗi?
→ Click deployment trước
→ "Promote to Production"
→ Done in 5 seconds!
```

### 3. Environment Variables

```
Settings → Environment Variables
Add:
- API_KEY
- DATABASE_URL
- etc.

→ Secure, không commit vào git
```

### 4. Redirects & Headers

```
// vercel.json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## 🔧 Troubleshooting

### Build Failed

**Check build logs:**
```
Vercel Dashboard → Deployment → Build Logs
```

**Common issues:**
```
1. Node version mismatch
   → Add to package.json:
   "engines": {
     "node": "18.x"
   }

2. Missing dependencies
   → npm install [package]
   → git push

3. Environment variables
   → Add in Vercel settings
```

### Site not updating

**Solutions:**
```
1. Hard refresh browser
   Ctrl+Shift+R (Windows)
   Cmd+Shift+R (Mac)

2. Check deployment status
   Vercel Dashboard

3. Purge cache
   Deployment → ... → Redeploy
```

### Domain not working

**Check:**
```
1. DNS propagation
   → Use https://dnschecker.org

2. SSL certificate
   → Auto-issued by Vercel (wait 1-2 hours)

3. Domain settings
   → Verify DNS records
```

---

## 🎓 Best Practices

### 1. Branch Strategy

```
main → Production (auto-deploy)
develop → Preview (manual review)
feature/* → Preview URLs
```

### 2. Commit Messages

```
Good:
✓ "feat: Add volume control"
✓ "fix: IndexedDB saving issue"
✓ "docs: Update README"

Bad:
✗ "update"
✗ "fix bug"
✗ "changes"
```

### 3. Review before push

```
Checklist:
□ Test local (npm run dev)
□ Build OK (npm run build)
□ Preview OK (npm run preview)
□ No console errors
□ Features working
→ Then push!
```

### 4. Use .env for secrets

```
// .env.local (NOT committed)
VITE_API_KEY=secret123

// Vercel Settings → Environment Variables
Add same variables

// Code
const apiKey = import.meta.env.VITE_API_KEY
```

---

## 📊 Vercel Dashboard Guide

### Overview Tab
- Deployment status
- Production URL
- Visitors count
- Git commits

### Deployments Tab
- All deployments list
- Click to view details
- Promote/rollback
- View logs

### Settings Tab
- **General**: Project name, framework
- **Domains**: Add custom domains
- **Git**: Branch settings, auto-deploy
- **Environment Variables**: Secrets
- **Functions**: Serverless functions (advanced)

---

## 🚀 Advanced: GitHub Actions

Tự động test trước khi deploy:

```yaml
# .github/workflows/deploy.yml

name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test  # Nếu có tests
      
      - name: Build
        run: npm run build
      
      # Vercel tự động deploy sau khi tests pass
```

---

## 💰 Pricing

### Free Plan (Hobby)
```
✓ Unlimited deployments
✓ Automatic HTTPS
✓ Global CDN
✓ Preview deployments
✓ Analytics (basic)
✓ 100GB bandwidth/month
✓ Serverless functions

→ Đủ cho ChillPomodoro! ✅
```

### Pro Plan ($20/month)
```
+ Advanced analytics
+ Team collaboration
+ Password protection
+ More bandwidth
+ Priority support

→ Không cần thiết lúc này
```

---

## ✅ Setup Checklist

- [ ] Tạo tài khoản Vercel
- [ ] Connect với GitHub
- [ ] Push code lên GitHub
- [ ] Import project vào Vercel
- [ ] First deployment success
- [ ] Kiểm tra production URL
- [ ] Test auto-deploy (push 1 commit)
- [ ] Bookmark Vercel dashboard
- [ ] (Optional) Setup custom domain
- [ ] (Optional) Enable analytics

---

## 📞 Support

### Vercel Docs
https://vercel.com/docs

### Vercel Support
- Free plan: Community forum
- Pro plan: Email support

### ChillPomodoro Issues
- Check TROUBLESHOOTING.md
- Review build logs
- Test local first

---

**Deploy thành công rồi? 🎉**

**Share link với bạn bè và enjoy! 🚀**

URL: `https://chillpomodoro.vercel.app`

