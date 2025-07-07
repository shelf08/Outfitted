import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Profile: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [favorites, setFavorites] = useState<any[]>([]);

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
      fetchFavorites(res.data.access_token);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Ошибка входа');
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
  };

  React.useEffect(() => {
    if (token) fetchFavorites();
  }, [token]);

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
            <TextField label="Имя пользователя" name="username" value={form.username} onChange={handleChange} fullWidth />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
            <TextField label="Пароль" name="password" type="password" value={form.password} onChange={handleChange} fullWidth />
            <Button variant="contained" onClick={handleRegister}>Зарегистрироваться</Button>
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
      }}
      variant="outlined"
    >
      Выйти
    </Button>
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
            <Box key={outfit.id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' }, mb: 3 }}>
              <img src={outfit.image_url} alt={outfit.title} style={{ width: '100%', borderRadius: 8 }} />
              <Typography variant="h6">{outfit.title}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  </Box>
);
};

export default Profile; 