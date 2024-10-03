// components/ListaRetirantesPDF.tsx
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  member: {
    marginBottom: 10,
  },
});

interface Membro {
  id: string;
  nomeCompleto: string;
  telefone: string;
  statusPagamento?: 'pendente' | '1º Lote' | '2º Lote' | '3º Lote' | 'finalizado';
}

interface Props {
  membros: Membro[];
}

const ListaRetirantesPDF: React.FC<Props> = ({ membros }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Lista de Retirantes 2025</Text>
      {membros.map((membro) => (
        <View key={membro.id} style={styles.member}>
          <Text>{membro.nomeCompleto} - {membro.telefone} - Status: {membro.statusPagamento}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default ListaRetirantesPDF;
