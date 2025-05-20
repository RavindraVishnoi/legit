
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
// Import other Firebase services here as needed, e.g. import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCLvhtw-v4t56d1-LahtpxxLzGts_FqZnU",
  authDomain: "llamalegit.firebaseapp.com",
  projectId: "llamalegit",
  storageBucket: "llamalegit.appspot.com", // Corrected format
  messagingSenderId: "952448227636",
  appId: "1:952448227636:web:b04028a76007bc93666d61"
  // measurementId is optional, so it can be omitted if not provided or used
};

let app: FirebaseApp;

// Initialize Firebase
if (!getApps().length) {
  // Basic check to ensure critical config is present before initializing
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  ) {
    app = initializeApp(firebaseConfig);
  } else {
    console.error(
      'Firebase initialization failed: Critical Firebase configuration (apiKey, authDomain, projectId) is missing in the hardcoded config. App will not be initialized.'
    );
    // In a real app, you might want to throw an error or handle this state more gracefully
    // For now, app will remain undefined, and Firebase-dependent features will likely fail.
  }
} else {
  app = getApp();
}

export { app };
