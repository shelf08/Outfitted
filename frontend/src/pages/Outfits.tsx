import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Pagination, Button, Stack } from '@mui/material';

const API_URL = 'http://localhost:8000';
const limit = 12;

const Outfits: React.FC = () => {
  const [outfits, setOutfits] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/categories/`).then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    const params: any = { limit, offset: (page - 1) * limit };
    if (selectedCategory) params.category_id = selectedCategory;
    axios
      .get(`${API_URL}/outfits/`, { params })
      .then(res => {
        setOutfits(res.data.items);
        setTotal(res.data.total);
      });
  }, [page, selectedCategory]);

  return (
    <Box>
      <Typography variant="h5" align="center"  gutterBottom sx={{ fontWeight: 800, fontSize: '35px', mt: '20px' }}> Каталог аутфитов</Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Button
          variant={selectedCategory === null ? 'contained' : 'outlined'}
          onClick={() => { setSelectedCategory(null); setPage(1); }}
          sx={{
            fontFamily: 'Alphasano, Arial, sans-serif',
            bgcolor: selectedCategory === null ? '#111' : 'transparent',
            color: selectedCategory === null ? '#fff' : '#111',
            borderColor: '#111',
            '&:hover': {
              bgcolor: '#222',
              color: '#fff',
              borderColor: '#111',
            },
          }}
        >
          Все
        </Button>
        {categories.map((cat: any) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'contained' : 'outlined'}
            onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
            sx={{
              fontFamily: 'Alphasano, Arial, sans-serif',
              bgcolor: selectedCategory === cat.id ? '#111' : 'transparent',
              color: selectedCategory === cat.id ? '#fff' : '#111',
              borderColor: '#111',
              '&:hover': {
                bgcolor: '#222',
                color: '#fff',
                borderColor: '#111',
              },
            }}
          >
            {cat.name}
          </Button>
        ))}
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'start'
        }}
      >
        {outfits.map((outfit) => (
          <Box
            key={outfit.id}
            sx={{
              mt: '30px',
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
            onClick={() => navigate(`/outfits/${outfit.id}`)}
          >
            <img
              src={outfit.image_url}
              alt={outfit.title}
              style={{ width: '100%', borderRadius: 8, marginBottom: 12 }}
            />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              {outfit.title}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(total / limit)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default Outfits; 