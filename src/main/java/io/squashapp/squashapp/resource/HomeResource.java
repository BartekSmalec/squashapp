package io.squashapp.squashapp.resource;

import io.squashapp.squashapp.security.JwtProvider;
import io.squashapp.squashapp.models.JwtResponse;
import io.squashapp.squashapp.models.LoginForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@CrossOrigin(origins = "http://localhost:4500", maxAge = 3600)
@RestController
public class HomeResource {

    Logger logger = LoggerFactory.getLogger(HomeResource.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginForm loginForm) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginForm.getUserName(), loginForm.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateJwtToken(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        logger.info("INFO" + userDetails.getUsername() + " PASS" + userDetails.getPassword() + " role" + userDetails.getAuthorities());

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), userDetails.getAuthorities()));
    }

    @GetMapping("/")
    public String home() {
        logger.info("Home resource");
        return ("<h1> Welcome </h1>");
    }

    @GetMapping("/user")
    public String user() {
        return ("<h1> Welcome:  user" + "</h1>");
    }

    @GetMapping("/admin")
    public String admin() {
        return ("<h1> Welcome: admin");
    }

    @GetMapping("/currentUser")
    public String getCurrentUser(Principal principal) {
        return principal.getName();
    }
}
