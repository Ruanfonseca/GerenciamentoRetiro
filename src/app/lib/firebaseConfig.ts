// lib/firebaseConfig.ts
"use client"
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase da sua aplicação
const firebaseConfig = {
  apiKey: "AIzaSyD40Z3XKOsUtxPt0Lw47gfPjKO2OEYe49s",
  authDomain: "retiro-a725b.firebaseapp.com",
  projectId: "retiro-a725b",
  storageBucket: "retiro-a725b.appspot.com",
  messagingSenderId: "911170945144",
  appId: "1:911170945144:web:25dbc38bff84f3cd5f6d8d",
  measurementId: "G-GXMV7456XV"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

export { db };
