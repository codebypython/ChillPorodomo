# 📘 Hướng dẫn IndexedDB trong ChillPomodoro

## Tại sao chuyển sang IndexedDB?

### Vấn đề với LocalStorage:
- ❌ Giới hạn ~5-10MB
- ❌ Base64 encoding làm file tăng kích thước ~33%
- ❌ Không phù hợp cho ảnh/GIF/video lớn
- ❌ Blocking (đồng bộ) - ảnh hưởng hiệu suất

### Ưu điểm của IndexedDB:
- ✅ Lưu được ~50MB-1GB (tùy trình duyệt)
- ✅ Lưu file base64 lớn không vấn đề
- ✅ Non-blocking (bất đồng bộ)
- ✅ Hỗ trợ transactions
- ✅ Tương thích tốt trên mọi trình duyệt

## Cách hoạt động

### 1. Khởi tạo Database

```javascript
import { initDB } from './utils/indexedDB'

// Tự động khởi tạo khi gọi các hàm
await initDB() // Tạo database "ChillPomodoroDB"
```

### 2. Lưu Animation/Sound

**Animation với file upload:**
```javascript
import { fileToBase64, isFileSizeValid, addAnimationToDB } from './utils/indexedDB'

// 1. Validate file size
if (!isFileSizeValid(file, 50)) {
  alert('File quá lớn! Tối đa 50MB')
  return
}

// 2. Convert to base64
const base64 = await fileToBase64(file)

// 3. Save to IndexedDB
const animation = {
  name: 'Lofi Girl',
  url: base64, // base64 string
  type: 'video' // hoặc 'image', 'gif'
}

await addAnimationToDB(animation)
```

### 3. Lấy danh sách

```javascript
import { getAllAnimations, getAllSounds } from './utils/indexedDB'

const animations = await getAllAnimations()
const sounds = await getAllSounds()
```

### 4. Cập nhật

```javascript
import { updateAnimationInDB } from './utils/indexedDB'

await updateAnimationInDB('animation_id', {
  name: 'New Name',
  type: 'gif'
})
```

### 5. Xóa

```javascript
import { deleteAnimationFromDB } from './utils/indexedDB'

await deleteAnimationFromDB('animation_id')
```

## Giới hạn kích thước file

### Khuyến nghị:
- **Ảnh/GIF**: < 10MB
- **Video**: < 50MB
- **Audio**: < 20MB

### Kiểm tra trước khi upload:

```javascript
import { isFileSizeValid } from './utils/indexedDB'

if (!isFileSizeValid(file, 50)) {
  alert('File quá lớn!')
  return
}
```

## Lưu ý quan trọng

### 1. Async/Await bắt buộc

IndexedDB hoạt động bất đồng bộ, phải dùng `async/await`:

```javascript
// ❌ SAI
const animations = getAnimations()

// ✅ ĐÚNG
const animations = await getAnimations()
```

### 2. Error handling

Luôn wrap trong try-catch:

```javascript
try {
  const data = await getAllAnimations()
  setAnimations(data)
} catch (error) {
  console.error('Error:', error)
  alert('Lỗi khi tải dữ liệu')
}
```

### 3. Loading states

Hiển thị loading khi xử lý:

```javascript
const [isLoading, setIsLoading] = useState(false)

const loadData = async () => {
  setIsLoading(true)
  try {
    const data = await getAllAnimations()
    setAnimations(data)
  } finally {
    setIsLoading(false)
  }
}
```

### 4. URL từ file vs URL từ internet

```javascript
// File upload -> base64
const base64 = await fileToBase64(file)
// base64: "data:image/png;base64,iVBORw0KGgo..."

// URL từ internet
const url = "https://example.com/image.gif"
// Lưu trực tiếp, không cần convert
```

## Tại sao vẫn dùng LocalStorage cho Presets?

**Preset chỉ lưu metadata nhẹ:**
```javascript
{
  id: "123",
  name: "Lofi + Rain",
  soundIds: ["sound1", "sound2"] // Chỉ lưu ID, không lưu file
}
```

Không cần IndexedDB cho dữ liệu nhỏ như này.

## Debug & Testing

### Xem dữ liệu trong IndexedDB:

1. Mở DevTools (F12)
2. Tab **Application** (Chrome) hoặc **Storage** (Firefox)
3. Mở **IndexedDB** > **ChillPomodoroDB**
4. Xem tables: `animations`, `sounds`

### Xóa toàn bộ dữ liệu (để test):

```javascript
// Trong Console của DevTools
indexedDB.deleteDatabase('ChillPomodoroDB')
```

## So sánh LocalStorage vs IndexedDB

| Tính năng | LocalStorage | IndexedDB |
|-----------|--------------|-----------|
| Kích thước | ~5-10MB | ~50MB-1GB |
| Loại dữ liệu | String only | Any type |
| Async | ❌ Sync | ✅ Async |
| Cấu trúc | Key-Value | Database với tables |
| Hiệu suất | Chậm với data lớn | Nhanh |
| Use case | Metadata nhỏ | Files lớn |

## Troubleshooting

### Lỗi: QuotaExceededError

**Nguyên nhân**: File quá lớn hoặc storage đầy

**Giải pháp**:
1. Giảm kích thước file
2. Xóa data cũ không dùng
3. Nén ảnh/video trước khi upload

### Lỗi: File không hiển thị

**Kiểm tra**:
1. URL có đúng format base64?
2. File type có đúng không? (video cần `<video>`, image cần `<img>`)
3. Console có lỗi CORS không?

### Lỗi: Data không tải được

**Kiểm tra**:
1. Có dùng `await` chưa?
2. Component có re-render sau khi load?
3. IndexedDB có bị block không? (Private browsing mode)

## Best Practices

### 1. Optimize file size

```javascript
// Nén ảnh trước khi lưu
const compressImage = async (file) => {
  // Sử dụng Canvas API để resize
  // ... implementation
}
```

### 2. Lazy loading

```javascript
// Chỉ load khi cần
useEffect(() => {
  if (isModalOpen) {
    loadAnimations()
  }
}, [isModalOpen])
```

### 3. Caching

```javascript
// Cache trong memory để không phải query lại
const [cachedAnimations, setCachedAnimations] = useState(null)

const getAnimationsWithCache = async () => {
  if (cachedAnimations) return cachedAnimations
  const data = await getAllAnimations()
  setCachedAnimations(data)
  return data
}
```

---

**Kết luận**: IndexedDB giúp ChillPomodoro lưu được file lớn, khắc phục vấn đề của LocalStorage. Việc chuyển đổi đã được thực hiện tự động trong code! 🎉

