package io.squashapp.squashapp.resource;

import io.squashapp.squashapp.models.Comment;
import io.squashapp.squashapp.models.Tournament;
import io.squashapp.squashapp.models.User;
import io.squashapp.squashapp.repository.CommentRepository;
import io.squashapp.squashapp.repository.TournamentRepository;
import io.squashapp.squashapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.Optional;


@CrossOrigin(origins = "http://localhost:4500", maxAge = 3600)
@RestController
@RequestMapping("/tournament")
public class TournamentResource {

    @Autowired
    TournamentRepository tournamentRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    CommentRepository commentRepository;

    Logger logger = LoggerFactory.getLogger(TournamentResource.class);

    @PostMapping("/addComment")
    public ResponseEntity<Tournament> createComment(@RequestBody Comment comment, @RequestParam String id, Principal principal) {

        Tournament createdTournament;

        Optional<Tournament> foundTournament = tournamentRepository.findById(Long.valueOf(id));

        Optional<User> currentUser = userRepository.findByUserName(principal.getName());

        if (currentUser.isPresent()) {
            comment.setAuthor(currentUser.get());
        }

        if (!foundTournament.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {


            foundTournament.get().getComments().add(comment);

            createdTournament = tournamentRepository.save(foundTournament.get());


            if (createdTournament == null) {
                return ResponseEntity.notFound().build();
            } else {
                URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/getTournament/{id}")
                        .buildAndExpand(createdTournament.getTournamentId())
                        .toUri();

                return ResponseEntity.created(uri)
                        .body(createdTournament);
            }
        }


    }


    @PostMapping("/add")
    public ResponseEntity<Tournament> create(@RequestBody Tournament tournament) {
        Tournament createdTournament;

        createdTournament = tournamentRepository.save(tournament);

        if (createdTournament == null) {
            return ResponseEntity.notFound().build();
        } else {
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getTournament/{id}")
                    .buildAndExpand(createdTournament.getTournamentId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdTournament);
        }
    }

    @GetMapping("/getTournament/{id}")
    public ResponseEntity<Tournament> read(@PathVariable("id") String id) {
        Optional<Tournament> foundTournament = tournamentRepository.findById(Long.valueOf(id));
        if (!foundTournament.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundTournament.get());
        }
    }

    @GetMapping("/getTournament")
    public ResponseEntity<Iterable<Tournament>> read() {
        Optional<Iterable<Tournament>> foundTournament = Optional.of(tournamentRepository.findAll());

        if (!foundTournament.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundTournament.get());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Tournament> update(@RequestBody Tournament tournament) throws URISyntaxException {

        Optional<Tournament> foundTournament = tournamentRepository.findById(Long.valueOf(tournament.getTournamentId()));

        if (!foundTournament.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {

            Tournament createdTournament = tournamentRepository.save(tournament);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getTournament/{id}")
                    .buildAndExpand(createdTournament.getTournamentId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdTournament);
        }
    }
}
