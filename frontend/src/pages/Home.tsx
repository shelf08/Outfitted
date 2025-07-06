import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';

const demoOutfits = [
  { id: 1, title: 'Весенний образ', image: 'https://via.placeholder.com/300x400?text=Outfit+1' },
  { id: 2, title: 'Городской стиль', image: 'https://via.placeholder.com/300x400?text=Outfit+2' },
  { id: 3, title: 'Вечерний выход', image: 'https://via.placeholder.com/300x400?text=Outfit+3' },
];

const Home: React.FC = () => (
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
    {/* 3 аутфита */}
    <Typography variant="h5" gutterBottom>Подборки дня</Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
      {demoOutfits.map((outfit) => (
        <Box key={outfit.id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' }, mb: 3 }}>
          <Card>
            <CardMedia component="img" height="320" image={outfit.image} alt={outfit.title} />
            <CardContent>
              <Typography variant="h6">{outfit.title}</Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  </Box>
);

export default Home; 