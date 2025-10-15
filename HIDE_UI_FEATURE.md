# 👁️ Tính năng "Ẩn Giao Diện" - Chi tiết

## 🎯 Mục đích

Tính năng **Ẩn Giao Diện** giúp bạn:
- ✨ Tập trung 100% vào công việc
- 🎨 Thưởng thức background đẹp mắt mà không bị UI che mờ
- 🧘 Tạo không gian làm việc immersive (đắm chìm)
- ⏰ Vẫn theo dõi thời gian còn lại

## 🚀 Cách sử dụng

### Bước 1: Chuẩn bị
```
1. Vào trang Focus
2. Chọn background đẹp (ảnh/GIF/video)
3. Chọn âm thanh yêu thích
4. Cài đặt thời gian làm việc
```

### Bước 2: Bắt đầu
```
1. Click "Bắt đầu" ▶️
2. Timer bắt đầu đếm ngược
3. Sounds bắt đầu phát
```

### Bước 3: Ẩn giao diện
```
Cách 1: Click nút "Ẩn giao diện" 👁️‍🗨️
Cách 2: Nhấn phím ESC ⌨️
```

### Khi UI đã ẩn:
```
✅ Background hiện RÕ NÉT 100%
   - Không còn overlay mờ đen
   - Video/GIF chạy rõ ràng
   - Màu sắc sống động

✅ Timer lớn hiển thị ở giữa
   - Font size cực lớn
   - Dễ nhìn từ xa
   - Có hiệu ứng pulse

✅ Nút hiện giao diện góc phải
   - Click để hiện lại UI
   - Hoặc nhấn ESC
```

## 🎨 Trải nghiệm

### Khi UI hiện (Bình thường):
```
┌─────────────────────────────────────────────┐
│ [Back] [Fullscreen] [Orientation]           │
│                                              │
│         🕐 25:00                             │
│    [▶️ Bắt đầu] [🔄 Reset] [👁️ Ẩn giao diện]│
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │ Chọn Background: [Lofi Girl ▼]         │ │
│ │ Sound: [Rain ▼] [+]                     │ │
│ │ Work: [25 phút ▼] Break: [5 phút ▼]    │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
     ↑ Overlay mờ (30% đen)
     ↑ Background không rõ nét
```

### Khi UI ẩn (Focus Mode):
```
┌─────────────────────────────────────────────┐
│                                    [👁️]      │
│                                              │
│                                              │
│              🕐 24:53                        │
│           Đang làm việc...                   │
│                                              │
│                                              │
│                                              │
└─────────────────────────────────────────────┘
     ↑ KHÔNG có overlay
     ↑ Background rõ nét 100%
     ↑ Chỉ có timer và nút nhỏ
```

## ⌨️ Keyboard Shortcuts

| Phím | Chức năng | Khi nào dùng |
|------|-----------|--------------|
| **ESC** | Ẩn UI | Khi timer đang chạy |
| **ESC** | Hiện UI | Khi UI đang ẩn |

**Lưu ý**: ESC chỉ hoạt động khi timer đang chạy!

## 🎬 Demo Scenarios

### Scenario 1: Học với Lofi
```
1. Background: "Lofi Girl studying" (GIF)
2. Sound: Lofi hip hop beats
3. Timer: 25 phút
4. Bắt đầu → Ẩn UI
5. Tập trung học 25 phút
6. Popup hiện → Nghỉ 5 phút
```

### Scenario 2: Làm việc với Nature
```
1. Background: "Forest" (Video 4K)
2. Sounds: Rain + Birds + Thunder
3. Timer: 45 phút
4. Fullscreen (F11) → Ẩn UI
5. Deep work session
6. Tự động hiện UI khi hết giờ
```

### Scenario 3: Meditation
```
1. Background: "Ocean waves" (Video)
2. Sound: Meditation music
3. Timer: 15 phút
4. Ẩn UI → Thư giãn
5. Chỉ nghe và xem video
```

## 🔄 Flow hoàn chỉnh

```
[Bắt đầu timer]
       ↓
[Nhấn "Ẩn giao diện" / ESC]
       ↓
[UI fade out trong 0.5s]
       ↓
[Overlay mờ biến mất]
       ↓
[Background hiện rõ 100%]
       ↓
[Timer lớn hiện giữa màn hình]
       ↓
[Làm việc tập trung...]
       ↓
[Còn 10s → Tick tock sound]
       ↓
[Hết giờ → UI tự động hiện lại]
       ↓
[Popup "Nghỉ ngơi 20s"]
```

## 💡 Tips & Tricks

### Tip 1: Combine với Fullscreen
```
1. Nhấn F11 (hoặc nút Fullscreen)
2. Ẩn UI
→ Trải nghiệm immersive hoàn toàn!
```

### Tip 2: Chọn video động
```
Thay vì ảnh tĩnh, dùng video:
- Ocean waves
- Fireplace
- Rain on window
- Time-lapse clouds
→ Tạo cảm giác sống động hơn
```

### Tip 3: Multiple screens
```
Nếu có 2 màn hình:
- Màn 1: ChillPomodoro (UI ẩn, fullscreen)
- Màn 2: Công việc chính
→ Nhìn sang màn 1 khi cần relax
```

### Tip 4: Mobile usage
```
1. Add to Home Screen (iOS/Android)
2. Orientation: Landscape
3. Fullscreen
4. Ẩn UI
→ Tablet/phone thành đồng hồ Pomodoro đẹp mắt!
```

### Tip 5: Preset sessions
```
Lưu tiến trình với tên như:
- "Morning Deep Work (UI Hidden)"
- "Creative Session (Hidden)"
→ Load và ẩn UI ngay
```

## ⚙️ Technical Details

### CSS Classes:
```css
/* Khi UI ẩn */
.opacity-0 .pointer-events-none
/* Transition mượt mà */
.transition-opacity .duration-500
```

### Z-index layers:
```
- Background: z-0 (video/image)
- Overlay: z-1 (ẩn khi UI hidden)
- Timer floating: z-40 (hiện khi ẩn)
- Show button: z-50 (luôn trên cùng)
```

### State management:
```javascript
const [isUIHidden, setIsUIHidden] = useState(false)

// Ẩn khi:
- Click "Ẩn giao diện"
- Press ESC

// Hiện khi:
- Click nút 👁️
- Press ESC again
- Timer hết giờ (tự động)
```

## 🎯 Use Cases thực tế

### 1. Student studying
```
"Mình thích nhìn GIF lofi girl khi học
nhưng UI che mất phần đẹp. Giờ ẩn UI,
chỉ còn GIF và timer to → Perfect!"
```

### 2. Developer coding
```
"Set timer 45 phút, background là video
code editor aesthetic, ẩn UI, fullscreen.
Như có người ngồi code cùng mình vậy!"
```

### 3. Designer working
```
"Background là palette màu đẹp, music
là lo-fi beats, ẩn UI để không bị
phân tâm. Chỉ thỉnh thoảng nhìn timer."
```

### 4. Writer writing
```
"Video typewriter, sound rain on window,
ẩn UI. Cảm giác như ngồi trong cafe
viết lách. Very inspiring!"
```

## ❓ FAQs

### Q: Có thể ẩn UI khi chưa bắt đầu timer?
A: Không. Nút "Ẩn giao diện" chỉ hiện khi timer đang chạy.

### Q: ESC không hoạt động?
A: Kiểm tra:
- Timer có đang chạy không?
- Browser có focus vào page không?
- Thử click vào page rồi nhấn ESC lại

### Q: Timer có dừng khi ẩn UI không?
A: KHÔNG. Timer vẫn chạy, sounds vẫn phát bình thường.

### Q: Ẩn UI có ảnh hưởng hiệu suất?
A: KHÔNG. Chỉ ẩn CSS, không ảnh hưởng performance.

### Q: Có thể tùy chỉnh vị trí timer khi ẩn?
A: Hiện tại timer luôn ở giữa. Feature request cho version sau!

### Q: Mobile có hỗ trợ không?
A: CÓ! Hoạt động tốt trên iOS và Android.

## 🎨 Customization Ideas (Future)

Các tính năng có thể thêm:
- [ ] Chọn vị trí timer (trên/dưới/trái/phải)
- [ ] Tùy chỉnh size timer
- [ ] Ẩn cả timer (chỉ còn background)
- [ ] Hotkey khác ngoài ESC
- [ ] Gradient overlay thay vì ẩn hoàn toàn
- [ ] Auto hide sau 3s không có tương tác
- [ ] Progress bar thay vì timer text

## 🌟 Kết luận

Tính năng **Ẩn Giao Diện** biến ChillPomodoro từ một công cụ quản lý thời gian thành một **trải nghiệm làm việc immersive**.

**Công thức thành công:**
```
Beautiful Background
    +
Soothing Sounds
    +
Hidden UI
    +
Focused Mind
    =
Peak Productivity! 🚀
```

---

**Happy focusing! 🎯✨**

