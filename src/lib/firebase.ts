import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBCbuBmPkw3TlJ7GmCo0MGqESwHQgQ9D_g",
    authDomain: "vdk-nhietdo-chatluongkk.firebaseapp.com",
    databaseURL: "https://vdk-nhietdo-chatluongkk-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vdk-nhietdo-chatluongkk",
    storageBucket: "vdk-nhietdo-chatluongkk.firebasestorage.app",
    messagingSenderId: "592838956629",
    appId: "1:592838956629:web:d3a55b0520f428078ca6dc",
    measurementId: "G-CVW5D9KSE9"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); 

export { app, database };
