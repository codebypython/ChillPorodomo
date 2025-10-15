# 🚀 Hướng dẫn Deploy ChillPomodoro

## Phương pháp 1: Vercel (Khuyến nghị ⭐)

Vercel là nền tảng tốt nhất cho React apps, miễn phí và cực kỳ đơn giản.

### Cách 1: Deploy qua GitHub (Tự động)

1. **Tạo repository trên GitHub**
   - Vào https://github.com/new
   - Tạo repository mới (public hoặc private)

2. **Push code lên GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/[username]/ChillPorodomo.git
   git push -u origin main
   ```

3. **Deploy trên Vercel**
   - Vào https://vercel.com
   - Click "New Project"
   - Import repository từ GitHub
   - Click "Deploy"
   - Xong! 🎉

Vercel sẽ tự động deploy lại mỗi khi bạn push code mới.

### Cách 2: Deploy qua CLI

```bash
# Cài Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

**URL của bạn**: `https://[project-name].vercel.app`

---

## Phương pháp 2: Netlify

### Cách 1: Drag & Drop

1. Build project:
   ```bash
   npm run build
   ```

2. Vào https://app.netlify.com/drop

3. Kéo thả thư mục `dist` vào

**URL của bạn**: `https://[random-name].netlify.app`

### Cách 2: Netlify CLI

```bash
# Cài Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy production
netlify deploy --prod
```

---

## Phương pháp 3: GitHub Pages

1. **Cập nhật `vite.config.js`**:
   ```js
   export default defineConfig({
     base: '/ChillPorodomo/',
     plugins: [react()],
     // ...
   })
   ```

2. **Thêm vào `package.json`**:
   ```json
   {
     "homepage": "https://[username].github.io/ChillPorodomo",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Cài đặt gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Cấu hình GitHub Pages**:
   - Vào Settings > Pages
   - Source: `gh-pages` branch
   - Save

**URL của bạn**: `https://[username].github.io/ChillPorodomo`

---

## Phương pháp 4: Firebase Hosting

1. **Cài Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**:
   ```bash
   firebase login
   ```

3. **Init Firebase**:
   ```bash
   firebase init hosting
   ```
   - Public directory: `dist`
   - Single-page app: `Yes`
   - GitHub deploys: `No`

4. **Build và Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

**URL của bạn**: `https://[project-id].web.app`

---

## Phương pháp 5: Render

1. Vào https://render.com

2. Click "New" > "Static Site"

3. Connect GitHub repository

4. Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

5. Click "Create Static Site"

**URL của bạn**: `https://[project-name].onrender.com`

---

## So sánh các phương pháp

| Nền tảng | Miễn phí | Tự động deploy | Tốc độ | Khuyến nghị |
|----------|----------|----------------|--------|-------------|
| Vercel | ✅ | ✅ | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| Netlify | ✅ | ✅ | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| GitHub Pages | ✅ | ✅ | ⚡⚡ | ⭐⭐⭐⭐ |
| Firebase | ✅ | ⚠️ | ⚡⚡⚡ | ⭐⭐⭐ |
| Render | ✅ | ✅ | ⚡⚡ | ⭐⭐⭐ |

---

## Troubleshooting

### Lỗi: Routes không hoạt động

Đảm bảo có file redirect rules:
- Vercel: `vercel.json` ✅
- Netlify: `netlify.toml` ✅
- GitHub Pages: Sử dụng HashRouter thay vì BrowserRouter

### Lỗi: GIF không chạy trên mobile

- Đã được xử lý trong CSS với `transform: translateZ(0)` ✅

### Lỗi: Audio không phát

- Trình duyệt yêu cầu user interaction trước khi phát audio
- Đảm bảo user đã click "Bắt đầu" ✅

---

## Custom Domain

### Vercel
1. Settings > Domains
2. Thêm domain của bạn
3. Cập nhật DNS records theo hướng dẫn

### Netlify
1. Domain settings > Add custom domain
2. Cập nhật DNS records

### GitHub Pages
1. Settings > Pages > Custom domain
2. Thêm file `CNAME` với nội dung là domain của bạn

---

**Chúc bạn deploy thành công! 🚀**

