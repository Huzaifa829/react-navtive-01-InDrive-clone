// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyD4sdAKZH9m-NGoKlJlJccWvRY28h3p_1Y",
    authDomain: "react-native-indrive-clo-21834.firebaseapp.com",
    projectId: "react-native-indrive-clo-21834",
    storageBucket: "react-native-indrive-clo-21834.firebasestorage.app",
    messagingSenderId: "1076231607199",
    appId: "1:1076231607199:web:d0a7d8f36d50b86b7323aa",
    measurementId: "G-ZVM2LS1XT6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});