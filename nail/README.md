# 🖼️ Nail Image Management System

Hệ thống quản lý hình ảnh với Firebase, được xây dựng bằng React + TypeScript + Vite + Ant Design.

## ✨ Tính năng

### 🏠 Trang chủ (Gallery)
- 🖼️ **Gallery view** hiển thị hình ảnh đẹp mắt
- 🔍 **Tìm kiếm** hình ảnh theo tên
- 📱 **Responsive grid** (2-5 cột tùy màn hình)
- 🎨 **Preview** hình ảnh với zoom
- ◀▶ **Lướt qua** các ảnh khác khi preview
- ⚡ **Lazy loading** và smooth animations

### ⚙️ Trang quản lý
- ✅ **CRUD đầy đủ** cho hình ảnh (Tạo, Đọc, Cập nhật, Xóa)
- 📤 **Upload hình ảnh** với progress bar
- ✏️ **Chỉnh sửa** tên và thay đổi hình ảnh
- 🗑️ **Xóa an toàn** với confirmation dialog
- 📊 **Table view** với pagination

### 🎯 Navigation & UX
- 📱 **Bottom Navigation** cố định ở dưới màn hình
- 🔄 **Responsive design** trên mọi thiết bị
- 🔥 **Firebase Integration** (Firestore + Storage)
- 🇻🇳 **Hỗ trợ tiếng Việt**
- 🎨 **Modern UI** với Ant Design

## 🚀 Bắt đầu

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📁 Cấu trúc dự án

```
src/
├── config/              # Cấu hình Firebase
│   └── firebase.ts
├── types/               # TypeScript types
│   └── image.ts
├── services/            # Business logic
│   └── imageService.ts
├── pages/               # Các trang
│   ├── Home.tsx         # Trang chủ (Gallery)
│   ├── Home.css
│   ├── ImageManagement.tsx  # Trang quản lý (CRUD)
│   └── ImageManagement.css
├── components/          # Reusable components
│   ├── Layout.tsx       # Layout với bottom navigation
│   └── Layout.css
├── App.tsx              # Main app với routing
├── App.css              # Global styles
└── main.tsx             # Entry point
```

📚 Xem thêm:
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Chi tiết cấu trúc
- [FEATURES.md](./FEATURES.md) - Tính năng chi tiết
- [USAGE_GUIDE.md](./USAGE_GUIDE.md) - Hướng dẫn sử dụng

## 🔥 Firebase Setup

Dự án đã được cấu hình sẵn Firebase. Nếu muốn dùng Firebase project của bạn:

1. Tạo Firebase project tại [Firebase Console](https://console.firebase.google.com/)
2. Bật Firestore Database và Storage
3. Cập nhật config trong `src/config/firebase.ts`

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Ant Design** - UI components
- **Firebase** - Backend (Firestore + Storage)
- **React Router** - Routing

## 🎯 Model

```typescript
interface ImageModel {
  id: string;           // Auto-generated
  name: string;         // Tên hình ảnh
  image: string;        // URL trong Firebase Storage
  createdAt?: Date;     // Ngày tạo
  updatedAt?: Date;     // Ngày cập nhật
}
```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
