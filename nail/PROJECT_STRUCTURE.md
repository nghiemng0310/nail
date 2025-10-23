# Cấu trúc dự án Nail Management

## 📁 Cấu trúc thư mục

```
src/
├── config/              # Cấu hình ứng dụng
│   └── firebase.ts      # Cấu hình Firebase
├── types/               # TypeScript type definitions
│   └── image.ts         # Model cho Image
├── services/            # Business logic và API calls
│   └── imageService.ts  # CRUD operations cho images
├── pages/               # Các trang chính của ứng dụng
│   └── ImageManagement.tsx  # Trang quản lý hình ảnh
├── components/          # Các component tái sử dụng (có thể thêm sau)
├── assets/              # Tài nguyên tĩnh (hình ảnh, icons, v.v.)
├── App.tsx              # Component chính với routing
├── App.css              # Styles cho App
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🔥 Firebase Integration

### Collections
- **images**: Lưu trữ metadata của hình ảnh
  - `id`: string (auto-generated)
  - `name`: string
  - `image`: string (URL từ Firebase Storage)
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

### Storage
- **images/**: Thư mục lưu trữ file hình ảnh thực tế

## 📝 Model

### ImageModel
```typescript
interface ImageModel {
  id: string;
  name: string;
  image: string;  // URL của hình ảnh trong Firebase Storage
  createdAt?: Date;
  updatedAt?: Date;
}
```

## 🛠️ Các tính năng chính

### Trang Quản lý Hình ảnh (ImageManagement)
- ✅ **CREATE**: Thêm hình ảnh mới
  - Upload file lên Firebase Storage
  - Lưu metadata vào Firestore
  - Hiển thị progress bar khi upload
  
- ✅ **READ**: Xem danh sách hình ảnh
  - Hiển thị trong bảng với pagination
  - Preview hình ảnh
  - Xem ngày tạo
  
- ✅ **UPDATE**: Chỉnh sửa hình ảnh
  - Cập nhật tên
  - Thay đổi hình ảnh (tự động xóa hình cũ)
  
- ✅ **DELETE**: Xóa hình ảnh
  - Xóa metadata từ Firestore
  - Xóa file từ Firebase Storage
  - Có confirmation dialog

## 🎨 UI/UX Features
- Sử dụng Ant Design components
- Responsive design
- Vietnamese language support
- Upload progress indicator
- Image preview
- Confirmation dialogs
- Error handling và notifications

## 🔒 Validation
- File type: Chỉ chấp nhận hình ảnh
- File size: Tối đa 5MB
- Required fields: Tên hình ảnh là bắt buộc

## 🚀 Cách sử dụng

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📦 Dependencies chính
- React 18
- TypeScript
- Ant Design
- Firebase (Firestore + Storage)
- React Router DOM

## 🔄 Flow hoạt động

### Thêm hình ảnh mới
1. User click nút "Thêm hình ảnh"
2. Nhập tên và chọn file
3. Click "Tạo"
4. File được upload lên Firebase Storage với progress bar
5. Sau khi upload xong, metadata được lưu vào Firestore
6. Danh sách được refresh tự động

### Chỉnh sửa hình ảnh
1. User click nút "Sửa" trên hàng cần sửa
2. Modal hiển thị với thông tin hiện tại
3. User có thể:
   - Đổi tên
   - Giữ nguyên hình cũ hoặc upload hình mới
4. Click "Cập nhật"
5. Nếu có hình mới, hình cũ sẽ bị xóa khỏi Storage
6. Metadata được cập nhật trong Firestore

### Xóa hình ảnh
1. User click nút "Xóa"
2. Confirmation dialog xuất hiện
3. Nếu xác nhận:
   - Metadata bị xóa khỏi Firestore
   - File bị xóa khỏi Firebase Storage
   - Danh sách được refresh

## 🎯 Best Practices được áp dụng
- ✅ Tách biệt concerns (config, types, services, pages)
- ✅ Type-safe với TypeScript
- ✅ Error handling đầy đủ
- ✅ Loading states
- ✅ User feedback (messages, progress)
- ✅ Clean code và comments
- ✅ Responsive UI
- ✅ Validation

