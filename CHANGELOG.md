# Changelog

All notable changes to ChillPomodoro will be documented in this file.

## [2.7.0] - 2025-01-16

### 🎯 TÁI CẤU TRÚC TOÀN DIỆN - Tối Ưu Hiệu Suất Mobile

#### 🚀 Breaking Changes

- Hoàn toàn tái cấu trúc FocusPage với kiến trúc mới
- Tách riêng logic điều khiển: Timer, Audio, và Background/Video hoạt động độc lập

#### ✨ Tính Năng Mới

**Điều Khiển Độc Lập**

- ✅ Timer riêng biệt: Start/Pause/Continue không ảnh hưởng âm thanh hoặc video
- ✅ Audio độc lập: Bật/tắt nhạc không cần start timer
- ✅ Background/Video độc lập: Xem video mà không cần timer hoặc nhạc
- ✅ Không còn bị crash khi dùng nhiều tính năng cùng lúc (đặc biệt trên mobile)

**Giao Diện Điều Khiển Mới**

- 🎵 **Icon Nốt Nhạc**: Mở panel chọn âm thanh (hỗ trợ nhiều track)
- 🔊 **Icon Loa**: Bật/tắt phát nhạc (độc lập hoàn toàn với timer)
- ⚙️ **Icon Bánh Răng**: Panel điều chỉnh âm lượng realtime (áp dụng ngay lập tức, không cần pause)
- 🖼️ **Icon Ảnh**: Panel chọn background/video
- 🎬 **Icon Film**: Bật/tắt video trên lớp overlay riêng (như ChillTimer)
- 👁️ **Icon Mắt**: Ẩn UI khi đang xem video (chỉ hiện khi video đang bật)

**Video Overlay Layer** (Học từ ChillTimer)

- ✅ Video/background hiển thị trên lớp riêng, chiếm toàn màn hình
- ✅ Không bị che bởi thanh tìm kiếm của trình duyệt trên mobile
- ✅ Chống chạm nhầm: Ẩn UI để tránh kích hoạt nút không mong muốn
- ✅ Auto-loop: Video tự động lặp vô hạn (phù hợp với timer dài 60-90 phút)
- ✅ Chế độ Fit/Fill linh hoạt
- ✅ Floating controls khi ẩn UI: Hiện UI, Hiện/ẩn đồng hồ, Toggle Fit/Fill
- ✅ Nút thoát luôn hiển thị ở góc phải

**Tối Ưu Hiệu Suất Mobile**

- ✅ Lazy loading cho audio và video
- ✅ Hardware acceleration (GPU) cho video rendering
- ✅ Prevent scroll và touch issues khi xem video
- ✅ Tối ưu backdrop blur trên mobile (giảm từ 12px xuống 8px)
- ✅ Giảm thời gian animation trên mobile (0.2s thay vì 0.3-0.4s)
- ✅ Memory management: Cleanup khi component unmount
- ✅ Body scroll lock khi video overlay active

**Audio Improvements**

- ✅ Điều chỉnh âm lượng realtime (không cần pause/play lại)
- ✅ Auto-loop: Tất cả audio tự động lặp vô hạn
- ✅ Volume control cho từng track riêng biệt
- ✅ Hỗ trợ nhiều track phát đồng thời

#### 🐛 Bug Fixes

- ✅ Fixed: Crash trên mobile khi sử dụng nhiều tính năng cùng lúc
- ✅ Fixed: Timer bị refresh khi pause và start lại
- ✅ Fixed: Audio dừng khi pause timer
- ✅ Fixed: Video bị che bởi thanh tìm kiếm mobile
- ✅ Fixed: Chạm nhầm vào nút khi xem video
- ✅ Fixed: Volume không thay đổi realtime

#### 🎨 UI/UX Improvements

- ✅ Giao diện grid 2x3 cho các nút điều khiển (responsive)
- ✅ Visual feedback rõ ràng cho mỗi trạng thái (đang phát, đã chọn, disabled)
- ✅ Panel riêng biệt cho mỗi chức năng (collapsible)
- ✅ Màu sắc phân biệt cho từng loại control:
  - 🎵 Purple: Sound selection
  - 🔊 Green: Audio playing
  - ⚙️ Blue: Volume control
  - 🖼️ Pink: Background selection
  - 🎬 Orange: Video viewing
- ✅ Buttons disabled khi không có action khả dụng

#### 📝 Documentation

- ✅ Thêm `CACH_SU_DUNG_MOI.md` - Hướng dẫn sử dụng chi tiết v2.7.0
- ✅ Cập nhật README.md với tính năng mới
- ✅ Workflow đề xuất cho các use case phổ biến

#### 🔧 Technical Changes

- Refactored `FocusPage.jsx` hoàn toàn (từ 919 dòng → 1200+ dòng, nhưng logic rõ ràng hơn)
- Thêm CSS classes mới: `video-overlay`, `video-overlay-active`
- Thêm performance optimizations trong `index.css`
- Tách biệt state management cho timer, audio, và background
- Cải thiện component lifecycle và cleanup

#### 💾 Storage

- Không thay đổi: Session vẫn tương thích với phiên bản cũ

---

## [2.6.0] - 2024-XX-XX

### Invisible Buttons

- Nút điều khiển ẩn hoàn toàn khi không dùng
- Desktop: Hiện khi hover
- Mobile: Mờ nhẹ, hiện rõ khi touch
- Frosted glass effect

---

## [2.5.0] - 2024-XX-XX

### Smart Blur Background

- Chế độ Fit: Xem trọn vẹn + blur fill
- Chế độ Fill: Full màn hình
- Toggle linh hoạt, lưu lựa chọn

---

## [2.2.0] - 2024-XX-XX

### Google Drive Integration

- Hỗ trợ 3 cách thêm âm thanh
- Fixed: Chọn file MP3 trên iPhone

---

## [2.0.0] - 2024-XX-XX

### Major Release

- IndexedDB support
- Upload file lớn (50MB)
- Video MP4 support

---

## [1.0.0] - 2024-XX-XX

### Initial Release

- Basic Pomodoro timer
- Sound library
- Animation library
- Preset management
