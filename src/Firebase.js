import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCPUl21lKN4w-yK1TvkYVB0SatUwV3GnaM",
    authDomain: "poll-app-973d7.firebaseapp.com",
    projectId: "poll-app-973d7",
    storageBucket: "poll-app-973d7.appspot.com",
    messagingSenderId: "738976810027",
    appId: "1:738976810027:web:bef381083c193e83b7966e",
    measurementId: "G-PXXEVJJCE2"
  };
  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, app as firebase };