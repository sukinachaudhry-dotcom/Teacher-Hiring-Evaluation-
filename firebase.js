// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyDWyPqTlaoExL6HTf4ryiCKhytkIRx_Tf0",
  authDomain: "teacherhiring-dd8e0.firebaseapp.com",
  projectId: "teacherhiring-dd8e0",
  storageBucket: "teacherhiring-dd8e0.firebasestorage.app",
  messagingSenderId: "1092648692940",
  appId: "1:1092648692940:web:f601ec5cae7d631e3a6669",
  measurementId: "G-CCXKTXMY1E"
};

// Initialize Firebase
try {
  var  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}
// const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };