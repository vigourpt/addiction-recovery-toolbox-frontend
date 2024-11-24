import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLMGE_sn0QS6o7SpHySrb6ZNQJMoPoQSg",
  authDomain: "addiction-recovery-toolbox.firebaseapp.com",
  projectId: "addiction-recovery-toolbox",
  storageBucket: "addiction-recovery-toolbox.firebasestorage.app",
  messagingSenderId: "912631685400",
  appId: "1:912631685400:web:1383b1111eaecb45f63e6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);

// Get Firestore instance
export const db = getFirestore(app);

export default app;
