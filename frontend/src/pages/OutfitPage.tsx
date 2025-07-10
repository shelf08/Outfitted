import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Button, CircularProgress, List, ListItem, ListItemText, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import AddOutfitForm from '../components/AddOutfitForm';

const API_URL = 'http://localhost:8000';

const OutfitPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOutfit = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/outfits/${id}`);
        setOutfit(res.data);
        setLoading(false);
      } catch {
        setError('Аутфит не найден');
        setLoading(false);
      }
    };
    fetchOutfit();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!token || !id) return;
      try {
        const res = await axios.get(`${API_URL}/favorites/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(res.data.some((fav: any) => fav.id === Number(id)));
      } catch {}
    };
    checkFavorite();
  }, [id, token]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);

  const handleFavorite = async () => {
    if (!token) return;
    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
      } else {
        await axios.post(`${API_URL}/favorites/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(true);
      }
    } catch {}
  };

  const handleEdit = () => setShowEdit(true);
  const handleDelete = () => setShowDelete(true);
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/outfits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/outfits');
    } catch (e) {
      setError('Ошибка при удалении аутфита');
    }
    setShowDelete(false);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;
  if (!outfit) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start', mt: 2 }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={outfit.image_url} alt={outfit.title} style={{ width: '100%', maxWidth: 500, borderRadius: 12 }} />
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Назад</Button>
      </Box>
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>{outfit.title}</Typography>
          {token && (
            <IconButton onClick={handleFavorite} color={isFavorite ? 'error' : 'default'}>
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          )}
          {user?.is_admin && (
            <>
              <Button variant="contained" color="primary" onClick={handleEdit} sx={{ ml: 2 }}>
                Редактировать
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
                Удалить
              </Button>
            </>
          )}
        </Box>
        <Typography variant="subtitle1" gutterBottom>Вещи в аутфите:</Typography>
        <List>
          {outfit.items.map((item: any, idx: number) => (
            <ListItem key={item.id || idx}>
              <ListItemText
                primary={item.name}
                secondary={`Бренд: ${item.brand || '-'} | Модель: ${item.model || '-'}`}
              />
            </ListItem>
          ))}
        </List>
        {outfit.description && (
          <Typography variant="body2" sx={{ mt: 2 }}>{outfit.description}</Typography>
        )}
      </Box>
      {/* Модалка для редактирования */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 800, maxHeight: '90vh', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, overflow: 'auto' }}>
          <AddOutfitForm
            outfit={outfit}
            onClose={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              // обновить outfit после редактирования
              window.location.reload();
            }}
          />
        </Box>
      </Modal>
      {/* Диалог подтверждения удаления */}
      <Dialog open={showDelete} onClose={() => setShowDelete(false)}>
        <DialogTitle>Удалить аутфит?</DialogTitle>
        <DialogContent>Вы уверены, что хотите удалить этот аутфит? Это действие необратимо.</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDelete(false)}>Отмена</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OutfitPage; 