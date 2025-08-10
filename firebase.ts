// firebase.ts
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyByjGmOwRwp5Eg2y1TfOUHOVLwmIJ0lgaA',
  authDomain: 'calendar-task-q.firebaseapp.com',
  databaseURL: 'https://calendar-task-q-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'calendar-task-q',
  storageBucket: 'calendar-task-q.appspot.com',
  messagingSenderId: '782672356813',
  appId: '1:782672356813:web:0b7f1fed8a28926abad084',
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app); // fallback if already initialized
}

// Initialize Database
const db: Database = getDatabase(app);

export { app, auth, db };
