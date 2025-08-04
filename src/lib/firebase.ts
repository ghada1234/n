import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "nutrition-navigator-4tqm7",
  "appId": "1:78345777274:web:57e01e2c8281903af48bc3",
  "storageBucket": "nutrition-navigator-4tqm7.firebasestorage.app",
  "apiKey": "AIzaSyDSzQhX2srDHN9Ne4pOxsj7Zyzuk7HojTM",
  "authDomain": "nutrition-navigator-4tqm7.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "78345777274"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app };
