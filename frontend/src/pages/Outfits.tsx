import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography, Pagination } from '@mui/material';

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
      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
        {outfits.map((outfit) => (
          <Box key={outfit.id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' }, mb: 3, cursor: 'pointer' }} onClick={() => navigate(`/outfits/${outfit.id}`)}>
            <Card sx={{ border: '1.5px solid black' }}>
              <Box sx={{ p: '3px' }}>
                <CardMedia
                  component="img"
                  image={outfit.image_url}
                  alt={outfit.title}
                  sx={{
                    width: '100%',
                    height: 320,
                    objectFit: 'cover',
                    border: '1px solid black',
                    borderRadius: 2,
                    background: '#fff'
                  }}
                />
              </Box>
              <CardContent>
                <Typography variant="h6">{outfit.title}</Typography>
              </CardContent>
            </Card>
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