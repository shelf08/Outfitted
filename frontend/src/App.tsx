import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, Container, Typography} from '@mui/material';
import Home from './pages/Home';
import Outfits from './pages/Outfits';
import Profile from './pages/Profile';
import OutfitPage from './pages/OutfitPage';
import logo from './images/logo1.png';
import './App.css';

function App() {
  return (
    <Router>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Хедер */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar sx={{ minHeight: 48 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img src={logo} alt="logo" style={{ height: 38, marginRight: 16, borderRadius: 2 }} />
            </Box>
            <Button color="inherit" component={Link} to="/" sx={{ fontFamily: 'Alphasano, Arial, sans-serif', fontWeight: 400 }}>Главная</Button>
            <Button color="inherit" component={Link} to="/outfits" sx={{ fontFamily: 'Alphasano, Arial, sans-serif', fontWeight: 400, ml: 3 }}>Аутфиты</Button>
            <Button color="inherit" component={Link} to="/profile" sx={{ fontFamily: 'Alphasano, Arial, sans-serif', fontWeight: 400, ml: 3}}>Личный кабинет</Button>
          </Toolbar>
        </AppBar>

        {/* Контент */}
        <Container sx={{ flex: 1, mt: 4, mb: 0 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/outfits" element={<Outfits />} />
            <Route path="/outfits/:id" element={<OutfitPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Container>

        {/* Футер */}
        <AppBar
          position="static"
          color="default"
          elevation={1}
          sx={{
            top: 'auto',
            bottom: 0,
            minHeight: 48,
          }}
        >
          <Toolbar
            sx={{
              minHeight: 48,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: 'Alphasano, Arial, sans-serif', fontWeight: 400 }}>
              Email: info@outfitted.ru
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Alphasano, Arial, sans-serif', fontWeight: 400 }}>
              Outfitted © 2025
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Alphasano, Arial, sans-serif', fontWeight: 400 }}>
              Телефон: +7 (914) 803-42-48
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </Router>
  );
}

export default App;
