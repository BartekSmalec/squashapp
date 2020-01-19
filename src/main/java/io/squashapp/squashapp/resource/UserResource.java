package io.squashapp.squashapp.resource;

import io.squashapp.squashapp.models.User;
import io.squashapp.squashapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4500", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserResource {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    Logger logger = LoggerFactory.getLogger(UserResource.class);

    @PostMapping("/register")
    public ResponseEntity<User> create(@RequestBody User user) {

        logger.info("USER: " + user.getUserName());

        User createdUser;

        if (userRepository.findByUserName(user.getUserName()).isPresent()) {
            return ResponseEntity.badRequest().build();
        } else {
            logger.info("User password: " + user.getPassword());

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setActive(true);
            user.setRoles("ROLE_USER");
            createdUser = userRepository.save(user);
        }

        if (createdUser == null) {
            return ResponseEntity.notFound().build();
        } else {
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getUsers/{id}")
                    .buildAndExpand(createdUser.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdUser);
        }
    }

    @GetMapping("/getUsers/{id}")
    public ResponseEntity<User> read(@PathVariable("id") String id) {
        Optional<User> foundUser = userRepository.findById(Long.valueOf(id));
        if (!foundUser.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundUser.get());
        }
    }

    @GetMapping("/getUsers")
    public ResponseEntity<Iterable<User>> read() {
        Optional<Iterable<User>> foundUsers = Optional.of(userRepository.findAll());

        if (!foundUsers.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundUsers.get());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<User> update(@RequestBody User user) throws URISyntaxException {

        Optional<User> foundUser = userRepository.findById(Long.valueOf(user.getId()));

        if (!foundUser.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {

            User createdUser = userRepository.save(user);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getUsers/{id}")
                    .buildAndExpand(createdUser.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdUser);
        }
    }

    @GetMapping("/currentUser")
    public User getCurrentUser(Principal principal) {
        Optional<User> user = userRepository.findByUserName(principal.getName());
        return user.get();
    }


}
