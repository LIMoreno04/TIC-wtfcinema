package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.User;
import com.um.edu.uy.entities.UserDTO;
import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserRestController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<User> userSignUp(@RequestBody UserDTO userDTO, HttpSession session) {
        System.out.println(userDTO.toString());

        String realCelCountryCode = CountryCode.valueOf(userDTO.getCelCountryCode().toUpperCase()).getCountryName();
        String realIdType = IdDocumentType.valueOf(userDTO.getIdType()).getType();
        String realIdCountryCode = CountryCode.valueOf(userDTO.getIdCountry().toUpperCase()).getCountryName();
        LocalDate realDateOfBirth = LocalDate.parse(userDTO.getDateOfBirth());

        User newUser = userService.addUser(
                userDTO.getEmail(),
                userDTO.getFirstName(),
                userDTO.getLastName(),
                realDateOfBirth,
                realCelCountryCode,
                userDTO.getCelNumber(),
                realIdType,
                realIdCountryCode,
                userDTO.getIdNumber(),
                userDTO.getPassword()
        );
        session.setAttribute("user", newUser);
        session.setAttribute("auth", true);
        System.out.println("Session ID: " + session.getId());

        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> userLogIn(@RequestBody UserDTO loginDTO, HttpSession session) {
        System.out.println("Session ID: " + session.getId());
        System.out.println("User: " + session.getAttribute("user"));


        try {
            User user = userService.findUser(loginDTO.getEmail(), loginDTO.getPassword());

            // Store user in session
            session.setAttribute("user", user);
            session.setAttribute("auth", true);
            System.out.println("login");

            User savedUser = (User) session.getAttribute("user");

            System.out.println("Nombre login: " + savedUser.getFirstName());

            System.out.println("Session ID: " + session.getId());

            return ResponseEntity.ok(user);
        } catch (InvalidDataException e) {
            String errorMessage = e.getMessage();
            if (errorMessage.contains("email")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "email"));
            } else if (errorMessage.contains("password")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "password"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "unknown"));
            }
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate(); // Invalidate the session
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/auth")
    public ResponseEntity<Boolean> isAuthenticated(HttpSession session) {
        System.out.println("auth");
        System.out.println("Session ID: " + session.getId());

        Boolean isAuthenticated = (Boolean) session.getAttribute("auth");
        return ResponseEntity.ok(isAuthenticated != null && isAuthenticated);
    }
}