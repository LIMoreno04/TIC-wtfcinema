package com.um.edu.uy.entities;

import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@Builder
@Entity
public class User {
    @NotNull
    @Id
    @Email
    private String email;

    @NotNull
    private String firstName;

    @NotNull
    private  String lastName;

    @NotNull
    @ValidBirthDate
    private LocalDate dateOfBirth;

    @NotNull
    private CountryCode celCountryCode;

    @NotNull
    @Pattern(regexp = "^[0-9]{10,15}$", message = "El número de teléfono debe contener entre 10 y 15 dígitos y no debe incluir otros caracteres")
    private long celNumber;

    @NotNull
    private IdDocumentType idType;

    @NotNull
    private CountryCode idCountry;

    @NotNull
    @Column(unique = true)
    private long idNumber;

    @NotNull
    @ValidPassword
    private String password;
}
