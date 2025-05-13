import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyChPKaRKGIk333xquPitIX0-EAySW2mTvk",
  authDomain: "my-finance-app-14620.firebaseapp.com",
  projectId: "my-finance-app-14620",
  storageBucket: "my-finance-app-14620.firebasestorage.app",
  messagingSenderId: "936081401657",
  appId: "1:936081401657:web:d2a7774e8b9af9b44b2ae8"
};

let app;
let auth;
let db;

export const initFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    db = getFirestore(app);
  }
};

export { auth, db };
