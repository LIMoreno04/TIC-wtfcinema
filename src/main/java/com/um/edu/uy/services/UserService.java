package com.um.edu.uy.services;

import com.um.edu.uy.entities.Card;
import com.um.edu.uy.entities.Customer;
import com.um.edu.uy.entities.User;
import com.um.edu.uy.enums.CardType;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Optional;

import static com.um.edu.uy.entities.FieldValidation.*;

public class UserService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CardService cardService;

    public User logIn(String email, String password) throws InvalidDataException {
        Optional<User> result = userRepo.findById(email);
        if(result.isPresent()){
            if(result.get().getPassword().equals(password)){
                return result.get();
            }
            else{
                throw new InvalidDataException("Contraseña incorrecta"); //preguntar como lo hacemos
            }
        }
        else{
            throw new InvalidDataException("Ususario no encontrado.");
        }
    }

    public Customer customerSingUp(String email, String password, String firstName, String lastName, LocalDate dateOfBirth, CountryCode celCountryCode, long celNumber, IdDocumentType idType, CountryCode idCountry, long idNumber) throws InvalidDataException {
        if (isEmailValid(email) || isPasswordValid(password) || firstName == null || lastName == null ||  isBirthDateValid(dateOfBirth) || celCountryCode == null || celNumber == 0 || idType == null || idCountry == null || celCountryCode == null || idNumber == 0) {
            throw new InvalidDataException("Datos incorrectos");
        }
        if (userRepo.findById(email).isPresent()) {
            throw new InvalidDataException("Usuario ya registrado");
        }
        Customer customer = (Customer) User.builder()
                .email(email)
                .password(password)
                .firstName(firstName)
                .lastName(lastName)
                .dateOfBirth(dateOfBirth)
                .celCountryCode(celCountryCode)
                .celNumber(celNumber)
                .idType(idType)
                .idCountry(idCountry)
                .idCountry(idCountry)
                .build();
        return userRepo.save(customer);
    }

    public void addPaymentMethod(String email, CardType cardType, String holderName, long cardNumber, YearMonth expirationDate, int cvv) throws InvalidDataException {
        Card card = cardService.addCard(cardType,holderName,cardNumber,expirationDate, cvv);
        Optional<User> result = userRepo.findById(email);
        if (isEmailValid(email) && result.isPresent()) {
            User user = result.get();
            if (user instanceof Customer) {
                Customer customer = (Customer) user;
                customer.getPaymentMethods().add(card);
            }
        }
    }






}
