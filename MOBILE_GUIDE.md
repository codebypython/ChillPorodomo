# 📱 Hướng dẫn sử dụng trên Mobile - ChillPomodoro

## 🎯 Tối ưu hóa cho Mobile

ChillPomodoro được thiết kế responsive hoàn toàn cho mobile, với các cải tiến đặc biệt:

### ✨ Tính năng Mobile

#### 1. **Responsive Layout**
- 📱 Tự động điều chỉnh theo kích thước màn hình
- 🔄 Hỗ trợ cả portrait và landscape
- 👆 Touch-friendly buttons (kích thước lớn hơn)
- 📏 Text size tự động scale

#### 2. **Chế độ Ẩn UI**
- 👁️ Ẩn hoàn toàn giao diện
- 🎨 Chỉ hiện background rõ nét
- 🕐 Option hiện/ẩn đồng hồ
- ✨ Trải nghiệm immersive tối đa

#### 3. **Volume Control**
- 🎚️ Slider điều chỉnh âm lượng từng track
- 🎵 Áp dụng cả volume gốc + volume track
- 📊 Hiển thị % âm lượng rõ ràng

## 🚀 Cách sử dụng trên Mobile

### iOS (iPhone/iPad)

#### Bước 1: Thêm vào Home Screen
```
1. Mở Safari
2. Truy cập ChillPomodoro
3. Nhấn nút Share (⬆️)
4. Chọn "Add to Home Screen"
5. Đặt tên và Add
```

**Lợi ích:**
- ✅ Chạy như native app
- ✅ Không có thanh địa chỉ
- ✅ Fullscreen tự động
- ✅ Icon trên home screen

#### Bước 2: Cài đặt Focus Session
```
1. Chọn background (GIF/video hoạt động mượt trên iOS!)
2. Chọn âm thanh
3. Điều chỉnh volume từng track
4. Set timer
```

#### Bước 3: Bắt đầu tập trung
```
1. Nhấn "Bắt đầu"
2. Xoay ngang màn hình (landscape)
3. Nhấn "Ẩn giao diện"
4. Option: Ẩn cả đồng hồ (nút Clock)
```

#### Tips cho iOS:
```
✅ GIF animation chạy mượt mà (đã optimize)
✅ Video MP4/WebM phát tốt với playsInline
✅ Autoplay audio hoạt động sau user tap
✅ Orientation lock hoạt động trong fullscreen
```

---

### Android (Chrome/Samsung Internet)

#### Bước 1: Install PWA
```
1. Mở Chrome
2. Truy cập ChillPomodoro
3. Nhấn menu (⋮)
4. Chọn "Add to Home screen"
5. Install
```

**Hoặc:**
- Popup "Install app" sẽ tự hiện
- Nhấn "Install" là xong

#### Bước 2-3: Giống iOS
```
Cài đặt → Bắt đầu → Ẩn UI
```

#### Tips cho Android:
```
✅ PWA install tự động
✅ Background service (tiếp tục chạy khi minimize)
✅ Notification support
✅ Faster performance
```

---

## 🎨 UI Responsive Details

### Breakpoints:

| Kích thước | Thay đổi |
|------------|----------|
| **< 640px** (Mobile) | Single column, compact spacing, hidden text labels |
| **640-768px** (Tablet) | 2 columns, medium spacing, show labels |
| **> 768px** (Desktop) | Full layout, large spacing, full features |

### Mobile-specific changes:

#### Timer Display:
```
Desktop: text-9xl (144px)
Tablet:  text-8xl (96px)  
Mobile:  text-6xl (60px)
```

#### Buttons:
```
Desktop: Full text + icon
Mobile:  Icon only (text hidden)
```

#### Sound Tracks:
```
Desktop: 2 columns (type + sound)
Mobile:  1 column (stack vertically)
```

#### Controls Panel:
```
Desktop: No scroll
Mobile:  Scroll if needed (max-h-60vh)
```

---

## 🎚️ Tính năng Volume Control

### Cách sử dụng:

```
Mỗi sound track có slider riêng:

[🎵] ████████████░░░░░░░░  80%
     ↑ Drag để điều chỉnh

- Kéo trái: Giảm volume
- Kéo phải: Tăng volume
- % hiển thị bên cạnh
```

### Volume Calculation:

```
Final Volume = Sound Volume × Track Volume

Ví dụ:
- Sound A: volume 100%
- Track volume: 50%
→ Final: 50%

- Sound B: volume 60%
- Track volume: 80%
→ Final: 48%
```

**Use cases:**
- Mix nhiều sounds với volume khác nhau
- Lofi 100% + Rain 30% = Perfect!
- White noise 80% + Birds 20% = Nature

---

## 👁️ Tính năng Ẩn UI nâng cao

### Hai nút control khi UI ẩn:

#### 1. Nút Eye (Hiện giao diện)
```
[👁️] ← Click để hiện lại UI
```

#### 2. Nút Clock (Hiện/Ẩn đồng hồ)
```
[🕐] ← Toggle timer on/off

Trạng thái 1: Timer hiển thị
┌─────────────┐
│             │
│   24:53     │ ← Timer giữa màn hình
│             │
└─────────────┘

Trạng thái 2: Chỉ background
┌─────────────┐
│             │
│   [Pure     │ ← Không gì cả!
│  Background]│
└─────────────┘
```

### Khi nào dùng:

**Hiện timer:**
- ✅ Học bài, cần biết thời gian còn lại
- ✅ Work sprints với deadline
- ✅ Tracking progress

**Ẩn timer:**
- ✅ Meditation, thư giãn
- ✅ Sleep timer
- ✅ Ambient background thuần túy
- ✅ Screensaver mode

---

## 📐 Orientation & Fullscreen

### Landscape Mode:
```
1. Bật auto-rotate trên điện thoại
2. Xoay ngang
3. Hoặc click nút 📱 để lock landscape
```

**Lợi ích:**
- Wide view cho video/GIF
- Timer lớn hơn
- Controls rộng rãi hơn

### Fullscreen Mode:
```
1. Click nút Maximize (⛶)
2. Hoặc F11 (Android Chrome)
3. iOS: Add to Home Screen tự động fullscreen
```

**Kết hợp:**
```
Fullscreen + Landscape + Hide UI + Hide Timer
= Perfect ambient background!
```

---

## 🎯 Best Practices cho Mobile

### 1. Battery Optimization:
```
- Dùng ảnh thay vì video cho session dài
- Giảm brightness khi ẩn UI
- Enable Low Power Mode nếu cần
```

### 2. Performance:
```
- Giới hạn 3-4 sounds cùng lúc
- Dùng preset thay vì nhiều tracks riêng lẻ
- Clear cache thường xuyên
```

### 3. Data Usage:
```
- Upload files thay vì stream URL
- Dùng files đã lưu trong IndexedDB
- Offline mode sau khi load lần đầu
```

### 4. UX Tips:
```
✅ Lock screen orientation trước khi ẩn UI
✅ Increase volume trước khi ẩn
✅ Test sound trước khi start timer
✅ Lưu session để dùng lại
```

---

## 🐛 Troubleshooting Mobile

### Vấn đề 1: GIF không chạy
```
Giải pháp:
- Dùng Safari trên iOS (Chrome có thể lag)
- Hoặc dùng video MP4 thay vì GIF
- Convert GIF → MP4 (ezgif.com)
```

### Vấn đề 2: Sound không phát
```
Nguyên nhân: Browser block autoplay
Giải pháp:
- Tap vào screen trước
- Bật sound trong settings điện thoại
- Unmute tab (check tab icon)
```

### Vấn đề 3: UI quá nhỏ
```
Giải pháp:
- Zoom browser (pinch to zoom)
- Xoay landscape
- Hoặc dùng tablet
```

### Vấn đề 4: Timer không đếm khi minimize
```
Android: OK (background service)
iOS: Có thể dừng (limitation của iOS)

Workaround:
- Không minimize, chỉ lock screen
- Dùng guided access (iOS)
```

---

## 📊 Recommended Settings

### Cho học tập:
```
Background: Lofi Girl GIF
Sounds:
  - Lofi music: 100%
  - Rain: 30%
  - Keyboard typing: 20%
Timer: 25 phút work / 5 phút break
UI: Ẩn, Timer hiện
Orientation: Landscape
```

### Cho meditation:
```
Background: Ocean waves video
Sounds:
  - Meditation music: 60%
  - Ocean sounds: 40%
Timer: 15 phút
UI: Ẩn hoàn toàn (cả timer)
Fullscreen: On
```

### Cho sleep:
```
Background: Night sky video
Sounds:
  - Rain: 50%
  - Thunder: 20%
  - White noise: 30%
Timer: 60 phút
UI: Ẩn hoàn toàn
Lock orientation: Portrait
Auto-sleep sau khi hết timer
```

---

## 🌟 Pro Tips

### Tip 1: Tablet as Ambient Display
```
Dùng tablet cũ làm ambient display:
1. Install ChillPomodoro
2. Set beautiful video background
3. Hide UI completely
4. Mount on wall/desk
→ Ambient display đẹp mắt!
```

### Tip 2: Multi-device Sync
```
Dù chưa có sync, bạn có thể:
1. Save session trên desktop
2. Note lại settings
3. Recreate trên mobile
→ Consistent experience!
```

### Tip 3: Shortcuts
```
iOS: Add Siri Shortcut
"Hey Siri, start focus session"
→ Auto open ChillPomodoro
```

---

**Happy focusing on mobile! 📱✨**

