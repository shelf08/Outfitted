import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Pagination, Grid } from '@mui/material';

const API_URL = 'http://localhost:8000';
const limit = 12;

const Outfits: React.FC = () => {
  const [outfits, setOutfits] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/outfits/?limit=${limit}&offset=${(page - 1) * limit}`)
      .then(res => {
        setOutfits(res.data.items);
        setTotal(res.data.total);
      });
  }, [page]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Каталог аутфитов</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'start',
          mt: 2,
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