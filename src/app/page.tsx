'use client';
import { Cancel, CheckCircle, Delete, Edit, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { atualizarMembro, criarMembro, deletarMembro, obterMembros } from './services/crudservice';

interface Membro {
  id: string;
  nomeCompleto: string;
  telefone: string;
  statusPagamento: 'pendente' | 'finalizado';
}

export default function Home() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [novoMembro, setNovoMembro] = useState<{ nomeCompleto: string; telefone: string }>({
    nomeCompleto: '',
    telefone: ''
  });
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [membroEditado, setMembroEditado] = useState<{ nomeCompleto: string; telefone: string }>({
    nomeCompleto: '',
    telefone: ''
  });

  useEffect(() => {
    buscarMembros();
  }, []);

  const buscarMembros = async () => {
    const membrosObtidos = await obterMembros();
    setMembros(membrosObtidos);
  };

  const handleCriar = async () => {
    if (novoMembro.nomeCompleto.trim() !== '' && novoMembro.telefone.trim() !== '') {
      await criarMembro({ ...novoMembro, statusPagamento: 'pendente' });
      setNovoMembro({ nomeCompleto: '', telefone: '' });
      buscarMembros();
    }
  };

  const handleEditar = (index: number) => {
    setEditandoIndex(index);
    const membro = membros[index];
    setMembroEditado({ nomeCompleto: membro.nomeCompleto, telefone: membro.telefone });
  };

  const handleSalvarEdicao = async () => {
    if (editandoIndex !== null) {
      const membroAtualizado = { ...membros[editandoIndex], ...membroEditado };
      await atualizarMembro(membroAtualizado.id, membroAtualizado);
      setEditandoIndex(null);
      buscarMembros();
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoIndex(null);
    setMembroEditado({ nomeCompleto: '', telefone: '' });
  };

  const handleAtualizarStatus = async (index: number, status: 'pendente' | 'finalizado') => {
    const membroAtualizado = { ...membros[index], statusPagamento: status };
    await atualizarMembro(membroAtualizado.id, membroAtualizado);
    buscarMembros();
  };

  const handleDeletar = async (index: number) => {
    await deletarMembro(membros[index].id);
    buscarMembros();
  };

  const formatarTelefone = (telefone: string) => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (apenasNumeros.length > 10) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
    }
    return apenasNumeros.length > 6
      ? `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`
      : apenasNumeros;
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Gerenciamento de Retirantes - Retiro 2025
      </Typography>

      <Card sx={{ maxWidth: 500, margin: '0 auto', marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Adicionar Novo Membro
          </Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome Completo"
              value={novoMembro.nomeCompleto}
              onChange={(e) => setNovoMembro({ ...novoMembro, nomeCompleto: e.target.value })}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Telefone"
              variant="outlined"
              fullWidth
              value={novoMembro.telefone}
              onChange={(e) => setNovoMembro({ ...novoMembro, telefone: e.target.value })}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" fullWidth onClick={handleCriar}>
            Adicionar Membro
          </Button>
        </CardActions>
      </Card>

      <Typography variant="h6" gutterBottom>
        Membros com Pagamento Pendente
      </Typography>
      <List>
        {membros
          .filter((membro) => membro.statusPagamento === 'pendente')
          .map((membro, index) => (
            <ListItem key={index}>
              {editandoIndex === index ? (
                <>
                  <TextField
                    value={membroEditado.nomeCompleto}
                    onChange={(e) => setMembroEditado({ ...membroEditado, nomeCompleto: e.target.value })}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    label="Telefone"
                    variant="outlined"
                    fullWidth
                    value={membroEditado.telefone}
                    onChange={(e) => setMembroEditado({ ...membroEditado, telefone: e.target.value })}
                  />
                  <IconButton edge="end" onClick={handleSalvarEdicao} color="primary">
                    <Save />
                  </IconButton>
                  <IconButton edge="end" onClick={handleCancelarEdicao} color="secondary">
                    <Cancel />
                  </IconButton>
                </>
              ) : (
                <>
                  <ListItemText primary={`${membro.nomeCompleto} - ${formatarTelefone(membro.telefone)}`} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleAtualizarStatus(index, 'finalizado')} color="success">
                      <CheckCircle />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleEditar(index)} color="default">
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeletar(index)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
      </List>

      <Typography variant="h6" gutterBottom>
        Membros com Pagamento Finalizado
      </Typography>
      <List>
        {membros
          .filter((membro) => membro.statusPagamento === 'finalizado')
          .map((membro, index) => (
            <ListItem key={index}>
              {editandoIndex === index ? (
                <>
                  <TextField
                    value={membroEditado.nomeCompleto}
                    onChange={(e) => setMembroEditado({ ...membroEditado, nomeCompleto: e.target.value })}
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    label="Telefone"
                    variant="outlined"
                    fullWidth
                    value={membroEditado.telefone}
                    onChange={(e) => setMembroEditado({ ...membroEditado, telefone: e.target.value })}
                  />
                  <IconButton edge="end" onClick={handleSalvarEdicao} color="primary">
                    <Save />
                  </IconButton>
                  <IconButton edge="end" onClick={handleCancelarEdicao} color="secondary">
                    <Cancel />
                  </IconButton>
                </>
              ) : (
                <>
                  <ListItemText primary={`${membro.nomeCompleto} - ${formatarTelefone(membro.telefone)}`} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleAtualizarStatus(index, 'pendente')} color="warning">
                      <Cancel />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleEditar(index)} color="default">
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeletar(index)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
      </List>
    </Container>
  );
}
