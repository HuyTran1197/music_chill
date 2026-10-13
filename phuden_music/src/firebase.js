import { initializeApp } from "firebase/app";
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCFmJhZ6hIwja76tvLUwdb_OfeQIPK_V-o", // copy lại từ trang Firebase cho chắc
    authDomain: "music-chill-231ad.firebaseapp.com",
    projectId: "music-chill-231ad",
    storageBucket: "music-chill-231ad.firebasestorage.app",
    messagingSenderId: "534138742234",
    appId: "1:534138742234:web:5dc40ba8083e261d794ce3", // copy lại từ trang Firebase cho chắc
};

const app = initializeApp(firebaseConfig);

// Lưu bản sao cục bộ để mở app khi offline vẫn thấy sắp xếp album gần nhất
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});