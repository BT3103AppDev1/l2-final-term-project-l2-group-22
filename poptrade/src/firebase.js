// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCr87UQwx_ErNFKGiCD7s9zT5tvmPwinq0",
  authDomain: "poptrade-c2650.firebaseapp.com",
  projectId: "poptrade-c2650",
  storageBucket: "poptrade-c2650.appspot.com",
  messagingSenderId: "327732712069",
  appId: "1:327732712069:web:011bc4cfb211fafcd8cfec",
  measurementId: "G-E2H66S2NVC",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(firebase);
const auth = getAuth(firebase);

// Optional: Initialize Analytics
const analytics = getAnalytics(firebase);

export { firebase, db, auth, analytics };
