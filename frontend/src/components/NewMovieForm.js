import React, { useState } from 'react';
import {
  TextField, Button, Typography, Box, Autocomplete, Paper, CircularProgress,
  IconButton, Divider
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import RemoveIcon from '@mui/icons-material/Remove';
import { DateField } from '@mui/x-date-pickers/DateField';
import { format, parse } from 'date-fns';

const ErrorMessage = styled(Typography)({
  color: 'pink',
  fontWeight: 'bold',
  textShadow: '0 0 5px cyan',
  marginBottom: '10px',
});

const PGRatings = ["G", "PG", "PG-13", "R", "NC-17"];

const NewMovieForm = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(null); // Start with null for empty field
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState(null); // Start with null for empty field
  const [director, setDirector] = useState('');
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState('');
  const [poster, setPoster] = useState(null);
  const [PGRating, setPGRating] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const [openGenres, setOpenGenres] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const Overlay = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title || !duration || !description || !releaseDate || !director || genres.length === 0 || !PGRating) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("duration", format(duration, "HH:mm")); // Convert to HH:mm
      formData.append("description", description);
      formData.append("releaseDate", format(releaseDate, "yyyy-MM-dd")); // Convert to yyyy-MM-dd
      formData.append("director", director);
      
      genres.forEach((genre, index) => {
        formData.append('genres', genre.trim());
      });

      formData.append("poster", poster);
      formData.append("PGRating", PGRating);
      console.log(formData)
      const response = await fetch('http://localhost:8080/api/movies/addMovie', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error: ', errorData);
        setErrorMessage(errorData || 'Error inesperado.');
      } else {
        alert("Película agregada con éxito.");
        setTitle('');
        setDuration(null);
        setDescription('');
        setReleaseDate(null);
        setDirector('');
        setGenres([]);
        setPoster(null);
        setPGRating('');
      }
    } catch (err) {
      setError('Failed to connect to server.');
    }
    
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) setPoster(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e);
  };

  const handleAddGenre = () => {
    if (newGenre && !genres.includes(newGenre.trim())) {
      setGenres([...genres, newGenre.trim()]);
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (index) => {
    setGenres(genres.filter((_, i) => i !== index));
  };

  const allFieldsFilled = title && duration && description && releaseDate && director && genres.length > 0 && PGRating && poster;

  return (
    <Box position="relative">
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {loading && (
        <Overlay>
          <CircularProgress />
        </Overlay>
      )}
    <Paper sx={{ border:'2px solid #9df8fc', borderRadius:'30px', padding: '60px',maxWidth:'850px' ,flexDirection: 'column', margin: 'auto', opacity: loading ? 0.5 : 1 }}>
    
    <Box align={'center'} maxWidth={850} sx={{margin:'auto'}}>
        <Box mt={-5} mb={1}>
            <Typography variant='neonCyan' fontSize={'40px'}>Agregar película</Typography>
        </Box>
    {error && <ErrorMessage>{error}</ErrorMessage>}
      <Box sx={{paddingY: 2, display: 'flex', gap: 2, maxWidth: 800, margin: 'auto' }}>
        {/* Poster section */}
        <Box sx={{ flex: 0.75, maxWidth: '50%' }}>
            <Paper
            elevation={3}
            sx={{
                border: isDragging ? '2px dashed #e4b4e6' : '2px solid #e4b4e6',
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                height: 292,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDragging ? 'rgba(228, 180, 230, 0.1)' : 'transparent',
            }}
            onClick={() => document.getElementById('file-input').click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            >
            <ImageIcon fontSize="large"/>
            <Typography variant="subtitle1">{poster ? poster.name : 'Arrastre o elija el archivo del poster'}</Typography>
            </Paper>
            <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
            required
            />
        </Box>

        {/* Fields section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required/>
          
          <TimeField
            label="Duración"
            value={duration}
            onChange={(newValue) => setDuration(newValue)}
            format="HH:mm"
            required
          />

            <DateField
                label="Fecha de estreno"
                format="dd-MM-yyyy"
                value={releaseDate}
                onChange={(newValue) => setReleaseDate(newValue)}
            />

          <TextField label="Dirección" value={director} onChange={(e) => setDirector(e.target.value)} required />

          <Autocomplete
            options={PGRatings}
            value={PGRating}
            onChange={(e, newValue) => setPGRating(newValue)}
            renderInput={(params) => <TextField {...params} label="PG Rating" required />}
          />
        </Box>
      </Box>

      {/* Description and Genres section */}
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800, margin: 'auto' }}>
        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          multiline
          rows={4}
          fullWidth
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Paper onClick={() => setOpenGenres(!openGenres)}      
            sx={{
              padding: 1,
              backgroundColor: '#18181c',
              textAlign: 'center',
              borderRadius: '5px',
              border: '1px solid #e4b4e6',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.02)' },
              cursor: 'pointer',
            }}> 
            <Box display={'flex'} flexDirection={'column'}>
              <Typography>Géneros</Typography>
            </Box>
          </Paper>
          {openGenres && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 1 }}>
              {genres.map((genre, index) => (
                <Box key={index} display="flex" flexDirection={'row'} justifyContent={'space-between'} paddingX={2.2}>
                  <Typography>{genre}</Typography>
                  <IconButton onClick={() => handleRemoveGenre(index)} size="small">
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Divider />
              <TextField
                label="Agregar género"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleAddGenre}>
                      <AddIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          )}
        </Box>

        <Button variant="contained" onClick={handleSubmit} disabled={!allFieldsFilled}>Enviar</Button>
      </Box>
      </Box>
      </Paper>
    </LocalizationProvider>
    </Box>
  );
};

export default NewMovieForm;
