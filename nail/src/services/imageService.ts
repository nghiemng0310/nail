import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { ImageModel, ImageFormData } from '../types/image';

const COLLECTION_NAME = 'images';

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
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Upload image first
    const imageUrl = await uploadImage(file, onProgress);

    // Create document in Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      name: data.name,
      image: imageUrl,
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
 * Get all images
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
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    let imageUrl = currentImageUrl;

    // If new file is provided, upload it and delete old one
    if (file) {
      imageUrl = await uploadImage(file, onProgress);
      
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

