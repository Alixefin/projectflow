
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  if (!firebaseConfig.projectId) {
    console.warn("Firebase projectId is not defined. App will not be initialized. Ensure Firebase environment variables are set.");
    // Optionally, throw an error or handle this state appropriately
    // For now, we'll allow the app to run but Firestore operations will fail.
  } else {
    app = initializeApp(firebaseConfig);
  }
} else {
  app = getApp();
}

const db = app ? getFirestore(app) : null; // db will be null if app couldn't initialize

if (!db) {
  console.warn("Firestore database (db) is not initialized. Firebase operations will fail. Check your Firebase configuration.");
}

export { db, app };
