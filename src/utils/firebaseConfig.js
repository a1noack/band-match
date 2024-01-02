import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDm0SPr2VuAeyoh8yuxqU3EF-QgLwte4I8",
  authDomain: "musician-merch.firebaseapp.com",
  projectId: "musician-merch",
  storageBucket: "musician-merch.appspot.com",
  messagingSenderId: "897796512501",
  appId: "1:897796512501:web:1b1e5d601a287dd40283bc",
  measurementId: "G-XD0K87V0DG"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

export { auth, db };