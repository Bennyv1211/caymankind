import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAqTmlBF31ApXEdSfIurWWDyTSqI_67lQ",
    authDomain: "caymankind-ed53e.firebaseapp.com",
    projectId: "caymankind-ed53e",
    storageBucket: "caymankind-ed53e.firebasestorage.app",
    messagingSenderId: "1014473993467",
    appId: "1:1014473993467:web:da3a7d468cc7373b75545e",
    measurementId: "G-Y1S7HKC07G"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Make sure 'auth' is exported here
export { db, auth, signInWithEmailAndPassword, setDoc, getDoc, doc };