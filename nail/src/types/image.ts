// Image model type
export interface ImageModel {
  id: string;
  name: string;
  image: string; // URL of image in Firebase Storage
  categories: string[]; // Array of category names
  likes: number; // Total number of likes
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ImageFormData {
  name: string;
  categories: string[];
  file?: File;
}

// Available image categories
export const IMAGE_CATEGORIES = [
  'Móng tay',
  'Móng chân',
  'Nail Art',
  'French',
  'Ombre',
  'Gel',
  'Acrylic',
  'Đính đá',
  'Hoa văn',
  'Gradient',
  'Màu sắc',
  'Thiết kế 3D',
  'Minimalist',
  'Cưới',
  'Lễ hội',
  'Khác'
] as const;

