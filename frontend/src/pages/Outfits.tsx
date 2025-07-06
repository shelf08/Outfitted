import React from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Pagination } from '@mui/material';

const demoOutfits = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Аутфит ${i + 1}`,
  image: `https://via.placeholder.com/300x400?text=Outfit+${i + 1}`,
}));

const Outfits: React.FC = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Каталог аутфитов</Typography>
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
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Pagination count={5} color="primary" />
    </Box>
  </Box>
);

export default Outfits; 