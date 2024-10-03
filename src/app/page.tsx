'use client';
import { Cancel, CheckCircle, Delete, Edit, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import { BlobProvider } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import ListaRetirantesPDF from './components/ListaRetirantesPDF';
import { atualizarMembro, criarMembro, deletarMembro, obterMembros } from './services/crudservice';

interface Membro {
  id: string;
  nomeCompleto: string;
  telefone: string;
  statusPagamento?: 'pendente' | '1º Lote' | '2º Lote' | '3º Lote' | 'finalizado';
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
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [membroParaDeletar, setMembroParaDeletar] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
 

  

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
      const membroAtualizado: Partial<Membro> = {
        nomeCompleto: membroEditado.nomeCompleto,
        telefone: membroEditado.telefone,
      };
      const membroAtual = membros[editandoIndex];
      await atualizarMembro(membroAtual.id, { ...membroAtual, ...membroAtualizado });
      setEditandoIndex(null);
      buscarMembros();
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoIndex(null);
    setMembroEditado({ nomeCompleto: '', telefone: '' });
  };

  const getProximoStatus = (statusAtual?: 'pendente' | '1º Lote' | '2º Lote' | '3º Lote' | 'finalizado'): 'pendente' | '1º Lote' | '2º Lote' | '3º Lote' | 'finalizado' | undefined => {
    switch (statusAtual) {
      case 'pendente':
        return '1º Lote';
      case '1º Lote':
        return '2º Lote';
      case '2º Lote':
        return '3º Lote';
      case '3º Lote':
        return 'finalizado';
      default:
        return statusAtual;
    }
  };

  const handleAvancarPagamento = async (id: string) => {
    const membro = membros.find((membro) => membro.id === id);
    if (membro) {
      const proximoStatus = getProximoStatus(membro.statusPagamento);
      if (proximoStatus && proximoStatus !== membro.statusPagamento) {
        await atualizarMembro(membro.id, { statusPagamento: proximoStatus });
        buscarMembros();
      }
    }
  };

  const handleOpenDialog = (id: string) => {
    setMembroParaDeletar(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMembroParaDeletar(null);
  };

  const handleConfirmarDeletar = async () => {
    if (membroParaDeletar) {
      await deletarMembro(membroParaDeletar);
      buscarMembros();
    }
    handleCloseDialog();
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

  // Ordenar membros por nome completo antes de renderizar
  const membrosOrdenados = [...membros].sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));

  useEffect(() => {
    setIsClient(true); // Permite saber que estamos no cliente
  }, []);
  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Gerenciamento de Retirantes - Retiro 2025
      </Typography>

      <Card sx={{ maxWidth: 500, margin: '0 auto', marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Adicionar Novo Retirante
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
            Adicionar Retirante
          </Button>
        </CardActions>
      </Card>

      <Typography variant="h6" gutterBottom>
        Retirante - Status de Pagamento
      </Typography>

      <Card sx={{ maxWidth: 500, margin: '0 auto', overflow: 'auto', maxHeight: 300 }}>
        <List>
          {membrosOrdenados.map((membro, index) => (
            <ListItem key={membro.id} sx={{ mb: 2 }}>
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
                  <ListItemText
                    primary={`${membro.nomeCompleto} - ${formatarTelefone(membro.telefone)}`}
                    secondary={`Status: ${membro.statusPagamento}`}
                  />
                  <ListItemSecondaryAction>
                    {membro.statusPagamento !== 'finalizado' && (
                      <IconButton edge="end" onClick={() => handleAvancarPagamento(membro.id)} color="success">
                        <CheckCircle />
                      </IconButton>
                    )}
                    <IconButton edge="end" onClick={() => handleEditar(index)} color="default">
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleOpenDialog(membro.id)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Card>

      {isClient && ( // Renderiza apenas no lado do cliente
      <BlobProvider document={<ListaRetirantesPDF membros={membros} />}>
        {({ url }) => (
          <Box display="flex" justifyContent="center" alignItems="center" my={2}>
            <a href={url || undefined} download="lista_retirantes.pdf">
              <Button 
                variant="contained" 
                color="primary" 
                disabled={!url} 
              >
                Baixar Lista
              </Button>
            </a>
          </Box>
        )}
      </BlobProvider>
    )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Tem certeza?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja excluir este retirante? Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmarDeletar} color="error">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
