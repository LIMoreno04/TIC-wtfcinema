package com.um.edu.uy.entities.plainEntities;

import com.um.edu.uy.entities.validators.ValidReleaseDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ScreeningID.class)
@Entity
public class Screening {

    @Id
    @ValidReleaseDate
    private LocalDateTime date_and_time;


    @ManyToOne
    @Id
    @JoinColumns({
            @JoinColumn(name = "room_number", referencedColumnName = "room_number"),
            @JoinColumn(name = "theatre", referencedColumnName = "theatre")
    })
    private Room room;


    @NotNull
    @ManyToOne
    @JoinColumn(name = "movieId")
    private Movie movie;

    @NotNull
    private String language;

    @OneToMany(mappedBy = "screening", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;

    public Screening(LocalDateTime date_and_time, Movie movie, boolean[][] reservedSeats, String language) {
        this.date_and_time = date_and_time;
        this.movie = movie;
        this.language = language;
    }

}
