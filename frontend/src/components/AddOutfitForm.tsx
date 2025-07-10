import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

interface Category {
  id: number;
  name: string;
}

interface AddOutfitFormProps {
  onClose: () => void;
  onSuccess: () => void;
  outfit?: any; // если передан, то режим редактирования
}

const AddOutfitForm: React.FC<AddOutfitFormProps> = ({ onClose, onSuccess, outfit }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    category_id: '',
    items: [{ name: '', brand: '', model: '' }]
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
    if (outfit) {
      setForm({
        title: outfit.title || '',
        description: outfit.description || '',
        image_url: outfit.image_url || '',
        category_id: outfit.category?.id?.toString() || outfit.category_id?.toString() || '',
        items: outfit.items?.length > 0 ? outfit.items.map((item: any) => ({
          name: item.name || '',
          brand: item.brand || '',
          model: item.model || ''
        })) : [{ name: '', brand: '', model: '' }]
      });
    }
  }, [outfit]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    setForm({ ...form, category_id: e.target.value });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { name: '', brand: '', model: '' }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!form.title || !form.category_id) {
      setError('Заполните обязательные поля');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (outfit) {
        // Режим редактирования
        await axios.put(`${API_URL}/outfits/${outfit.id}`, {
          ...form,
          category_id: parseInt(form.category_id),
          items: form.items.filter(item => item.name.trim() !== '')
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Аутфит успешно обновлен!');
      } else {
        // Режим добавления
        await axios.post(`${API_URL}/outfits/`, {
          ...form,
          category_id: parseInt(form.category_id),
          items: form.items.filter(item => item.name.trim() !== '')
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Аутфит успешно добавлен!');
      }
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.detail || (outfit ? 'Ошибка при обновлении аутфита' : 'Ошибка при добавлении аутфита'));
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {outfit ? 'Редактировать аутфит' : 'Добавить новый аутфит'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Название аутфита *"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
        />
        
        <TextField
          label="Описание"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />
        
        <TextField
          label="URL изображения"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          fullWidth
        />
        
        <FormControl fullWidth>
          <InputLabel>Категория *</InputLabel>
          <Select
            value={form.category_id}
            onChange={handleCategoryChange}
            label="Категория *"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography variant="h6" sx={{ mt: 2 }}>
          Вещи в аутфите
        </Typography>
        
        {form.items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              label="Название вещи"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Бренд"
              value={item.brand}
              onChange={(e) => handleItemChange(index, 'brand', e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Модель"
              value={item.model}
              onChange={(e) => handleItemChange(index, 'model', e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeItem(index)}
              disabled={form.items.length === 1}
            >
              Удалить
            </Button>
          </Box>
        ))}
        
        <Button variant="outlined" onClick={addItem}>
          Добавить вещь
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            {outfit ? 'Сохранить изменения' : 'Добавить аутфит'}
          </Button>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Отмена
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddOutfitForm; 