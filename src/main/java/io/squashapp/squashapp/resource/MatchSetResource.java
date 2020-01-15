package io.squashapp.squashapp.resource;

import io.squashapp.squashapp.models.Match;
import io.squashapp.squashapp.models.MatchSet;
import io.squashapp.squashapp.models.User;
import io.squashapp.squashapp.repository.MatchRepository;
import io.squashapp.squashapp.repository.MatchSetRepository;
import io.squashapp.squashapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4500", maxAge = 3600)
@RestController
@RequestMapping("/matchSet")
public class MatchSetResource {


    @Autowired
    MatchSetRepository matchSetRepository;

    @Autowired
    MatchRepository matchRepository;

    @Autowired
    UserRepository userRepository;

    Logger logger = LoggerFactory.getLogger(MatchResource.class);

    @PostMapping("/add")
    public ResponseEntity<MatchSet> create(@RequestBody MatchSet matchSet, @RequestParam String matchId, @RequestParam String userName) {
        MatchSet createdMatchSet;

        Optional<Match> match = matchRepository.findById(Long.valueOf(matchId));

        Optional<User> winner = userRepository.findByUserName(userName);

        winner.get().setAge(20);

        if (match.isPresent() && winner.isPresent()) {
            matchSet.setMatch(match.get());
            matchSet.setWinner(winner.get());

            createdMatchSet = matchSetRepository.save(matchSet);

            if (createdMatchSet == null) {
                return ResponseEntity.notFound().build();
            } else {
                URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/getMatchSet/{id}")
                        .buildAndExpand(createdMatchSet.getId())
                        .toUri();

                return ResponseEntity.created(uri)
                        .body(createdMatchSet);
            }
        } else {
            return ResponseEntity.notFound().build();
        }


    }

    @GetMapping("/getMatchSet/{id}")
    public ResponseEntity<MatchSet> read(@PathVariable("id") String id) {
        Optional<MatchSet> foundMatchSet = matchSetRepository.findById(Long.valueOf(id));
        if (!foundMatchSet.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundMatchSet.get());
        }
    }

    @GetMapping("/getMatchSet")
    public ResponseEntity<Iterable<MatchSet>> read() {
        Optional<Iterable<MatchSet>> foundMatchSet = Optional.of(matchSetRepository.findAll());

        if (!foundMatchSet.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundMatchSet.get());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<MatchSet> update(@RequestBody MatchSet matchSet) throws URISyntaxException {

        Optional<MatchSet> foundMatchSet = matchSetRepository.findById(Long.valueOf(matchSet.getId()));

        if (!foundMatchSet.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {


            MatchSet createdMatchSet = matchSetRepository.save(matchSet);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getMatch/{id}")
                    .buildAndExpand(createdMatchSet.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdMatchSet);
        }
    }
}
