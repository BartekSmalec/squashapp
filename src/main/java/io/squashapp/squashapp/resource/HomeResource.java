package io.squashapp.squashapp.resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@CrossOrigin(origins = "http://localhost:4500", maxAge = 3600)
@RestController
public class HomeResource {

    Logger logger = LoggerFactory.getLogger(HomeResource.class);

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/login")
    public ResponseEntity login() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/")
    public String home() {
        logger.info("Home resource");
        return ("<h1> Welcome </h1>");
    }

    @GetMapping("/user")
    public String user(Principal principal) {
        return ("<h1> Welcome: " + principal.getName() + "</h1>");
    }

    @GetMapping("/admin")
    public String admin(Principal principal) {
        return ("<h1> Welcome: " + principal.getName() + "</h1>");
    }

    @GetMapping("/currentUser")
    public String getCurrentUser(Principal principal) {
        return principal.getName();
    }
}
