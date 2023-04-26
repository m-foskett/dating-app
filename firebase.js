// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIqOOFofIXv5hjiEFQ7BcCjYFMrrVVEfI",
  authDomain: "tinderclone-ef7fe.firebaseapp.com",
  projectId: "tinderclone-ef7fe",
  storageBucket: "tinderclone-ef7fe.appspot.com",
  messagingSenderId: "690008863159",
  appId: "1:690008863159:web:bff7189d695ae144a17832"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

export { auth, db };