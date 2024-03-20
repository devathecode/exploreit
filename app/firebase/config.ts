import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB_o4qI3KJMlie20CiAqDgcMIaVih-4XuY",
    authDomain: "explorenaukrigithub.firebaseapp.com",
    projectId: "explorenaukrigithub",
    storageBucket: "explorenaukrigithub.appspot.com",
    messagingSenderId: "550838991358",
    appId: "1:550838991358:web:1dc0110eb627ca42af68af"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
