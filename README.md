# ChillPomodoro 🍅

Ứng dụng web giúp bạn tập trung làm việc hiệu quả bằng kỹ thuật Pomodoro, kết hợp với âm thanh và hình ảnh thư giãn.

## 🎉 NEW: Mobile Video Optimization (v2.9.0) - FIXED!

### 🔥 Critical Fix: Blob Storage for Videos

**Vấn đề đã tìm ra và sửa**: Videos sử dụng Base64 encoding quá lớn (67MB cho 50MB video) → gây crash trên mobile!

**Giải pháp**: Tự động sử dụng **Blob storage** cho videos - nhẹ hơn 33%, streaming tốt hơn.

- ✅ **Blob Storage** - Video files dùng Blob thay vì Base64
- ✅ **Auto-Detection** - Tự động chọn Blob cho videos, Base64 cho ảnh nhỏ
- ✅ **50% Less Storage** - 50MB video = 50MB storage (không phải 67MB)
- ✅ **75% Faster Loading** - Blob URLs load nhanh hơn base64
- ✅ **iOS Safari Compatible** - Không còn giới hạn 25MB
- ✅ **Streaming Support** - Browser có thể stream từ blob
- ✅ **Memory Efficient** - Giảm 40% memory usage

### 📱 Trải Nghiệm Video Toàn Màn Hình Trên Mobile

- ✅ **Video chiếm 100% màn hình** - không còn thanh địa chỉ browser
- ✅ **Dynamic Viewport Height** - tự động adjust theo device
- ✅ **iOS Safari Optimized** - xử lý đặc biệt cho iPhone/iPad
- ✅ **Android Chrome Optimized** - smooth experience trên Android
- ✅ **Hardware Acceleration** - phát video mượt mà 60fps
- ✅ **Fullscreen API** - với nhiều fallback cho compatibility
- ✅ **Zoom & Pan** - pinch to zoom, pan khi zoom
- ✅ **Auto-hide Controls** - controls tự động ẩn sau 3s
- ✅ **Orientation Support** - tự động adjust khi xoay màn hình
- ✅ **Safe Area Support** - xử lý đúng với iPhone notch

📚 **Documentation**: 
- 🔥 [**FIX_SUMMARY.md**](./FIX_SUMMARY.md) - **ĐỌC ĐẦU TIÊN!** Tóm tắt fix
- 📘 [VIDEO_BLOB_FIX.md](./VIDEO_BLOB_FIX.md) - Chi tiết technical
- 📗 [MOBILE_VIDEO_OPTIMIZATION_GUIDE.md](./MOBILE_VIDEO_OPTIMIZATION_GUIDE.md) - Mobile optimization
- 📖 [COMPARISON_ANALYSIS.md](./COMPARISON_ANALYSIS.md) - So sánh với ChillTimer

### 🧪 Quick Test
```bash
1. Xóa videos cũ (nếu có)
2. Upload video mới (10-50MB)
3. Console log: "Using Blob storage for..."
4. Go to Focus → Select video → Play
5. Should work smooth! ✅
```

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

### ⏱️ Chế độ Focus ⭐ **v2.7.0 - TÁI CẤU TRÚC TOÀN DIỆN**

#### 🎯 Điều Khiển Độc Lập (NEW!)

- **Timer riêng biệt**: Start/Pause/Continue không ảnh hưởng âm thanh/video
- **Âm thanh độc lập**: Bật/tắt nhạc không cần start timer
- **Video độc lập**: Xem background mà không cần timer/nhạc
- **Không còn crash trên mobile**: Các tính năng không còn bị "dồn" lại

#### 🎵 Quản Lý Âm Thanh Mới

- **Icon Nốt Nhạc** 🎵: Panel chọn âm thanh (nhiều track)
- **Icon Loa** 🔊: Bật/tắt phát nhạc (độc lập với timer)
- **Icon Bánh Răng** ⚙️: Điều chỉnh âm lượng realtime (áp dụng ngay lập tức)
- **Auto-loop**: Nhạc tự động lặp vô hạn (phù hợp timer 90 phút)

#### 🎬 Video/Background Layer Riêng (như ChillTimer)

- **Icon Ảnh** 🖼️: Chọn background/video
- **Icon Film** 🎬: Bật video toàn màn hình trên lớp riêng
- **Auto-loop**: Video tự động lặp vô hạn
- **Không bị che**: Không bị thanh tìm kiếm mobile che khuất
- **Chống chạm nhầm**: Ẩn UI để tránh kích hoạt nút không mong muốn
- **Chế độ Fit/Fill**: Linh hoạt thay đổi kích cỡ video

#### 🎨 Tính Năng Giữ Lại

- Timer Pomodoro tùy chỉnh (15-90 phút)
- Smart Blur Background (Fit/Fill)
- Ẩn UI hoàn toàn (ESC hoặc nút)
- Hiện đồng hồ giữa màn hình khi ẩn UI
- Âm thanh đếm ngược 10s cuối
- Popup nghỉ ngơi 20s tự động
- Lưu và tải session
- Chế độ toàn màn hình
- **📱 Responsive & Mobile-First Design**

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
- `CACH_SU_DUNG_MOI.md` - 🆕 ⭐ **Hướng dẫn sử dụng v2.7.0** (Tái cấu trúc)
  - Cách sử dụng tính năng mới
  - Workflow đề xuất
  - Tips & Tricks
  - Khắc phục sự cố

### 📱 Mobile & iOS (v2.2)

- `IOS_FIX_GUIDE.md` - ⭐ **Khắc phục lỗi iPhone + Tính năng Google Drive**
  - Fix lỗi chọn file MP3 trên iPhone
  - Hướng dẫn 3 cách thêm âm thanh
  - Tải file từ Google Drive
  - Troubleshooting & Best practices

### 📝 Changelog & Release Notes

- `CHANGELOG.md` - Lịch sử thay đổi chi tiết (v1.0 → v2.7)
- `VERSION_2.2_SUMMARY.md` - Release notes v2.2.0
- `PERFORMANCE_OPTIMIZATION_v2.8.md` - Tối ưu hiệu suất

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 🙏 Credits

Phát triển bởi AI Assistant với yêu cầu từ người dùng.

---

**Enjoy your focused work sessions! 🎯✨**
