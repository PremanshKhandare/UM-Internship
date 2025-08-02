
// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDoGhFffXIzvzHWk3Hia0BozvtPRfDxZ9c",
    authDomain: "gym-management-system-79692.firebaseapp.com",
    projectId: "gym-management-system-79692",
    storageBucket: "gym-management-system-79692.appspot.com",
    messagingSenderId: "503344137528",
    appId: "1:503344137528:web:f3ed368691a1c4432d6dcd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
