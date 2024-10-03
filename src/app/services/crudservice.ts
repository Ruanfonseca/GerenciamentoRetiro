// services/crudService.ts
"use client"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

interface Membro {
  id: string;
  nomeCompleto: string;
  telefone: string;
  statusPagamento: 'pendente' | '1º Lote' | '2º Lote' | '3º Lote' | 'finalizado';
}


const nomeColecao = 'membros';

export const criarMembro = async (dados: Omit<Membro, 'id'>): Promise<void> => {
  try {
    await addDoc(collection(db, nomeColecao), dados);
  } catch (err) {
    console.error('Erro ao criar membro: ', err);
  }
};

export const obterMembros = async (): Promise<Membro[]> => {
  try {
    const snapshot = await getDocs(collection(db, nomeColecao));
    return snapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data()
    })) as Membro[];
  } catch (err) {
    console.error('Erro ao obter membros: ', err);
    return [];
  }
};

export const atualizarMembro = async (id: string, dados: Partial<Membro>): Promise<void> => {
  try {
    const membroRef = doc(db, nomeColecao, id);
    await updateDoc(membroRef, dados);
  } catch (err) {
    console.error('Erro ao atualizar membro: ', err);
  }
};

export const deletarMembro = async (id: string): Promise<void> => {
  try {
    const membroRef = doc(db, nomeColecao, id);
    await deleteDoc(membroRef);
  } catch (err) {
    console.error('Erro ao deletar membro: ', err);
  }
};
