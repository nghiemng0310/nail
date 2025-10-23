# 📝 Changelog

## [2.1.0] - 2024-10-22

### ✨ Tính năng mới

#### 🖼️ Image Navigation
- ✅ **Lướt qua các ảnh** khi đang preview
  - Dùng mũi tên ◀ ▶ 
  - Phím ← → trên bàn phím
  - Swipe trái/phải trên mobile
- Áp dụng cho cả Trang chủ và Trang quản lý
- Smooth transitions giữa các ảnh

---

## [2.0.0] - 2024-10-22

### ✨ Tính năng mới

#### 🏠 Trang chủ (Gallery)
- Thêm trang chủ với gallery view hiển thị hình ảnh
- Grid layout responsive (2-5 cột tùy màn hình)
- Tính năng tìm kiếm real-time theo tên
- Preview hình ảnh với zoom
- Lazy loading và animations mượt mà
- Hover effects trên desktop

#### 📱 Bottom Navigation
- Thêm bottom navigation cố định ở dưới màn hình
- 2 tabs: Trang chủ và Quản lý
- Responsive design cho mọi thiết bị
- Active state với màu xanh
- Smooth transitions và hover effects

#### 🎨 UI/UX Improvements
- Cải thiện responsive design
- Thêm search functionality
- Better spacing và padding
- Improved color scheme
- Modern animations

### 🔧 Cải tiến

#### Cấu trúc dự án
- Tổ chức lại source tree
- Thêm `components/` folder
- Tách CSS cho từng page
- Better separation of concerns

#### Performance
- Lazy loading images
- Optimized re-renders
- Better memory management
- URL cleanup để prevent leaks

#### Documentation
- Thêm `FEATURES.md` - Chi tiết tính năng
- Cập nhật `USAGE_GUIDE.md` - Hướng dẫn mới
- Cập nhật `README.md` - Tổng quan dự án
- Thêm `CHANGELOG.md` - Lịch sử thay đổi

### 🐛 Bug Fixes
- Fix lỗi upload file (originFileObj undefined)
- Fix memory leaks từ object URLs
- Cải thiện error handling

---

## [1.0.0] - 2024-10-22

### ✨ Tính năng ban đầu

#### 🔥 Firebase Integration
- Setup Firebase config
- Firestore database
- Storage cho hình ảnh

#### ⚙️ CRUD Operations
- Create: Upload và thêm hình ảnh
- Read: Xem danh sách trong bảng
- Update: Chỉnh sửa tên và hình
- Delete: Xóa với confirmation

#### 🎨 UI Components
- Table view với Ant Design
- Modal cho create/edit
- Upload component
- Progress bar
- Pagination

#### 📝 Project Setup
- React + TypeScript + Vite
- Ant Design UI library
- React Router
- Firebase SDK
- ESLint + Prettier

### 📁 Cấu trúc
- `config/` - Firebase configuration
- `types/` - TypeScript types
- `services/` - Business logic
- `pages/` - Page components

---

## Upcoming Features 🚀

### Phase 1 (Short term)
- [ ] Sort functionality
- [ ] Filter by date
- [ ] View mode toggle
- [ ] Bulk operations
- [ ] Download images

### Phase 2 (Medium term)
- [ ] Categories/Tags
- [ ] Favorites system
- [ ] Share functionality
- [ ] Dark mode
- [ ] PWA support

### Phase 3 (Long term)
- [ ] Image editing
- [ ] User authentication
- [ ] Multi-user support
- [ ] Analytics
- [ ] Advanced search

