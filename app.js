  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries


import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyByyBdiCaouJ9AFsMVkKis2IXqDk-MHZmE",
    authDomain: "arcadia-a0585.firebaseapp.com",
    databaseURL: "https://arcadia-a0585-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "arcadia-a0585",
    storageBucket: "arcadia-a0585.firebasestorage.app",
    messagingSenderId: "725740498443",
    appId: "1:725740498443:web:5542842a11e96157c0610e"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Anonymous sign in
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
    console.log("User ID:", auth.currentUser.uid);
  })
  .catch((error) => {
    console.error(error);
  });

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getKeyString(x, y) {
  return `${x}x${y}`;
}