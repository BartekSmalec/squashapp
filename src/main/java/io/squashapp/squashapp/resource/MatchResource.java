package io.squashapp.squashapp.resource;

import io.squashapp.squashapp.models.Match;
import io.squashapp.squashapp.models.Tournament;
import io.squashapp.squashapp.models.User;
import io.squashapp.squashapp.repository.MatchRepository;
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
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4500", maxAge = 3600)
@RestController
@RequestMapping("/match")
public class MatchResource {

    @Autowired
    MatchRepository matchRepository;

    @Autowired
    TournamentRepository tournamentRepository;

    @Autowired
    UserRepository userRepository;

    Logger logger = LoggerFactory.getLogger(MatchResource.class);

    @PostMapping("/add")
    public ResponseEntity<Match> create(@RequestBody Match match, @RequestParam String tournamentId, @RequestParam String firstPersonName, @RequestParam String secondPersonName) {
        Match createdMatch;
        Optional<User> firstPerson;
        Optional<User> secondPerson;

        Optional<Tournament> foundTournament = tournamentRepository.findById(Long.valueOf(tournamentId));

        firstPerson = userRepository.findByUserName(firstPersonName);
        secondPerson = userRepository.findByUserName(secondPersonName);

        if (foundTournament.isPresent() && firstPerson.isPresent() && secondPerson.isPresent()) {

            match.setTournament(foundTournament.get());
            match.setFirstPerson(firstPerson.get());
            match.setSecondPerson(secondPerson.get());


            createdMatch = matchRepository.save(match);

            if (createdMatch == null) {
                return ResponseEntity.notFound().build();
            } else {
                URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/getMatch/{id}")
                        .buildAndExpand(createdMatch.getMatchId())
                        .toUri();

                return ResponseEntity.created(uri)
                        .body(createdMatch);
            }
        } else {
            return ResponseEntity.notFound().build();
        }


    }

    @GetMapping("/getMatch/{id}")
    public ResponseEntity<Match> read(@PathVariable("id") String id) {
        Optional<Match> foundMatch = matchRepository.findById(Long.valueOf(id));
        if (!foundMatch.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundMatch.get());
        }
    }

    @GetMapping("/getMatch")
    public ResponseEntity<Iterable<Match>> read() {
        Optional<Iterable<Match>> foundMatch = Optional.of(matchRepository.findAll());

        if (!foundMatch.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundMatch.get());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Match> update(@RequestBody Match match) throws URISyntaxException {

        Optional<Match> foundTournament = matchRepository.findById(Long.valueOf(match.getMatchId()));

        if (!foundTournament.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {

            Match createdMatch = matchRepository.save(match);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getMatch/{id}")
                    .buildAndExpand(createdMatch.getMatchId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdMatch);
        }
    }
}
