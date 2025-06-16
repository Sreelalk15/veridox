import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhE1uL5GGx159aDqAol237BZpF40dzHB0",
  authDomain: "emin-quiz-app.firebaseapp.com",
  projectId: "emin-quiz-app",
  storageBucket: "emin-quiz-app.firebasestorage.app",
  messagingSenderId: "106250024008",
  appId: "1:106250024008:web:ab804d1f86a240ea7b547d",
  measurementId: "G-RG3G0Q2FGB",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };



