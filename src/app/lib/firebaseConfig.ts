// lib/firebaseConfig.ts
"use client"
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase da sua aplicação
const firebaseConfig = {
  apiKey: "AIzaSyB1o5IEGVTb7ym5rv8rXXABGtbgBdgxKgw",
  authDomain: "quedmark.firebaseapp.com",
  projectId: "quedmark",
  storageBucket: "quedmark.appspot.com",
  messagingSenderId: "263643571871",
  appId: "1:263643571871:web:6842929104af6085c5a4aa",
  measurementId: "G-ZGNYRGKPZB"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

export { db };
