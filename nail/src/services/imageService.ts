import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  Timestamp,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  QueryDocumentSnapshot,
  increment,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { ImageModel, ImageFormData } from '../types/image';
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
const COLLECTION_NAME = 'images';
async function compressImageSmart(file: File) {
  let imageFile = file;

  // Nếu là HEIC → chỉ convert, không nén
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    const blob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 1, // giữ nguyên chất lượng gốc
    });
    imageFile = new File([blob as BlobPart], file.name.replace(/\.[^/.]+$/, '.jpg'), {
      type: 'image/jpeg',
    });
    return imageFile; // ⬅️ trả về sau khi convert, không nén thêm
  }

  // Các định dạng khác (JPEG, PNG, …) → nén nhẹ để giảm dung lượng
  const compressed = await imageCompression(imageFile, {
    maxSizeMB: 1,
    initialQuality: 0.6,
    useWebWorker: true,
  });

  return compressed;
}

/**
 * Upload image to Firebase Storage
 */
export const uploadImage = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error("Error uploading image: ", error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

/**
 * Delete image from Firebase Storage
 */
export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image from storage: ", error);
    throw error;
  }
};

/**
 * Create new image record
 */
export const createImage = async (
  data: ImageFormData,
  file: File,
  onProgress?: (progress: number) => void,
  quality: number = 0.7
): Promise<string> => {
  try {
    // Upload image first

    // const imageUrl = await uploadImage(file, onProgress);


    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/\.[^/.]+$/, '')}.webp`;
    const path = `images/${fileName}`;

    const compressedFile = await compressImageSmart(file);
    // Resize & upload ảnh (maxWidth = 600px để giảm dung lượng tốt hơn)
    await resizeAndUploadImage(compressedFile, path, 800, quality, onProgress);

    // Lấy URL download
    const imageRef = ref(storage, path);
    const imageUrl = await getDownloadURL(imageRef);
    // Create document in Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      name: data.name,
      image: imageUrl,
      categories: data.categories || [],
      likes: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating image: ", error);
    throw error;
  }
};

/**
 * Get all images (for admin/management)
 */
export const getAllImages = async (): Promise<ImageModel[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const images: ImageModel[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      images.push({
        id: doc.id,
        name: data.name,
        image: data.image,
        categories: data.categories || [],
        likes: data.likes || 0,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });

    return images;
  } catch (error) {
    console.error("Error getting images: ", error);
    throw error;
  }
};

/**
 * Get images with pagination and filtering
 */
export interface GetImagesOptions {
  pageSize?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  categories?: string[];
}

export interface GetImagesResult {
  images: ImageModel[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const getImages = async (
  options: GetImagesOptions = {}
): Promise<GetImagesResult> => {
  try {
    const { pageSize = 10, lastDoc, categories } = options;
    const collectionRef = collection(db, COLLECTION_NAME);
    
    // Build query
    let q;
    
    if (categories && categories.length > 0) {
      // Filter by categories - Firebase doesn't support array-contains-any with orderBy without composite index
      // So we fetch more documents and sort client-side
      const fetchSize = 100; // Fetch more to have enough for pagination after sorting
      
      if (lastDoc) {
        q = query(
          collectionRef,
          where('categories', 'array-contains-any', categories),
          limit(fetchSize)
        );
      } else {
        q = query(
          collectionRef,
          where('categories', 'array-contains-any', categories),
          limit(fetchSize)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const allImages: ImageModel[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allImages.push({
          id: doc.id,
          name: data.name,
          image: data.image,
          categories: data.categories || [],
          likes: data.likes || 0,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
      });
      
      // Sort by updatedAt desc on client side
      allImages.sort((a, b) => {
        const dateA = a.updatedAt?.getTime() || 0;
        const dateB = b.updatedAt?.getTime() || 0;
        return dateB - dateA;
      });
      
      // Return all filtered images (up to fetchSize)
      // No pagination for filtered results to avoid complex composite index setup
      return {
        images: allImages,
        lastDoc: null,
        hasMore: false
      };
    } else {
      // No filter - use server-side pagination
      q = query(
        collectionRef,
        orderBy('updatedAt', 'desc'),
        limit(pageSize + 1)
      );
      
      if (lastDoc) {
        q = query(
          collectionRef,
          orderBy('updatedAt', 'desc'),
          startAfter(lastDoc),
          limit(pageSize + 1)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const images: ImageModel[] = [];
      const docs = querySnapshot.docs;
      
      // Check if there are more documents
      const hasMore = docs.length > pageSize;
      const docsToProcess = hasMore ? docs.slice(0, pageSize) : docs;
      
      docsToProcess.forEach((doc) => {
        const data = doc.data();
        images.push({
          id: doc.id,
          name: data.name,
          image: data.image,
          categories: data.categories || [],
          likes: data.likes || 0,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
      });

      const lastDocument = docsToProcess.length > 0 ? docsToProcess[docsToProcess.length - 1] : null;

      return {
        images,
        lastDoc: lastDocument,
        hasMore
      };
    }
  } catch (error) {
    console.error("Error getting images with pagination: ", error);
    throw error;
  }
};

/**
 * Get single image by ID
 */
export const getImageById = async (id: string): Promise<ImageModel | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        image: data.image,
        categories: data.categories || [],
        likes: data.likes || 0,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting image: ", error);
    throw error;
  }
};

/**
 * Update image record
 */
export const updateImage = async (
  id: string,
  data: ImageFormData,
  file?: File,
  currentImageUrl?: string,
  onProgress?: (progress: number) => void,
  quality: number = 0.7
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    let imageUrl = currentImageUrl;

    // If new file is provided, upload it and delete old one
    if (file) {
      // imageUrl = await uploadImage(file, onProgress);

      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/\.[^/.]+$/, '')}.webp`;
      const path = `images/${fileName}`;

      const compressedFile = await compressImageSmart(file);
      // Resize & upload ảnh (maxWidth = 600px để giảm dung lượng tốt hơn)
      await resizeAndUploadImage(compressedFile, path, 800, quality, onProgress);

      
      // Delete old image from storage
      if (currentImageUrl) {
        try {
          await deleteImageFromStorage(currentImageUrl);
        } catch (error) {
          console.warn("Could not delete old image:", error);
        }
      }
    }

    // Update document in Firestore
    await updateDoc(docRef, {
      name: data.name,
      image: imageUrl,
      categories: data.categories || [],
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error updating image: ", error);
    throw error;
  }
};

/**
 * Delete image record and file
 */
export const deleteImage = async (id: string, imageUrl: string): Promise<void> => {
  try {
    // Delete document from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, id));

    // Delete image from storage
    await deleteImageFromStorage(imageUrl);
  } catch (error) {
    console.error("Error deleting image: ", error);
    throw error;
  }
};

/**
 * Increment likes for an image
 */
export const likeImage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error("Error liking image: ", error);
    throw error;
  }
};

/**
 * Resize ảnh, convert sang WebP, upload lên Storage có onProgress
 * @returns URL ảnh đã upload
 */
export async function resizeAndUploadImage(
  file: File,
  path: string,
  maxWidth = 500,
  quality = 0.7,
  onProgress?: (progress: number) => void
): Promise<string> {
  console.log('📸 Original file:', file.name, '| Size:', (file.size / 1024).toFixed(2), 'KB');
  
  // Đọc file thành dataURL (tương thích mọi loại ảnh)
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as string);
    reader.readAsDataURL(file);
  });

  // Tạo blob ảnh nén
  const blob = await new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false })!; // Disable alpha for better compression
      
      // Tính toán kích thước mới, LUÔN resize nếu ảnh lớn hơn maxWidth
      let targetWidth = img.width;
      let targetHeight = img.height;
      
      // Luôn giảm kích thước nếu lớn hơn maxWidth
      if (img.width > maxWidth || img.height > maxWidth) {
        if (img.width > img.height) {
          targetWidth = maxWidth;
          targetHeight = (img.height * maxWidth) / img.width;
        } else {
          targetHeight = maxWidth;
          targetWidth = (img.width * maxWidth) / img.height;
        }
      }
      
      // Làm tròn kích thước để tránh fractional pixels
      targetWidth = Math.round(targetWidth);
      targetHeight = Math.round(targetHeight);
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Set canvas context properties for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Fill white background (important for images with transparency)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      
      // Draw image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      console.log('🖼️  Resized from', img.width, 'x', img.height, 'to', targetWidth, 'x', targetHeight);
      
      canvas.toBlob(
        (b) => {
          if (b) {
            const sizeKB = (b.size / 1024).toFixed(2);
            const originalSizeKB = (file.size / 1024).toFixed(2);
            const reduction = (((file.size - b.size) / file.size) * 100).toFixed(1);
            console.log('✅ WebP created:', sizeKB, 'KB (reduced', reduction, '% from', originalSizeKB, 'KB)');
            resolve(b);
          } else reject(new Error('Failed to create blob'));
        },
        'image/webp',
        quality
      );
    };
    img.onerror = reject;
    img.src = dataUrl;
  });

  // Upload có onProgress
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, blob, {
    contentType: 'image/webp',
    cacheControl: 'public,max-age=31536000',
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      reject,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}




