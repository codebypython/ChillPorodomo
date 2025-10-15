# 🚀 Quick Start Guide - ChillPomodoro

## ⚡ Chạy dự án trong 3 bước

### Bước 1: Cài đặt
```bash
npm install
```

### Bước 2: Chạy development
```bash
npm run dev
```

### Bước 3: Mở trình duyệt
```
http://localhost:3000
```

**Xong! 🎉**

---

## 🔄 Workflow hàng ngày

### Khi bạn muốn làm việc:

```bash
# 1. Mở terminal
cd D:\Development\Projects\ChillPorodomo

# 2. Chạy dev server
npm run dev

# 3. Code và test
# Browser tự động reload khi save file!

# 4. Khi xong:
Ctrl+C để dừng server
```

---

## 📦 Khi muốn deploy

### Option A: Tự động (Khuyến nghị ⭐)

```bash
# 1. Commit changes
git add .
git commit -m "Update features"

# 2. Push lên GitHub
git push

# 3. Vercel tự động deploy!
# Check email hoặc vercel.com
```

### Option B: Manual

```bash
# 1. Build
npm run build

# 2. Deploy
npm run deploy

# Hoặc:
vercel --prod
```

---

## 🎯 Các lệnh hay dùng

```bash
# Development
npm run dev              # Chạy dev server
npm run build            # Build production
npm run preview          # Preview production build

# Deploy
npm run deploy           # Deploy production
npm run deploy:preview   # Deploy preview

# Git
git status              # Xem thay đổi
git add .               # Add all files
git commit -m "msg"     # Commit
git push                # Push lên GitHub

# Khác
npm run analyze         # Phân tích bundle size
```

---

## 📝 File structure

```
ChillPorodomo/
├── src/
│   ├── components/      # Các component tái sử dụng
│   ├── pages/          # Các trang chính
│   ├── utils/          # Utilities (storage, audio, etc)
│   ├── App.jsx         # Main app
│   └── main.jsx        # Entry point
├── public/             # Static files
├── index.html          # HTML template
├── package.json        # Dependencies
└── vite.config.js      # Vite config
```

---

## 🔧 Troubleshooting nhanh

### Lỗi: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Port 3000 đã dùng
```bash
# Đổi port trong vite.config.js
server: {
  port: 3001  // Đổi thành port khác
}
```

### Lỗi: Build failed
```bash
# Clear cache
rm -rf dist
npm run build
```

### Lỗi: Git push failed
```bash
# Check remote
git remote -v

# Re-add remote nếu cần
git remote set-url origin [your-github-url]
```

---

## 📚 Tài liệu đầy đủ

- `README.md` - Tổng quan
- `UPDATE_GUIDE.md` - 🆕 Hướng dẫn cập nhật chi tiết
- `OPTIMIZATION.md` - 🆕 Tối ưu hóa
- `DEPLOYMENT.md` - Deploy chi tiết
- `FEATURES.md` - Chi tiết tính năng
- `MOBILE_GUIDE.md` - Hướng dẫn mobile

---

## 💡 Tips

### Tip 1: Live Reload
```
Khi chạy `npm run dev`:
- Sửa code → Save
- Browser tự động reload
→ Không cần F5 manual!
```

### Tip 2: Hot Module Replacement (HMR)
```
Vite hỗ trợ HMR:
- Thay đổi React component
- Chỉ component đó re-render
- State được giữ nguyên
→ Super fast development!
```

### Tip 3: DevTools
```
F12 → Console: Xem logs
F12 → Network: Xem requests
F12 → Application: Xem LocalStorage/IndexedDB
```

### Tip 4: Multiple terminals
```
Terminal 1: npm run dev (keep running)
Terminal 2: git commands
→ Tiện hơn!
```

---

## 🎓 Học thêm

### Vite
- https://vitejs.dev
- Lightning fast build tool

### React
- https://react.dev
- UI library

### Tailwind CSS
- https://tailwindcss.com
- Utility-first CSS

### Vercel
- https://vercel.com
- Deployment platform

---

## ✅ Checklist lần đầu

- [ ] Clone/Download dự án
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Mở http://localhost:3000
- [ ] Test thêm animation/sound
- [ ] Test focus page
- [ ] Đọc UPDATE_GUIDE.md
- [ ] Setup GitHub (nếu chưa)
- [ ] Setup Vercel (nếu muốn deploy)

---

**Happy coding! 💻✨**

