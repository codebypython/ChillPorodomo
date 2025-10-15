# 📝 Changelog - ChillPomodoro

## Version 2.0.0 (Current) - IndexedDB Update

### 🔧 Khắc phục lỗi quan trọng

#### ❌ Vấn đề trước đây:
- Dữ liệu không được lưu khi upload ảnh/GIF lớn
- LocalStorage giới hạn ~5-10MB
- Upload file thường bị lỗi "QuotaExceededError"
- Base64 encoding làm file tăng kích thước ~33%

#### ✅ Giải pháp mới:
- **Chuyển sang IndexedDB** cho việc lưu file lớn
- Hỗ trợ lưu file lên đến **50MB**
- Tự động validate kích thước file
- Hiển thị loading state khi upload
- Alert thông báo thành công/thất bại rõ ràng

### 🆕 Tính năng mới

#### 1. Hỗ trợ Video MP4
- Upload và phát video làm background
- Tự động phát, loop, tắt tiếng
- Preview video trong modal
- Hỗ trợ cả video từ file và URL

#### 2. Validation & UX cải thiện
- Kiểm tra kích thước file trước khi upload
- Loading spinner khi đang xử lý
- Thông báo lỗi cụ thể
- Disable buttons khi đang upload

#### 3. Performance
- Async/await cho tất cả operations
- Non-blocking UI
- Faster load times

### 📂 Files thay đổi

#### Mới:
- `src/utils/indexedDB.js` - IndexedDB utilities
- `INDEXEDDB_GUIDE.md` - Hướng dẫn chi tiết
- `CHANGELOG.md` - File này

#### Cập nhật:
- `src/utils/storage.js` - Wrapper cho IndexedDB
- `src/pages/AnimationLibrary.jsx` - Hỗ trợ video, async/await
- `src/pages/SoundLibrary.jsx` - Async/await, validation
- `src/pages/FocusPage.jsx` - Hỗ trợ video background
- `src/pages/PresetManager.jsx` - Async/await
- `README.md` - Cập nhật documentation

### 🔄 Migration từ v1.0

**Dữ liệu cũ trong LocalStorage sẽ KHÔNG tự động chuyển sang IndexedDB.**

Nếu bạn đã có dữ liệu trong LocalStorage:

1. **Cách 1: Thêm lại thủ công**
   - Vào kho Animation/Sound cũ
   - Re-upload các file
   - Dữ liệu mới sẽ lưu trong IndexedDB

2. **Cách 2: Migration script** (Advanced)
   ```javascript
   // Mở Console trong DevTools
   // Copy và chạy script này:
   
   (async () => {
     // Get old data from LocalStorage
     const oldAnimations = JSON.parse(localStorage.getItem('chillpomodoro_animations') || '[]')
     const oldSounds = JSON.parse(localStorage.getItem('chillpomodoro_sounds') || '[]')
     
     // Import functions
     const { addAnimationToDB, addSoundToDB } = await import('./src/utils/indexedDB.js')
     
     // Migrate animations
     for (const anim of oldAnimations) {
       await addAnimationToDB(anim)
     }
     
     // Migrate sounds
     for (const sound of oldSounds) {
       await addSoundToDB(sound)
     }
     
     console.log('Migration complete!')
   })()
   ```

### 💡 Lưu ý cho developers

#### 1. Tất cả storage functions giờ là async:

```javascript
// ❌ Cũ (v1.0)
const animations = getAnimations()
addAnimation(newAnimation)

// ✅ Mới (v2.0)
const animations = await getAnimations()
await addAnimation(newAnimation)
```

#### 2. Error handling bắt buộc:

```javascript
try {
  const data = await getAnimations()
  setAnimations(data)
} catch (error) {
  console.error('Error:', error)
  alert('Lỗi khi tải dữ liệu')
}
```

#### 3. Loading states:

```javascript
const [isLoading, setIsLoading] = useState(false)

const loadData = async () => {
  setIsLoading(true)
  try {
    const data = await getAnimations()
    setAnimations(data)
  } finally {
    setIsLoading(false)
  }
}
```

### 📊 So sánh v1.0 vs v2.0

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Storage | LocalStorage | IndexedDB + LocalStorage |
| Max file size | ~5MB | ~50MB |
| Video support | ❌ | ✅ MP4, WebM |
| File validation | ❌ | ✅ Size check |
| Loading states | ❌ | ✅ Spinner |
| Error messages | Generic | Specific |
| Async operations | ❌ | ✅ |
| Performance | Blocking | Non-blocking |

### 🐛 Bug Fixes

- ✅ Fixed: Data not saving after upload
- ✅ Fixed: QuotaExceededError với file lớn
- ✅ Fixed: UI freeze khi upload
- ✅ Fixed: Không có feedback khi upload
- ✅ Fixed: GIF không lưu được
- ✅ Fixed: Không validate file size

### 🎯 Next Steps (Future)

Các tính năng có thể thêm trong tương lai:

- [ ] Cloud storage option (Firebase Storage, Cloudinary)
- [ ] Nén ảnh/video tự động
- [ ] Export/Import dữ liệu
- [ ] Sync giữa nhiều thiết bị
- [ ] Thumbnail generation
- [ ] Search/filter trong kho
- [ ] Sorting options
- [ ] Batch upload
- [ ] Drag & drop upload
- [ ] Progress bar cho upload

---

## Version 1.0.0 (Initial Release)

### ✨ Features

- Trang chủ với 3 nút điều hướng
- Kho Animation (ảnh, GIF)
- Kho Sound
- Quản lý Preset
- Trang Focus với timer Pomodoro
- LocalStorage cho lưu trữ
- Fullscreen mode
- Orientation lock

### 🐛 Known Issues (Đã khắc phục trong v2.0)

- Không lưu được file lớn
- Không hỗ trợ video
- Không có validation
- Không có loading states

---

**Ngày cập nhật**: 15/10/2025

