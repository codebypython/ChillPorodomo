# ChillPomodoro 🍅

Ứng dụng web giúp bạn tập trung làm việc hiệu quả bằng kỹ thuật Pomodoro, kết hợp với âm thanh và hình ảnh thư giãn.

## ✨ Tính năng

### 🎨 Kho Animation

- Thêm, sửa, xóa ảnh, GIF và **Video MP4**
- Hỗ trợ upload file (tối đa 50MB) hoặc nhập URL
- Xem trước trực tiếp
- Tương thích tốt với iOS (GIF và Video ổn định)
- Sử dụng IndexedDB để lưu file lớn

### 🎵 Kho Sound ⭐ **NEW: 3 CÁCH THÊM ÂM THANH**

- **📱 Tải file lên**: Upload từ thiết bị (MP3, WAV, OGG, M4A, AAC)
- **🔗 Link URL**: Nhập link trực tiếp đến file âm thanh
- **☁️ Google Drive**: Tải file từ Google Drive (file lớn, chia sẻ dễ)
- Quản lý âm thanh (CRUD)
- Điều chỉnh âm lượng cho từng âm thanh
- Nghe thử trực tiếp
- Sử dụng IndexedDB để lưu file lớn
- ✅ **Fixed: Chọn file MP3 trên iPhone/iPad**

### 🎛️ Quản lý Preset

- Tạo preset kết hợp nhiều âm thanh
- Phát nhiều âm thanh đồng thời
- Chỉnh sửa và xóa preset dễ dàng

### ⏱️ Chế độ Focus

- Timer Pomodoro tùy chỉnh
- Chọn background từ kho animation (ảnh/GIF/video)
- **🎨 Smart Blur Background** ⭐ **NEW v2.5.0**
  - Chế độ **Fit**: Xem trọn vẹn background + blur fill (mặc định)
  - Chế độ **Fill**: Full màn hình (có thể crop)
  - Nút toggle linh hoạt, lưu lựa chọn tự động
  - Premium experience như Spotify
- Phát nhiều âm thanh/preset cùng lúc
- **🎚️ Điều chỉnh volume từng sound track** (slider 0-100%)
- **👁️ Ẩn giao diện** - Chỉ hiện background rõ nét
- **🕐 Ẩn cả đồng hồ** - Option ẩn timer khi cần
- Nhấn ESC hoặc nút để hiện/ẩn giao diện
- Tự động hiện lại UI khi hết thời gian
- Âm thanh đếm ngược 10s cuối
- Popup nghỉ ngơi 20s tự động
- Lưu và tải lại tiến trình
- Chế độ toàn màn hình
- Khóa xoay màn hình (landscape)
- **📱 Responsive hoàn toàn** - Tối ưu cho mobile

## 🚀 Cài đặt và chạy

### Yêu cầu

- Node.js 18+
- npm hoặc yarn

### Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy

### Deploy lên Vercel (Khuyến nghị)

1. Tạo tài khoản tại [vercel.com](https://vercel.com)
2. Cài đặt Vercel CLI:

```bash
npm install -g vercel
```

3. Deploy:

```bash
vercel
```

hoặc đơn giản hơn:

- Push code lên GitHub
- Import repository vào Vercel
- Vercel sẽ tự động deploy

### Deploy lên Netlify

1. Build project:

```bash
npm run build
```

2. Tại [netlify.com](https://netlify.com):

- Drag & drop thư mục `dist` vào Netlify

hoặc sử dụng Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy lên GitHub Pages

1. Cài đặt gh-pages:

```bash
npm install --save-dev gh-pages
```

2. Thêm vào `package.json`:

```json
{
  "homepage": "https://[username].github.io/ChillPorodomo",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Cập nhật `vite.config.js`:

```js
export default defineConfig({
  base: "/ChillPorodomo/",
  // ... rest of config
});
```

4. Deploy:

```bash
npm run deploy
```

## 📱 Hỗ trợ Mobile & iOS

- ✅ **Responsive design hoàn toàn** - Tự động điều chỉnh layout
- ✅ GIF animation hoạt động mượt mà trên iOS
- ✅ Video MP4/WebM phát tốt trên iOS với `playsInline`
- ✅ Hỗ trợ fullscreen mode
- ✅ Khóa xoay màn hình
- ✅ Touch-friendly interface - Buttons lớn, dễ bấm
- ✅ PWA support - Install như native app
- ✅ Breakpoints: Mobile (< 640px), Tablet (640-768px), Desktop (> 768px)
- ✅ Volume sliders tối ưu cho touch
- ✅ Compact UI trên mobile với scroll support

## 💾 Lưu trữ dữ liệu

Ứng dụng sử dụng hai phương pháp lưu trữ:

### IndexedDB (cho files lớn):

- ✅ Ảnh, GIF, Video (lên đến 50MB)
- ✅ Âm thanh (lên đến 50MB)
- ✅ Hỗ trợ upload file từ máy tính

### LocalStorage (cho metadata):

- Preset đã tạo
- Tiến trình đã lưu
- Cài đặt

**Lưu ý**:

- Dữ liệu được lưu trực tiếp trên trình duyệt, không cần server
- Hỗ trợ upload file lớn lên đến 50MB
- Xem thêm chi tiết trong `INDEXEDDB_GUIDE.md`

## 🎯 Cách sử dụng

1. **Chuẩn bị**:

   - Thêm ảnh/GIF vào Kho Animation
   - Thêm âm thanh vào Kho Sound
   - (Tùy chọn) Tạo Preset kết hợp nhiều âm thanh

2. **Bắt đầu Focus**:

   - Chọn background
   - Chọn âm thanh/preset
   - Thiết lập thời gian làm việc và nghỉ
   - Nhấn "Bắt đầu"

3. **Lưu tiến trình**:
   - Nhấn "Lưu tiến trình" để lưu cấu hình hiện tại
   - Tải lại bất cứ lúc nào

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **LocalStorage API** - Data persistence
- **Web Audio API** - Audio playback
- **Fullscreen API** - Fullscreen mode
- **Screen Orientation API** - Orientation lock

## 📚 Documentation

### 🚀 Bắt đầu nhanh

- `UPDATE_GUIDE.md` - ⭐ Hướng dẫn cập nhật & deploy dự án

### 📱 Mobile & iOS (v2.2)

- `IOS_FIX_GUIDE.md` - 🆕 ⭐ **Khắc phục lỗi iPhone + Tính năng Google Drive**
  - Fix lỗi chọn file MP3 trên iPhone
  - Hướng dẫn 3 cách thêm âm thanh
  - Tải file từ Google Drive
  - Troubleshooting & Best practices

### 📝 Changelog & Release Notes

- `CHANGELOG.md` - 🆕 Lịch sử thay đổi chi tiết (v1.0 → v2.2)
- `VERSION_2.2_SUMMARY.md` - 🆕 ⭐ Release notes v2.2.0

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 🙏 Credits

Phát triển bởi AI Assistant với yêu cầu từ người dùng.

---

**Enjoy your focused work sessions! 🎯✨**
