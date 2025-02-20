import { type FirebaseOptions, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig: FirebaseOptions = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: "sistemaampere.firebaseapp.com",
	projectId: "sistemaampere",
	storageBucket: "sistemaampere.appspot.com",
	messagingSenderId: "496303969093",
	appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
