package com.um.edu.uy.entities.DTOs;

import lombok.Data;

import java.util.List;

@Data
public class MovieDTO {
    private long id;
    private String title;
    private String duration;
    private String description;
    private String releaseDate;
    private String director;
    private List<String> genres;
    private Boolean currentlyOnDisplay;
    private byte[] poster;
}