// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCr87UQwx_ErNFKGiCD7s9zT5tvmPwinq0",
  authDomain: "poptrade-c2650.firebaseapp.com",
  projectId: "poptrade-c2650",
  storageBucket: "poptrade-c2650.appspot.com",
  messagingSenderId: "327732712069",
  appId: "1:327732712069:web:011bc4cfb211fafcd8cfec",
  measurementId: "G-E2H66S2NVC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseApp;