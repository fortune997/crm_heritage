
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVNbPSDjI5DmCy4D0A0oNO1eTeuvuzkzU",
  authDomain: "crm-buildtogether.firebaseapp.com",
  projectId: "crm-buildtogether",
  storageBucket: "crm-buildtogether.firebasestorage.app",
  messagingSenderId: "683301629199",
  appId: "1:683301629199:web:15e4c4940363ed3158a27a",
  measurementId: "G-3D10967VF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);