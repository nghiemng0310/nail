# 📖 Hướng dẫn sử dụng

## 🎬 Khởi động ứng dụng

```bash
# Cài đặt dependencies (chỉ cần làm 1 lần)
npm install

# Chạy development server
npm run dev

# Mở trình duyệt tại: http://localhost:5173/nail
```

## 🧭 Navigation

Ứng dụng có **Bottom Navigation** cố định ở dưới màn hình với 2 tab:
- 🏠 **Trang chủ**: Xem gallery hình ảnh
- ⚙️ **Quản lý**: CRUD hình ảnh

Click vào icon ở bottom navigation để chuyển trang.

## 📸 Các chức năng

## 🏠 Trang chủ (Gallery)

### Xem hình ảnh
Trang chủ hiển thị tất cả hình ảnh dạng grid:
- **Mobile**: 2 cột
- **Tablet**: 3 cột  
- **Desktop**: 4 cột
- **Large screen**: 5 cột

### Tìm kiếm
1. Sử dụng thanh tìm kiếm ở đầu trang
2. Nhập tên hình ảnh muốn tìm
3. Kết quả hiện ngay lập tức (real-time)
4. Click X để xóa tìm kiếm

### Preview hình ảnh
1. Click vào bất kỳ hình ảnh nào
2. Hình ảnh sẽ zoom to ra
3. **Lướt qua phải/trái** để xem ảnh khác:
   - Dùng mũi tên ◀ ▶ ở hai bên
   - Dùng phím ← → trên bàn phím
   - Swipe trái/phải trên mobile
4. Có thể zoom in/out thêm (scroll/pinch)
5. Click bên ngoài hoặc ESC để đóng

### Hover effects
Khi rê chuột qua hình ảnh (desktop):
- Hình nổi lên nhẹ
- Hiện tên hình ảnh ở dưới
- Shadow tăng lên

## ⚙️ Trang quản lý

### 1. Chuyển sang trang quản lý

Click tab **"Quản lý"** ở bottom navigation

### 2. Xem danh sách hình ảnh

Bạn sẽ thấy bảng hiển thị tất cả hình ảnh với:
- Thumbnail hình ảnh (80x80px)
- Tên hình ảnh
- Ngày tạo
- Các nút hành động (Sửa, Xóa)

### 3. Thêm hình ảnh mới

**Bước 1:** Click nút "Thêm hình ảnh" ở góc trên bên phải

**Bước 2:** Trong dialog xuất hiện:
- Nhập tên hình ảnh (bắt buộc)
- Click vào khung upload để chọn file hình ảnh
  - Chỉ chấp nhận file ảnh (jpg, png, gif, webp, v.v.)
  - Kích thước tối đa: 5MB

**Bước 3:** Click nút "Tạo"
- Progress bar sẽ hiển thị tiến trình upload
- Sau khi hoàn tất, hình ảnh mới sẽ xuất hiện trong bảng
- Thông báo "Tạo hình ảnh thành công" sẽ hiện lên

### 4. Chỉnh sửa hình ảnh

**Bước 1:** Click nút "Sửa" trên hàng cần chỉnh sửa

**Bước 2:** Dialog mở ra với thông tin hiện tại:
- Tên hình ảnh (có thể chỉnh sửa)
- Hình ảnh hiện tại được hiển thị bên dưới

**Bước 3:** Bạn có thể:
- Chỉ đổi tên → Không chọn file mới
- Chỉ đổi hình → Chọn file mới (hình cũ sẽ tự động bị xóa)
- Đổi cả tên và hình

**Bước 4:** Click nút "Cập nhật"
- Nếu có hình mới, progress bar sẽ hiển thị
- Thông báo "Cập nhật hình ảnh thành công" sẽ hiện lên

### 5. Xóa hình ảnh

**Bước 1:** Click nút "Xóa" trên hàng cần xóa

**Bước 2:** Dialog xác nhận xuất hiện với nội dung "Bạn có chắc chắn muốn xóa?"

**Bước 3:** Click "Có" để xác nhận hoặc "Không" để hủy
- Sau khi xóa, hình ảnh sẽ biến mất khỏi bảng
- File cũng bị xóa hoàn toàn khỏi Firebase Storage
- Thông báo "Xóa hình ảnh thành công" sẽ hiện lên

### 6. Xem trước hình ảnh (Preview)

Click vào bất kỳ hình ảnh nào trong bảng để xem phóng to. Có thể lướt qua các ảnh khác bằng:
- Nút mũi tên ◀ ▶
- Phím ← → trên bàn phím
- Swipe trái/phải (mobile)

### 7. Quay về trang chủ

Sau khi thêm/sửa/xóa, click tab **"Trang chủ"** ở bottom navigation để xem kết quả trong gallery

## 🎨 Giao diện

### Bottom Navigation
- Cố định ở dưới màn hình
- Background trắng với shadow nhẹ
- 2 tabs: Trang chủ và Quản lý
- Active tab có màu xanh (#1890ff)
- Hover effect mượt mà

### Trang chủ
- Background màu xám nhạt (#f0f2f5)
- Gallery grid responsive
- Search bar ở đầu trang
- Hiển thị số lượng hình ảnh
- Mỗi ảnh có:
  - Aspect ratio 1:1 (vuông)
  - Border radius 12-16px
  - Hover: hiện tên và nổi lên
  - Click: zoom preview

### Trang quản lý
- Background màu xám nhạt (#f0f2f5)
- Nút "Thêm hình ảnh" ở góc phải
- Bảng với các cột:
  - **Hình ảnh**: 80x80px thumbnail
  - **Tên**: Tên hình ảnh
  - **Ngày tạo**: Format Việt Nam (dd/mm/yyyy hh:mm:ss)
  - **Hành động**: Nút Sửa và Xóa

### Pagination
- 10 items mỗi trang (có thể thay đổi)
- Hiển thị tổng số hình ảnh

## ⚠️ Lưu ý

### Validation
- **Tên hình ảnh**: Bắt buộc phải nhập
- **File hình ảnh**: 
  - Bắt buộc khi tạo mới
  - Không bắt buộc khi chỉnh sửa (nếu không muốn đổi hình)
- **Loại file**: Chỉ chấp nhận file hình ảnh
- **Kích thước file**: Tối đa 5MB

### Error Handling
Ứng dụng sẽ hiển thị thông báo lỗi nếu:
- Không nhập tên hình ảnh
- File không phải là hình ảnh
- File quá lớn (> 5MB)
- Lỗi kết nối Firebase
- Lỗi upload

### Loading States
- Table có loading spinner khi đang tải dữ liệu
- Modal có loading state khi đang tạo/cập nhật
- Progress bar hiển thị khi đang upload

## 🔧 Troubleshooting

### Không load được hình ảnh?
- Kiểm tra kết nối internet
- Kiểm tra Firebase console xem Storage có bật không
- Kiểm tra Firebase rules cho phép read/write

### Upload bị lỗi?
- Kiểm tra kích thước file (< 5MB)
- Kiểm tra định dạng file (phải là hình ảnh)
- Kiểm tra Firebase Storage quota

### Không xóa được?
- Kiểm tra Firebase rules
- Kiểm tra quyền truy cập Storage

## 📱 Responsive Design

Ứng dụng hoạt động tốt trên:
- ✅ Desktop (≥ 1024px)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)

### Trang chủ responsive:
- **Mobile**: 2 cột grid, padding 20px
- **Tablet**: 3 cột grid, padding 32px
- **Desktop**: 4 cột grid, padding 40px
- **Large**: 5 cột grid

### Trang quản lý responsive:
- **Mobile**: Bảng scroll ngang, nút nhỏ gọn
- **Tablet**: Bảng rộng hơn, nút to hơn
- **Desktop**: Bảng full width, UX tối ưu

### Bottom navigation responsive:
- **Mobile**: Full width, 60px cao
- **Tablet**: Full width, 70px cao, icons lớn hơn
- **Desktop**: Max-width 600px, bo góc trên

## 🚀 Tips & Tricks

### Trang chủ:
1. **Tìm kiếm nhanh**: Dùng thanh search để tìm ảnh theo tên
2. **Preview**: Click vào ảnh để xem phóng to, dùng wheel/pinch để zoom
3. **Reload**: Pull down để refresh (trên mobile)

### Trang quản lý:
1. **Upload nhanh**: Nén hình ảnh trước khi upload để tăng tốc độ
2. **Đặt tên rõ ràng**: Đặt tên có ý nghĩa để dễ tìm kiếm
3. **Kiểm tra trước khi xóa**: Xác nhận kỹ vì không thể khôi phục
4. **Backup**: Nên backup hình ảnh quan trọng ở nơi khác
5. **Batch operations**: Xử lý nhiều ảnh cùng lúc nếu cần

### Navigation:
1. **Quick switch**: Dùng bottom nav để chuyển nhanh giữa 2 trang
2. **Back button**: Có thể dùng nút back của browser
3. **Bookmarks**: Có thể bookmark cả 2 trang riêng

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console log trong browser (F12 → Console)
2. Network tab để xem request có lỗi không
3. Firebase Console để xem logs

## 🎯 Next Steps (Tính năng có thể thêm)

### Trang chủ:
- [x] Tìm kiếm hình ảnh theo tên ✅
- [ ] Filter theo ngày tạo
- [ ] Sort options (mới nhất, cũ nhất, A-Z)
- [ ] View mode toggle (grid/masonry/list)
- [ ] Infinite scroll thay pagination
- [ ] Favorites/Like system

### Trang quản lý:
- [ ] Bulk upload (upload nhiều hình cùng lúc)
- [ ] Bulk delete (xóa nhiều ảnh)
- [ ] Categories/Tags cho hình ảnh
- [ ] Drag & drop để reorder
- [ ] Copy link hình ảnh
- [ ] Download hình ảnh
- [ ] Image editing (crop, resize, filters)
- [ ] Duplicate detection

### Navigation & UX:
- [ ] Dark mode toggle
- [ ] PWA support (install như app)
- [ ] Offline mode
- [ ] Push notifications
- [ ] Keyboard shortcuts
- [ ] Gesture controls (swipe)

