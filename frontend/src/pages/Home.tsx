import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

const API_URL = 'http://localhost:8000';

const Home: React.FC = () => {
  const [outfits, setOutfits] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/outfits/?limit=3`)
      .then(res => setOutfits(res.data.items));
  }, []);

  return (
    <Box>
      {/* Видео */}
      <Box
        sx={{
          width: '99vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: 'calc(-50vw + 9px)',
          marginRight: '-50vw',
          mt: '-28px',
          mb: '10px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <video
          src="/videos/main_video.mp4"
          style={{
            width: '99vw',
            height: 'auto',
            display: 'block',
            borderRadius: 12,
            margin: 0,
          }}
          autoPlay
          loop
          muted
        />
      </Box>
      {/* 3 аутфита из базы */}
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 800, mt: '100px', fontSize: '35px' }}>Подборка дня</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'start',
          mt: '30px',
        }}
      >
        {outfits.map((outfit) => (
          <Box
            key={outfit.id}
            sx={{
              maxWidth: 340,
              minWidth: 260,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
              border: '1.5px solid #bbb',
              p: 2,
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 6,
                borderColor: '#888',
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            // Можно добавить переход на страницу аутфита, если нужно
            // onClick={() => navigate(`/outfits/${outfit.id}`)}
          >
            <Box
              sx={{
                width: 300,
                height: 300,
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
              }}
            >
              <img
                src={outfit.image_url}
                alt={outfit.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff', borderRadius: 8 }}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              {outfit.title}
            </Typography>
          </Box>
        ))}
      </Box>
      {/* Блок с описанием сервиса */}
      <Box sx={{ mt: '120px', mb: '30px', textAlign: 'center'}}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700  }}>
          Outfitted — это современный сервис для поиска и вдохновения стильными образами.
        </Typography>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700  }}>
          Мы объединяем лучшие аутфиты и делаем моду доступной каждому.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700  }}>
          Добавляйте понравившиеся образы в избранное и делитесь ими с друзьями!
        </Typography>
      </Box>
      {/* Новый раздел с аватарками */}
      <Box sx={{ mt: '50px', mb: '100px' }}>
        
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mt: '100px' }}>
          Нас рекомендают
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '225px',
            mt: '30px',
          }}
        >
          {[
            { name: 'Kizaru', img: '/images/team/kizaru.png' },
            { name: 'Friendly Thug 52 NGG', img: '/images/team/friendlythug.png' },
            { name: 'Hugo Loud', img: '/images/team/hugoloud.png' },
          ].map((person) => (
            <Box key={person.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                component="img"
                src={person.img}
                alt={person.name}
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #222',
                  mb: 2,
                  background: '#2ecc40', // зелёный фон если нет фото
                }}
              />
              <Typography variant="subtitle1" align="center" sx={{ fontWeight: 700, fontSize: '20px' }}>
                {person.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home; 