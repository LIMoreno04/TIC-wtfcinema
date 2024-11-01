package com.um.edu.uy.entities.plainEntities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends User {

    @ManyToMany
    @JoinTable(
            name = "customer_card",
            joinColumns = @JoinColumn(name = "email"),
            inverseJoinColumns = @JoinColumn(name = "cardNumber")
    )
    private List<Card> paymentMethods;

    @Builder(builderMethodName = "customerBuilder")
    public Customer(String email, String firstName, String lastName, LocalDate dateOfBirth, String celCountryCode, String celNumber, String idType, String idCountry, String idNumber, String password) {
        super(email, firstName, lastName, dateOfBirth, celCountryCode, celNumber, idType, idCountry, idNumber, password);
    }

    @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;
}