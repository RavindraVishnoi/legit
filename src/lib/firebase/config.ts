
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
// Import other Firebase services here as needed, e.g. import { getFirestore } from "firebase/firestore";

const firebaseConfigRequiredKeys: Array<keyof FirebaseOptions> = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;

if (typeof window !== 'undefined') { // Ensure this runs only on the client-side for these checks
  let allKeysPresent = true;
  for (const key of firebaseConfigRequiredKeys) {
    const envVarName = 'NEXT_PUBLIC_FIREBASE_' + (key.replace(/([A-Z])/g, '_$1').toUpperCase());
    if (!firebaseConfig[key]) {
      console.warn(
        `Firebase config: Missing environment variable ${envVarName} (config key: ${key}). Firebase might not initialize correctly.`
      );
      allKeysPresent = false;
    }
  }
  if (!allKeysPresent) {
    console.error(
      'Firebase config: One or more required Firebase environment variables are missing. Please check your .env file and ensure all NEXT_PUBLIC_FIREBASE_... variables are set.'
    );
  }
}


// Initialize Firebase
if (!getApps().length) {
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  ) {
    app = initializeApp(firebaseConfig);
  } else {
    console.error(
      'Firebase initialization failed: Critical Firebase configuration (apiKey, authDomain, projectId) is missing. App will not be initialized.'
    );
    // Assign a dummy app or handle this state appropriately if needed,
    // though usually this means Firebase-dependent features will fail.
    // This scenario should be caught by the warnings above.
  }
} else {
  app = getApp();
}

export { app };
