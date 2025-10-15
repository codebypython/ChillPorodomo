# 🔄 Hướng dẫn cập nhật dự án ChillPomodoro

## 🎯 Quy trình cập nhật hoàn chỉnh

Khi bạn thay đổi code, làm theo các bước sau để người dùng luôn dùng phiên bản mới nhất:

---

## 📋 Bước 1: Chuẩn bị trước khi cập nhật

### 1.1. Test local

```bash
# Chạy dev server để test
npm run dev

# Mở http://localhost:3000
# Test tất cả tính năng
```

### 1.2. Build production

```bash
# Build để kiểm tra lỗi
npm run build

# Preview production build
npm run preview

# Mở http://localhost:4173
# Test lại một lần nữa
```

### 1.3. Kiểm tra lỗi

```bash
# Không có lỗi trong console
# Tất cả features hoạt động
# Mobile responsive OK
# GIF/Video phát OK
```

---

## 📦 Bước 2: Commit changes

### 2.1. Check changes

```bash
# Xem files đã thay đổi
git status

# Xem chi tiết thay đổi
git diff
```

### 2.2. Add files

```bash
# Add tất cả files
git add .

# Hoặc add từng file cụ thể
git add src/pages/FocusPage.jsx
git add README.md
```

### 2.3. Commit với message rõ ràng

```bash
git commit -m "feat: Add volume control for sound tracks"

# Hoặc commit chi tiết hơn
git commit -m "feat: Add volume control and hide timer feature

- Add volume slider for each sound track
- Add hide timer button when UI hidden
- Improve mobile responsiveness
- Update documentation"
```

**Commit message format:**

```
feat: Tính năng mới
fix: Sửa lỗi
docs: Cập nhật tài liệu
style: Format code, không ảnh hưởng logic
refactor: Tái cấu trúc code
perf: Cải thiện hiệu suất
test: Thêm/sửa tests
chore: Cập nhật dependencies, configs
```

---

## 🚀 Bước 3: Deploy lên Server

### Option 1: Vercel (Khuyến nghị ⭐)

#### Lần đầu tiên:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
# → Follow prompts
# → Chọn project name: chillpomodoro
# → Chọn framework: Vite
# → Deploy!

# Deploy production
vercel --prod
```

#### Lần sau (Update):

```bash
# Chỉ cần push code lên GitHub
git push origin main

# Vercel tự động deploy! 🎉
# Hoặc manual:
vercel --prod
```

**Kết quả:**

- URL: `https://chillpomodoro.vercel.app`
- Mỗi lần push = tự động deploy
- Preview URL cho mỗi commit
- Rollback dễ dàng

---

### Option 2: Netlify

#### Lần đầu:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy production
netlify deploy --prod
```

#### Lần sau:

```bash
# Push lên GitHub
git push origin main

# Netlify tự động deploy!
```

---

### Option 3: GitHub Pages

#### Setup lần đầu:

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Thêm vào package.json:
```

```json
{
  "homepage": "https://[username].github.io/ChillPorodomo",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

```bash
# Deploy
npm run deploy
```

#### Update lần sau:

```bash
# Commit changes
git add .
git commit -m "Update features"
git push

# Deploy
npm run deploy
```

---

## 🔄 Bước 4: Đảm bảo người dùng dùng phiên bản mới

### 4.1. Cache Busting (Tự động)

Vite tự động thêm hash vào tên file:

```
main.abc123.js  ← Hash thay đổi mỗi lần build
main.def456.js  ← Build mới = hash mới
```

→ Browser tự động tải file mới!

### 4.2. Service Worker (Optional)

Nếu muốn control cache tốt hơn, thêm PWA:

```bash
npm install vite-plugin-pwa -D
```

```javascript
// vite.config.js
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
```

### 4.3. Force reload cho user

Thêm version check:

```javascript
// src/utils/version.js
export const APP_VERSION = "2.0.0";

// Check if new version
const checkVersion = () => {
  const savedVersion = localStorage.getItem("app_version");
  if (savedVersion !== APP_VERSION) {
    localStorage.setItem("app_version", APP_VERSION);
    // Show update notification
    alert("Phiên bản mới đã cập nhật! Trang sẽ reload.");
    window.location.reload(true);
  }
};
```

---

## 📊 Bước 5: Verify deployment

### 5.1. Kiểm tra trên production

```bash
# Mở URL production
# VD: https://chillpomodoro.vercel.app

# Kiểm tra:
✓ Tất cả features hoạt động
✓ No console errors
✓ Mobile responsive
✓ GIF/Video OK
✓ IndexedDB lưu được
✓ Sounds phát được
```

### 5.2. Test cache

```bash
# Hard reload: Ctrl+Shift+R (Windows)
# Hoặc Cmd+Shift+R (Mac)

# Kiểm tra Network tab:
# - JS/CSS files có hash mới
# - Status 200 (không phải 304 cached)
```

### 5.3. Test trên devices khác

```bash
# Mobile: iOS Safari, Android Chrome
# Desktop: Chrome, Firefox, Safari, Edge
# Tablet: iPad, Android tablet
```

---

## 🤖 Automation: Deploy tự động

### Setup GitHub Actions (Vercel)

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

**Result:**
Mỗi lần push main → tự động deploy! 🚀

---

## 📝 Workflow hàng ngày

### Khi có thay đổi nhỏ:

```bash
# 1. Sửa code
# 2. Test local
npm run dev

# 3. Commit
git add .
git commit -m "fix: Bug fix"

# 4. Push
git push

# 5. Vercel tự động deploy!
# 6. Kiểm tra production sau 1-2 phút
```

### Khi có feature lớn:

```bash
# 1. Tạo branch mới
git checkout -b feature/new-feature

# 2. Develop & test
npm run dev

# 3. Commit nhiều lần
git add .
git commit -m "feat: Part 1"
git commit -m "feat: Part 2"

# 4. Merge vào main
git checkout main
git merge feature/new-feature

# 5. Push
git push

# 6. Deploy tự động!
```

---

## 🎯 Checklist trước mỗi deployment

- [ ] Code chạy OK trên local (`npm run dev`)
- [ ] Build thành công (`npm run build`)
- [ ] Preview OK (`npm run preview`)
- [ ] Không có console errors
- [ ] Tất cả features test OK
- [ ] Mobile responsive test OK
- [ ] Commit message rõ ràng
- [ ] Push lên GitHub
- [ ] Wait for auto-deploy
- [ ] Verify trên production URL
- [ ] Test trên mobile device
- [ ] Update CHANGELOG.md nếu cần

---

## 🔢 Versioning

### Semantic Versioning:

```
2.0.0
│ │ │
│ │ └─ Patch: Bug fixes
│ └─── Minor: New features (backwards compatible)
└───── Major: Breaking changes
```

### Update version:

```json
// package.json
{
  "version": "2.1.0"  ← Update này
}
```

### Changelog:

```markdown
## [2.1.0] - 2025-10-15

### Added

- Volume control for sound tracks
- Hide timer option
- Mobile responsive improvements

### Fixed

- GIF animation on iOS
- IndexedDB saving issue
```

---

## 🚨 Rollback nếu có lỗi

### Vercel:

```bash
# Web UI: vercel.com
# → Deployments
# → Click deployment trước đó
# → Promote to Production

# Hoặc CLI:
vercel rollback [deployment-url]
```

### Git:

```bash
# Revert commit cuối
git revert HEAD

# Push
git push
# → Auto deploy version cũ
```

---

## 📱 Update notification cho users

### Option 1: Alert

```javascript
// src/App.jsx
useEffect(() => {
  const version = "2.1.0";
  const saved = localStorage.getItem("app_version");

  if (saved && saved !== version) {
    if (confirm("Phiên bản mới! Reload để cập nhật?")) {
      localStorage.setItem("app_version", version);
      window.location.reload(true);
    }
  }

  localStorage.setItem("app_version", version);
}, []);
```

### Option 2: Toast notification

```javascript
// Thêm thông báo đẹp hơn
if (newVersionAvailable) {
  showToast("Phiên bản mới đã sẵn sàng! Click để cập nhật.");
}
```

---

## 🎓 Best Practices

### 1. Test trước khi deploy

```
ALWAYS test local → build → preview → deploy
NEVER deploy trực tiếp code chưa test
```

### 2. Commit thường xuyên

```
Commit nhỏ, thường xuyên > Commit lớn, ít khi
Dễ rollback, dễ track changes
```

### 3. Branch strategy

```
main: Production code
develop: Development code
feature/*: New features
hotfix/*: Urgent fixes
```

### 4. Backup

```
GitHub = automatic backup
Vercel/Netlify = automatic backups
Local: Commit before big changes
```

### 5. Monitor

```
Check production sau mỗi deploy
Monitor error logs
User feedback
```

---

## 🔗 Quick Commands Cheat Sheet

```bash
# Development
npm run dev              # Run local
npm run build            # Build production
npm run preview          # Preview build

# Git
git status              # Check changes
git add .               # Stage all
git commit -m "msg"     # Commit
git push                # Push to GitHub

# Vercel
vercel                  # Deploy preview
vercel --prod           # Deploy production
vercel logs             # View logs

# Netlify
netlify deploy          # Deploy preview
netlify deploy --prod   # Deploy production
netlify logs            # View logs

# GitHub Pages
npm run deploy          # Deploy to gh-pages
```

---

## 📞 Support

Nếu gặp vấn đề:

1. Check build logs: `npm run build`
2. Check deployment logs trên Vercel/Netlify
3. Clear browser cache: Ctrl+Shift+R
4. Check console errors
5. Review TROUBLESHOOTING.md

---

**Happy deploying! 🚀**
