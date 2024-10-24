package com.um.edu.uy.repository;

import com.um.edu.uy.entities.Card;
import com.um.edu.uy.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    public Optional<Movie> findByTitle(String title);
}
