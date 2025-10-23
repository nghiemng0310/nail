// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBrFEe6dTgKx9asUG9iDFs_tPMtu6DGyqw",
  authDomain: "apptest2-50f49.firebaseapp.com",
  projectId: "apptest2-50f49",
  storageBucket: "apptest2-50f49.appspot.com",
  messagingSenderId: "694528708549",
  appId: "1:694528708549:web:29b3680d3dd37fa46b85ac",
  measurementId: "G-HMEF3F8RG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

