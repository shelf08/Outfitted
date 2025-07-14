import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, Alert, Modal, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import AddOutfitForm from '../components/AddOutfitForm';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

const Profile: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showAddOutfit, setShowAddOutfit] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTab = (_: any, newValue: number) => {
    setTab(newValue);
    setError('');
  };

  const handleRegister = async () => {
    setError('');
    try {
      await axios.post(`${API_URL}/users/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setTab(0);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Ошибка регистрации');
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post(`${API_URL}/users/login`, new URLSearchParams({
        username: form.username,
        password: form.password,
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      localStorage.setItem('token', res.data.access_token);
      setToken(res.data.access_token);
      fetchUserInfo(res.data.access_token);
      fetchFavorites(res.data.access_token);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Ошибка входа');
    }
  };

  const fetchUserInfo = async (jwt?: string) => {
    try {
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${jwt || token}` },
      });
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const fetchFavorites = async (jwt?: string) => {
    try {
      const res = await axios.get(`${API_URL}/favorites/`, {
        headers: { Authorization: `Bearer ${jwt || token}` },
      });
      setFavorites(res.data);
    } catch {
      setFavorites([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setFavorites([]);
    setUser(null);
  };

  React.useEffect(() => {
    if (token) {
      fetchUserInfo();
      fetchFavorites();
    }
  }, [token]);

  const usernameValid = /^[a-zA-Z0-9]{4,24}$/.test(form.username);
  const passwordValid = /^[a-zA-Z0-9]{4,24}$/.test(form.password);
  const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email);
  const isFormValid = usernameValid && passwordValid && emailValid;

  if (!token) {
    return (
      <Box maxWidth={400} mx="auto">
        <Typography variant="h5" gutterBottom>Личный кабинет</Typography>
        <Tabs value={tab} onChange={handleTab} sx={{ mb: 2 }}>
          <Tab label="Вход" />
          <Tab label="Регистрация" />
        </Tabs>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {tab === 0 ? (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Имя пользователя" name="username" value={form.username} onChange={handleChange} fullWidth />
            <TextField label="Пароль" name="password" type="password" value={form.password} onChange={handleChange} fullWidth />
            <Button variant="contained" onClick={handleLogin}>Войти</Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Имя пользователя"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              error={form.username !== '' && !usernameValid}
              helperText={form.username !== '' && !usernameValid ? "Только латинские буквы и цифры, 4-24 символа" : ""}
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              error={form.email !== '' && !emailValid}
              helperText={form.email !== '' && !emailValid ? "Введите корректный email" : ""}
            />
            <TextField
              label="Пароль"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              error={form.password !== '' && !passwordValid}
              helperText={form.password !== '' && !passwordValid ? "Только латинские буквы и цифры, 4-24 символа" : ""}
            />
            <Button variant="contained" onClick={handleRegister} disabled={!isFormValid}>Зарегистрироваться</Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: 300 }}>
      {/* Кнопка выйти — в правом верхнем углу */}
      <Button
        onClick={handleLogout}
        sx={{
          position: 'absolute',
          top: -30,
          right: -340,
          zIndex: 1,
          mt: { xs: 1, md: 2 },
          mr: { xs: 1, md: 2 },
          ml: 2,
        }}
        variant="outlined"
        color="error"
      >
        Выйти
      </Button>
      
      {/* Кнопка добавления аутфита для администратора */}
      {user?.is_admin && (
        <Button
          variant="contained"
          onClick={() => setShowAddOutfit(true)}
          sx={{
            position: 'absolute',
            top: -30,
            right: -240,
            zIndex: 1,
            mt: { xs: 1, md: 2 },
            mr: { xs: 1, md: 2 },
            backgroundColor: '#111',
            color: '#fff',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#333' },
          }}
        >
          Добавить аутфит
        </Button>
      )}
      
      {/* Основной контент — центр, но ближе к верху */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Избранные аутфиты
        </Typography>
        {favorites.length === 0 ? (
          <Typography>Нет избранных аутфитов.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            {favorites.map((outfit) => (
              <Box
                key={outfit.id}
                onClick={() => navigate(`/outfits/${outfit.id}`)}
                sx={{
                  width: { xs: '100%', sm: '45%', md: '30%' },
                  mb: 3,
                  position: 'relative',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 2,
                  border: '1.5px solid #bbb',
                  p: 2,
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                    borderColor: '#888',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ position: 'relative', width: '100%' }}>
                  <img
                    src={outfit.image_url}
                    alt={outfit.title}
                    style={{ width: '100%', borderRadius: 8, marginBottom: 12 }}
                  />
                  <IconButton
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await axios.delete(`${API_URL}/favorites/${outfit.id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        setFavorites((prev) => prev.filter((f) => f.id !== outfit.id));
                      } catch {
                        // Можно добавить обработку ошибки
                      }
                    }}
                    color="error"
                    sx={{
                      position: 'absolute',
                      right: 1,
                      bottom: 10,
                      background: '#fff',
                      boxShadow: 2,
                      '&:hover': { background: '#ffeaea' },
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, textAlign: 'center' }}>
                  {outfit.title}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      
      {/* Модальное окно для добавления аутфита */}
      <Modal
        open={showAddOutfit}
        onClose={() => setShowAddOutfit(false)}
        aria-labelledby="add-outfit-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 800,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'auto'
        }}>
          <AddOutfitForm
            onClose={() => setShowAddOutfit(false)}
            onSuccess={() => {
              // Можно добавить обновление списка аутфитов если нужно
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile; 