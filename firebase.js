// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyByjGmOwRwp5Eg2y1TfOUHOVLwmIJ0lgaA",
  authDomain: "calendar-task-q.firebaseapp.com",
  databaseURL: "https://calendar-task-q-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "calendar-task-q",
  storageBucket: "calendar-task-q.appspot.com",
  messagingSenderId: "782672356813",
  appId: "1:782672356813:web:0b7f1fed8a28926abad084"
};

const app = initializeApp(firebaseConfig);

// Initialize auth (with persistence)
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getDatabase(app);

export { app, auth, db };
