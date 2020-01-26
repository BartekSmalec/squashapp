package io.squashapp.squashapp.resource;

import io.squashapp.squashapp.models.*;
import io.squashapp.squashapp.repository.*;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4500", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserResource {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    TournamentRepository tournamentRepository;

    Logger logger = LoggerFactory.getLogger(UserResource.class);

    @PostMapping("/register")
    public ResponseEntity<User> create(@RequestBody User user) {

        logger.info("USER: " + user.getUserName());

        User createdUser;

        if (userRepository.findByUserName(user.getUserName()).isPresent()) {
            return ResponseEntity.status(406).build();
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
    public ResponseEntity<User> update(@RequestBody User user) {

        Optional<User> foundUser = userRepository.findById(Long.valueOf(user.getId()));

        if (!foundUser.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setActive(true);

            User createdUser = userRepository.save(user);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getUsers/{id}")
                    .buildAndExpand(createdUser.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdUser);
        }
    }

    @GetMapping("/getUserByUserName/{userName}")
    public ResponseEntity<User> getUserByUserName(@PathVariable("userName") String userName) throws URISyntaxException {

        Optional<User> foundUser = userRepository.findByUserName(userName);

        if (!foundUser.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getUsers/{id}")
                    .buildAndExpand(foundUser.get().getId())
                    .toUri();


            return ResponseEntity.created(uri)
                    .body(foundUser.get());
        }
    }

    @GetMapping("/currentUser")
    public User getCurrentUser(Principal principal) {
        Optional<User> user = userRepository.findByUserName(principal.getName());
        return user.get();
    }

    @Autowired
    MatchRepository matchRepository;
    @Autowired
    MatchSetRepository matchSetRepository;
    @Autowired
    CommentRepository commentRepository;

    @DeleteMapping("/delete/{userName}")
    public ResponseEntity<DeletedResponse> delete(@PathVariable("userName") String userName) {
        Optional<User> user = userRepository.findByUserName(userName);

        List<Match> matches = (List<Match>) matchRepository.findAll();

        List<Match> filtered = (List<Match>) matches.stream().filter(m -> m.getFirstPerson().getUserName().equals(userName) || m.getSecondPerson().getUserName().equals(userName)).collect(Collectors.toList());

        List<MatchSet> matchSets = (List<MatchSet>) matchSetRepository.findAll();


        for (Match match : matches) {
            logger.info("Mathces: " + match.getSecondPerson().getUserName() + match.getSecondPerson().getUserName());
        }

        if (filtered.isEmpty()) {
            logger.info("Is empty");
        }

        for (Match match : filtered) {
            logger.info("Match: " + match.getFirstPerson().getUserName() + match.getSecondPerson().getUserName());
        }


        for (Match match : filtered) {
            logger.info("Match: " + match.getMatchId());
            List<MatchSet> filteredMatchSet = matchSets.stream().filter(s -> s.getMatch().getMatchId().equals(match.getMatchId())).collect(Collectors.toList());
            for (MatchSet matchSet : filteredMatchSet) {
                logger.info("MatchSet: " + matchSet.getId() + " " + matchSet.getMatch().getMatchId());
            }

            matchSetRepository.deleteAll(filteredMatchSet);
        }

        matchRepository.deleteAll(filtered);

        List<Comment> comments = (List<Comment>) commentRepository.findAll();

        List<Comment> filteredComments = comments.stream().filter(c-> c.getAuthor().getUserName().equals(userName)).collect(Collectors.toList());

        commentRepository.deleteAll(filteredComments);

        logger.info("Delete: " + user.get().getUserName());

        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            userRepository.delete(user.get());
            return ResponseEntity.ok(new DeletedResponse("Deleted", 200));
        }
    }


}
