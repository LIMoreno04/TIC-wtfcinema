import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  Paper,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { es } from "date-fns/locale";

const languages = ["Español", "Inglés"];

const NewScreeningForm = ({ initialRoom, initialMovieId }) => {
  const [theatre, setTheatre] = useState(initialRoom?.theatre || "");
  const [roomNumber, setRoomNumber] = useState(initialRoom?.roomNumber || "");
  const [selectedMovieTitle, setSelectedMovieTitle] = useState("");
  const [movieId, setMovieId] = useState(initialMovieId || "");
  const [movies, setMovies] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [language, setLanguage] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [screeningPrice, setScreeningPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all possible theatres if not given
  useEffect(() => {
    if (!initialRoom) {
      fetch("http://localhost:8080/api/theatre/allLocations")
        .then((response) => response.json())
        .then((data) => setTheatres(data))
        .catch((error) => console.error("Error fetching theatres:", error));
    }
  }, [initialRoom]);

  // Fetch movies if movieId is not provided
  useEffect(() => {
    if (!initialMovieId) {
      fetch("http://localhost:8080/api/movies/allTitles")
        .then((response) => response.json())
        .then((data) => {
          setMovies(data);
          setMovieOptions(data.map(([id, title]) => title));
        })
        .catch((error) => console.error("Error fetching movies:", error));
    }
  }, [initialMovieId]);

  // Fetch rooms when a theatre is selected
  useEffect(() => {
    if (theatre) {
      fetch(`http://localhost:8080/api/theatre/rooms/${encodeURIComponent(theatre)}`)
        .then((response) => response.json())
        .then((data) => setRooms(data))
        .catch((error) => console.error("Error fetching rooms:", error));
    }
  }, [theatre]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Find the movie ID based on the selected title
    const selectedMovie = movies.find(([id, title]) => title === selectedMovieTitle);

    // Combine date and time into a single ISO string
    let dateTime = null;
    if (date && time) {
      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      );
      dateTime = combinedDateTime.toISOString();
    }

    const screeningData = {
      movieId: selectedMovie?.[0], // Use the ID for submission
      theatre,
      roomNumber,
      language,
      date_and_time: dateTime,
      screeningPrice,
    };

    try {
      const response = await fetch("http://localhost:8080/api/rooms/addScreening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(screeningData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
      } else {
        alert("Screening added successfully!");
        // Reset the form
        setTheatre("");
        setRoomNumber("");
        setSelectedMovieTitle("");
        setLanguage("");
        setDate(null);
        setTime(null);
        setScreeningPrice("");
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box position="relative">
        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Paper
          sx={{
            padding: "40px",
            maxWidth: "600px",
            margin: "auto",
            border: "2px solid #9df8fc",
            borderRadius: "20px",
          }}
        >
          <Typography variant="neonCyan" fontSize="2.5rem" gutterBottom>
            Add New Screening
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ paddingTop: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {!initialRoom && (
              <Autocomplete
                options={theatres}
                value={theatre}
                onChange={(e, newValue) => setTheatre(newValue)}
                renderInput={(params) => <TextField {...params} label="Theatre" required />}
              />
            )}

            {theatre && (
              <Autocomplete
              options={rooms}
              value={roomNumber}
              onChange={(e, newValue) => setRoomNumber(newValue)}
              getOptionLabel={(option) => (option ? String(option) : "")} // Ensure a string is returned
              renderInput={(params) => <TextField {...params} label="Room" required />}
            />            
            )}

            <DatePicker
              label="Date"
              format="dd/MM/yyyy"
              dayOfWeekFormatter={(date) => <Typography fontSize={'0.8rem'} color='#0ff0fc'>{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].at(date.getDay())}</Typography>}
              value={date}
              onChange={(newValue) => setDate(newValue)}
              renderInput={(params) => <TextField {...params} required />}
            />

            <TimePicker
              label="Time"
              value={time}
              onChange={(newValue) => setTime(newValue)}
              renderInput={(params) => <TextField {...params} required />}
            />

            {!initialMovieId && (
              <Autocomplete
                options={movieOptions}
                value={selectedMovieTitle}
                onChange={(e, newValue) => setSelectedMovieTitle(newValue)}
                renderInput={(params) => <TextField {...params} label="Movie" required />}
              />
            )}

            <Autocomplete
              options={languages}
              value={language}
              onChange={(e, newValue) => setLanguage(newValue)}
              renderInput={(params) => <TextField {...params} label="Language" required />}
            />

            <TextField
              label="Screening Price"
              type="number"
              value={screeningPrice}
              onChange={(e) => setScreeningPrice(e.target.value)}
              required
            />

            <Button variant="contained" type="submit" disabled={loading}>
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default NewScreeningForm;
