import { initializeApp, getApps } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDbQ1q-zhmxytEcfBbitYKW_AzsL4_M7Ug",
  authDomain: "unisabanadining.firebaseapp.com",
  projectId: "unisabanadining",
  storageBucket: "unisabanadining.firebasestorage.app",
  messagingSenderId: "763266352114",
  appId: "1:763266352114:web:d3f1af9d07424646dd616b",
  measurementId: "G-ZQXF79743N"
};

// Verificar si ya existe una instancia de Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const messaging = getMessaging(app);

console.log("✅ Firebase app inicializado con bucket:", app.options.storageBucket);



export { app, messaging };