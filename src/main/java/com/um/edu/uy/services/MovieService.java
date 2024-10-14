package com.um.edu.uy.services;

import com.um.edu.uy.entities.Movie;
import com.um.edu.uy.enums.MovieGenre;
import com.um.edu.uy.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public class MovieService {

    @Autowired
    private MovieRepository movieRepo;

    public Movie addMovie(String title, LocalTime duration, String description, LocalDate releaseDate, String director, List<MovieGenre> genres) {
        Movie movie = Movie.builder()
                .title(title)
                .duration(duration)
                .description(description)
                .releaseDate(releaseDate)
                .director(director)
                .genres(genres)
                .build();
        return movieRepo.save(movie);
    }


}
