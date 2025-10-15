# 🔧 Troubleshooting - ChillPomodoro

## Vấn đề thường gặp và cách khắc phục

### 1. ❌ Dữ liệu không được lưu

#### Triệu chứng:
- Upload ảnh/GIF/video nhưng kho vẫn trống
- Sau khi nhấn "Thêm mới", modal đóng nhưng không thấy item

#### Nguyên nhân:
- File quá lớn (> 50MB)
- Trình duyệt không hỗ trợ IndexedDB
- Private/Incognito mode có thể block storage

#### Giải pháp:

**Bước 1**: Kiểm tra kích thước file
```
Kích thước file phải < 50MB
Nếu lớn hơn, nén file trước khi upload
```

**Bước 2**: Kiểm tra Console
1. Mở DevTools (F12)
2. Tab Console
3. Xem có lỗi không?

**Bước 3**: Kiểm tra IndexedDB
1. DevTools > Application (Chrome) hoặc Storage (Firefox)
2. IndexedDB > ChillPomodoroDB
3. Xem có database không?

**Bước 4**: Clear và thử lại
```javascript
// Trong Console:
indexedDB.deleteDatabase('ChillPomodoroDB')
// Sau đó reload trang và thử lại
```

---

### 2. 🖼️ Ảnh/GIF không hiển thị

#### Triệu chứng:
- Item đã lưu nhưng hiển thị "No Image"
- Video không phát

#### Nguyên nhân:
- URL không hợp lệ
- CORS policy
- File format không được hỗ trợ

#### Giải pháp:

**Với URL từ internet:**
- Đảm bảo URL trực tiếp đến file (kết thúc .jpg, .gif, .mp4)
- Sử dụng CORS-friendly hosting (Imgur, Cloudinary)
- Test URL trong tab mới trước

**Với upload file:**
- Kiểm tra format: JPG, PNG, GIF, MP4, WebM
- File không bị corrupt
- Thử file khác để test

**Quick fix:**
1. Xóa item bị lỗi
2. Upload lại file
3. Hoặc dùng URL thay vì upload

---

### 3. 🔊 Âm thanh không phát

#### Triệu chứng:
- Nhấn Play nhưng không có tiếng
- Icon loading nhưng không chạy

#### Nguyên nhân:
- Trình duyệt block autoplay audio
- File audio corrupt
- Format không được hỗ trợ

#### Giải pháp:

**Bước 1**: User interaction required
```
Trình duyệt yêu cầu user phải click/tap trước
Đảm bảo đã click "Bắt đầu" trong Focus page
```

**Bước 2**: Kiểm tra format
```
Hỗ trợ: MP3, WAV, OGG
Không hỗ trợ: FLAC, AAC (một số trình duyệt)
```

**Bước 3**: Test âm thanh
- Trong Sound Library, click Play
- Nếu không chạy, file có vấn đề

**Bước 4**: Volume
- Kiểm tra volume trong app
- Kiểm tra volume hệ thống

---

### 4. 📱 Vấn đề trên Mobile/iOS

#### Triệu chứng:
- GIF không chạy
- Video không phát
- Fullscreen không hoạt động

#### Giải pháp cho GIF:

```
GIF đã được optimize với CSS:
transform: translateZ(0)

Nếu vẫn không chạy:
1. Dùng video thay vì GIF
2. Convert GIF sang MP4 (nhẹ hơn)
```

#### Giải pháp cho Video:

```
Video cần attributes:
- autoPlay
- loop
- muted
- playsInline

Đã được thêm trong code, nhưng iOS vẫn có thể block.
```

#### Giải pháp cho Fullscreen:

```
iOS Safari có giới hạn fullscreen API
Thử:
1. Thêm app vào Home Screen (Add to Home Screen)
2. Chạy như PWA
```

---

### 5. 🚀 Performance Issues

#### Triệu chứng:
- App chạy chậm
- UI lag
- Trang không load

#### Giải pháp:

**Quá nhiều file lớn:**
```
1. Xóa files không dùng
2. Nén ảnh/video trước khi upload
3. Dùng URL thay vì upload nếu có thể
```

**Quá nhiều sounds phát cùng lúc:**
```
Giới hạn: 3-5 sounds max
Nhiều hơn có thể gây lag
```

**Clear cache:**
```javascript
// Console:
indexedDB.deleteDatabase('ChillPomodoroDB')
localStorage.clear()
// Reload page
```

---

### 6. 🔄 Data Migration Issues

#### Triệu chứng:
- Dữ liệu cũ (v1.0) không thấy nữa
- Mất preset đã tạo

#### Giải pháp:

**Preset vẫn còn:**
```
Preset lưu trong LocalStorage (không đổi)
Vào Quản lý Preset để xem
```

**Animation/Sound cũ:**
```
LocalStorage data cũ không tự động migrate
Phải thêm lại hoặc dùng migration script
(Xem CHANGELOG.md)
```

---

### 7. 🌐 Browser Compatibility

#### IndexedDB support:

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 24+ | ✅ Full support |
| Firefox | 16+ | ✅ Full support |
| Safari | 10+ | ✅ Full support |
| Edge | 12+ | ✅ Full support |
| Opera | 15+ | ✅ Full support |
| iOS Safari | 10+ | ✅ Full support |
| Chrome Mobile | All | ✅ Full support |

#### Nếu trình duyệt quá cũ:

```
Update browser lên version mới nhất
Hoặc dùng Chrome/Firefox
```

---

### 8. 🔐 Private/Incognito Mode

#### Vấn đề:
```
Private mode có thể:
- Block IndexedDB
- Xóa data sau khi đóng tab
- Giới hạn storage capacity
```

#### Giải pháp:
```
Sử dụng normal browsing mode
Data sẽ được lưu lâu dài
```

---

### 9. ⚠️ Error Messages

#### "File quá lớn! Vui lòng chọn file nhỏ hơn 50MB"

**Giải pháp:**
- Nén file trước khi upload
- Dùng tool online: TinyPNG, HandBrake
- Hoặc dùng URL thay vì upload

#### "Lỗi khi tải danh sách animation/sound"

**Giải pháp:**
1. Reload trang
2. Clear IndexedDB
3. Kiểm tra Console cho error chi tiết

#### "Lỗi khi lưu animation/sound"

**Giải pháp:**
1. Kiểm tra kích thước file
2. Thử file khác
3. Clear cache và thử lại

---

### 10. 🧪 Debug Mode

Để debug chi tiết:

```javascript
// Trong Console DevTools:

// 1. Xem tất cả animations
const { getAllAnimations } = await import('./src/utils/indexedDB.js')
const animations = await getAllAnimations()
console.log(animations)

// 2. Xem database info
const dbs = await indexedDB.databases()
console.log(dbs)

// 3. Check storage usage
if (navigator.storage && navigator.storage.estimate) {
  const estimate = await navigator.storage.estimate()
  console.log('Used:', estimate.usage, 'Quota:', estimate.quota)
}
```

---

## 📞 Vẫn gặp vấn đề?

### Checklist trước khi báo lỗi:

- [ ] Đã thử reload trang
- [ ] Đã kiểm tra Console cho errors
- [ ] Đã thử browser khác
- [ ] Đã clear cache/storage
- [ ] Đã kiểm tra file size/format
- [ ] Đã đọc hết Troubleshooting guide này

### Báo lỗi hiệu quả:

Cung cấp thông tin:
1. Browser & version
2. OS (Windows/Mac/iOS/Android)
3. Bước tái hiện lỗi
4. Screenshot/video lỗi
5. Console errors (nếu có)
6. File đang upload (size, format)

---

**Cập nhật lần cuối**: 15/10/2025

