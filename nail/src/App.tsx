import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2d4rMkuZWnhBK545rEFi-oyyveqXiBGE",
  authDomain: "chatsupper-36bf1.firebaseapp.com",
  databaseURL: "https://chatsupper-36bf1-default-rtdb.firebaseio.com",
  projectId: "chatsupper-36bf1",
  storageBucket: "chatsupper-36bf1.appspot.com",
  messagingSenderId: "626634863236",
  appId: "1:626634863236:web:d12f190bede2cab16fc8d1",
  measurementId: "G-PED9CP5238"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

function App() {
  const [count, setCount] = useState(0)


   async function uploadImageAndAddData(file: File, data: any) {
    if (!file) return;

    try {
      const storageRef = ref(storage, `images/${file.name}`); // Create a reference to 'images/filename'
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error uploading image: ", error);
        },
        async () => {
          // Handle successful uploads on complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);

          // Now add data to Firestore with the image URL
          const docRef = await addDoc(collection(db, "myCollection"), {
            name: data.name,
            age: data.age,
            imageUrl: downloadURL // Store the image URL in Firestore
          });
          console.log("Document written with ID: ", docRef.id);
        }
      );
    } catch (e) {
      console.error("Error in upload or adding document: ", e);
    }
  }

  // Example usage (you'd typically get the file from an input element)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      uploadImageAndAddData(selectedFile, { name: 'John', age: 30 });
    }
  };

  async function addMyData(data: any) {
  try {
    const docRef = await addDoc(collection(db, "myCollection"), {
      // Dữ liệu bạn muốn thêm
      name: data.name,
      age: data.age
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => addMyData({ name: 'John', age: 30 })}>Bấm</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <input type="file" onChange={handleFileChange} />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
