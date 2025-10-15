# 🎯 Chi tiết tính năng - ChillPomodoro

## 1. 🎨 Kho Animation

### Chức năng cơ bản:
- **Thêm**: Upload file hoặc nhập URL
- **Sửa**: Chỉnh sửa tên, loại, URL
- **Xóa**: Xóa animation không cần

### Loại file hỗ trợ:
- **Ảnh**: JPG, PNG, WebP
- **GIF**: GIF animation
- **Video**: MP4, WebM

### Giới hạn:
- Kích thước file: Tối đa **50MB**
- Số lượng: Không giới hạn (tùy vào dung lượng trình duyệt)

### Tính năng đặc biệt:
- ✅ Preview trước khi lưu
- ✅ Validation kích thước file
- ✅ Loading state khi upload
- ✅ GIF/Video tối ưu cho iOS
- ✅ Lưu trữ trong IndexedDB (không mất khi reload)

---

## 2. 🎵 Kho Sound

### Chức năng cơ bản:
- **Thêm**: Upload file audio hoặc nhập URL
- **Sửa**: Chỉnh sửa tên, URL, volume
- **Xóa**: Xóa sound không cần
- **Nghe thử**: Play/Pause trực tiếp

### Loại file hỗ trợ:
- MP3, WAV, OGG, M4A

### Giới hạn:
- Kích thước file: Tối đa **50MB**
- Số lượng: Không giới hạn

### Tính năng đặc biệt:
- ✅ Điều chỉnh volume cho từng sound (0-100%)
- ✅ Preview audio trước khi lưu
- ✅ Play/Pause để test
- ✅ Lưu trữ trong IndexedDB

---

## 3. 🎛️ Quản lý Preset

### Khái niệm:
Preset = Tập hợp nhiều sounds phát cùng lúc

### Chức năng:
- **Tạo preset**: Chọn nhiều sounds từ kho
- **Chỉnh sửa**: Thay đổi sounds trong preset
- **Xóa**: Xóa preset không cần
- **Nghe thử**: Phát tất cả sounds trong preset

### Use cases:
- **Lofi + Rain**: Nhạc lofi kết hợp tiếng mưa
- **Nature Sounds**: Chim hót + suối chảy + gió
- **Cafe Ambience**: Tiếng người nói + pha cà phê + nhạc nhẹ

### Tính năng đặc biệt:
- ✅ Phát nhiều sounds đồng thời (không giới hạn số lượng)
- ✅ Volume riêng cho từng sound
- ✅ Play/Pause cả preset
- ✅ Tạo không giới hạn preset

---

## 4. ⏱️ Chế độ Focus (Trang chính)

### 4.1. Timer Pomodoro

#### Thời gian tùy chỉnh:
- **Làm việc**: 15, 25, 30, 45, 60, 90 phút
- **Nghỉ ngơi**: 5, 10, 15, 20, 30 phút

#### Chức năng:
- ▶️ **Bắt đầu**: Start timer và phát sounds
- ⏸️ **Tạm dừng**: Pause timer và sounds
- 🔄 **Reset**: Reset về thời gian ban đầu
- 🔔 **Countdown sound**: Phát âm thanh tích tắc 10s cuối

#### Khi hết giờ:
1. Timer dừng
2. Popup "Đứng dậy nghỉ ngơi" hiện lên (20s)
3. Tự động chuyển mode (Work ↔ Break)
4. UI tự động hiện lại (nếu đang ẩn)

---

### 4.2. Background Selection

#### Chọn từ kho:
- Dropdown chọn animation đã lưu
- Hỗ trợ: Ảnh, GIF, Video MP4

#### Hiển thị:
- Full screen background
- Cover mode (lấp đầy màn hình)
- Video tự động play, loop, muted

---

### 4.3. Sound Tracks (Đa luồng âm thanh)

#### Tính năng:
- **Thêm track**: Nhấn "Chọn thêm âm thanh"
- **Xóa track**: Click nút X bên cạnh
- **Mỗi track có**:
  - Loại: Đơn (single sound) hoặc Preset
  - Chọn sound/preset từ dropdown

#### Use cases:
- Track 1: Lofi music
- Track 2: Rain sound
- Track 3: Thunder (occasional)

Phát cả 3 cùng lúc!

---

### 4.4. 🆕 Ẩn Giao Diện (Focus Mode)

#### Cách sử dụng:

**Kích hoạt:**
1. Bắt đầu timer
2. Click nút "Ẩn giao diện"
3. HOẶC nhấn phím **ESC**

**Khi ẩn:**
- ✨ Background hiện **rõ nét 100%** (không có overlay mờ)
- 🎬 Video/GIF chạy mượt mà
- 🕐 Timer lớn hiển thị ở giữa màn hình
- 👁️ Nút "Hiện giao diện" ở góc phải trên

**Hiện lại:**
- Nhấn nút 👁️ góc phải
- Nhấn phím **ESC**
- Tự động hiện khi hết thời gian

#### Lợi ích:
- 🧘 Tập trung tối đa, không bị phân tâm bởi UI
- 🎨 Thưởng thức background đẹp mắt
- ⏰ Vẫn thấy thời gian còn lại
- 🎵 Sounds vẫn phát bình thường

#### Tips:
- Dùng video/GIF động để tạo cảm giác thư giãn
- Combine với fullscreen mode (F11) cho trải nghiệm tốt nhất
- Khóa orientation landscape trên mobile

---

### 4.5. Lưu & Tải Tiến Trình

#### Lưu tiến trình:
**Lưu lại:**
- Background hiện tại
- Tất cả sound tracks
- Thời gian work/break

**Cách dùng:**
1. Cài đặt background + sounds
2. Click "Lưu tiến trình"
3. Đặt tên (VD: "Morning Focus")
4. Lưu

#### Tải tiến trình:
1. Click "Tải tiến trình"
2. Chọn tiến trình đã lưu
3. Tất cả settings được khôi phục
4. Sẵn sàng bắt đầu!

#### Use cases:
- **Morning Focus**: Lofi + Birds + Sunrise video
- **Deep Work**: White noise + Rain + Dark background
- **Creative Session**: Jazz + Cafe ambience + Aesthetic GIF

---

## 5. 📱 Fullscreen & Orientation

### Fullscreen Mode:
- Click nút **Maximize** (⛶)
- Hoặc nhấn F11
- Ẩn thanh địa chỉ, bookmarks
- Màn hình đầy đủ cho background

### Orientation Lock:
- Click nút **Smartphone** (📱)
- Khóa xoay màn hình landscape
- Tốt cho xem video/GIF trên mobile

### Mobile Support:
- ✅ iOS Safari: GIF/Video chạy mượt
- ✅ Android Chrome: Full support
- ✅ Touch friendly: Nút to, dễ bấm
- ✅ Responsive: Tự động điều chỉnh layout

---

## 6. 💾 Lưu Trữ Dữ Liệu

### IndexedDB (Files lớn):
- Animations (ảnh, GIF, video)
- Sounds (audio files)
- Dung lượng: ~50MB - 1GB (tùy trình duyệt)

### LocalStorage (Metadata):
- Presets (chỉ lưu IDs)
- Saved sessions
- Settings
- Dung lượng: ~5-10MB

### Đảm bảo:
- ✅ Dữ liệu không mất khi reload
- ✅ Offline support
- ✅ Fast loading
- ✅ No server required

---

## 7. 🎮 Keyboard Shortcuts

| Phím | Chức năng |
|------|-----------|
| **ESC** | Hiện/Ẩn giao diện (khi timer đang chạy) |
| **F11** | Fullscreen mode |
| **Space** | Start/Pause timer (coming soon) |

---

## 8. 🎨 UX/UI Features

### Loading States:
- ⏳ Spinner khi load animations/sounds
- ⏳ "Đang xử lý..." khi upload
- ⏳ Disable buttons khi đang xử lý

### Notifications:
- ✅ "Lưu thành công!"
- ❌ "File quá lớn! Vui lòng chọn file nhỏ hơn 50MB"
- ❌ "Lỗi khi tải dữ liệu"

### Animations:
- 🎭 Fade in/out khi hiện/ẩn UI
- 🎭 Hover effects trên buttons
- 🎭 Smooth transitions
- 🎭 Loading spinners

### Responsive:
- 📱 Mobile: Single column layout
- 💻 Desktop: Multi-column grid
- 🖥️ Large screens: Optimized spacing

---

## 9. 🚀 Performance

### Optimizations:
- **Lazy Loading**: Chỉ load khi cần
- **IndexedDB**: Non-blocking I/O
- **Video**: Auto-muted để tránh lag
- **GIF**: CSS transform optimization cho iOS

### Best Practices:
- Nén ảnh/video trước khi upload
- Xóa files không dùng
- Giới hạn 3-5 sounds cùng lúc
- Dùng URL thay vì upload nếu có thể

---

## 10. 🎯 Use Cases

### Học tập:
1. Chọn background "Study room"
2. Phát lofi music
3. Set timer 25 phút
4. Ẩn UI, tập trung học
5. Nghỉ 5 phút khi hết giờ

### Làm việc:
1. Background "Office/Mountain"
2. White noise + Cafe sounds
3. 45 phút work, 15 phút break
4. Lưu tiến trình "Deep Work"

### Thư giãn:
1. Video "Ocean waves"
2. Nature sounds preset
3. 15 phút meditation
4. Fullscreen mode

### Sáng tạo:
1. GIF "Aesthetic/Art"
2. Jazz + Rain
3. 30 phút creative work
4. Ẩn UI để immersive

---

**Tận hưởng làm việc hiệu quả với ChillPomodoro! 🎯✨**

