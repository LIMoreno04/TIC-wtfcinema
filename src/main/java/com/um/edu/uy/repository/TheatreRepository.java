package com.um.edu.uy.repository;

import com.um.edu.uy.entities.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TheatreRepository extends JpaRepository<Theatre,String> {

    public Optional<Theatre> findByLocation(String location);
}
