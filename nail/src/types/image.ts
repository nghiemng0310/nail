// Image model type
export interface ImageModel {
  id: string;
  name: string;
  image: string; // URL of image in Firebase Storage
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ImageFormData {
  name: string;
  file?: File;
}

