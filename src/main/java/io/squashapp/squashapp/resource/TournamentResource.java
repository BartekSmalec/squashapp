package io.squashapp.squashapp.resource;

import io.squashapp.squashapp.models.*;
import io.squashapp.squashapp.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;


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
    @Autowired
    MatchRepository matchRepository;
    @Autowired
    MatchSetRepository matchSetRepository;

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

    @PostMapping("/addParticipant")
    public ResponseEntity<Tournament> addParticipant(@RequestParam String id, Principal principal) {

        logger.info("addParticipant: ");

        Tournament createdTournament;

        Optional<Tournament> foundTournament = tournamentRepository.findById(Long.valueOf(id));

        Optional<User> currentUser = userRepository.findByUserName(principal.getName());

        if (currentUser.isPresent()) {
        }

        if (!foundTournament.isPresent() || !currentUser.isPresent() || foundTournament.get().getParticipants().contains(currentUser.get())) {
            return ResponseEntity.notFound().build();
        } else {


            foundTournament.get().getParticipants().add(currentUser.get());

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

    @PostMapping("/removeParticipant")
    public ResponseEntity<Tournament> removeParticipant(@RequestParam String id, Principal principal) {

        logger.info("removeParticipant: ");

        Tournament createdTournament;

        Optional<Tournament> foundTournament = tournamentRepository.findById(Long.valueOf(id));

        Optional<User> currentUser = userRepository.findByUserName(principal.getName());

        if (currentUser.isPresent()) {
        }

        if (!foundTournament.isPresent() || !currentUser.isPresent() || !foundTournament.get().getParticipants().contains(currentUser.get())) {
            logger.info("Found tournament: " + foundTournament.isPresent());
            logger.info("currentUser is present: " + currentUser.isPresent());
            logger.info("Contains user: " + foundTournament.get().getParticipants().contains(currentUser.get()));


            return ResponseEntity.notFound().build();
        } else {

            logger.info("Size: " + foundTournament.get().getParticipants().size());

            foundTournament.get().getParticipants().remove(currentUser.get());

            logger.info("Size: " + foundTournament.get().getParticipants().size());

            createdTournament = tournamentRepository.save(foundTournament.get());

            if (createdTournament == null) {
                logger.info("createdTournament is null: ");

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


    @GetMapping("/getTournamentForPrincipal")
    public ResponseEntity<List<Tournament>> readTournamentForPrincipal(Principal principal) {

        List<Tournament> foundTournament = (List<Tournament>) tournamentRepository.findAll();

        Optional<User> user = userRepository.findByUserName(principal.getName());

        logger.info("Length: " + foundTournament.size());

        List<Tournament> currentTournament = StreamSupport.stream(foundTournament.spliterator(), false).filter(s -> s.getParticipants().contains(user.get())).collect(Collectors.toList());

        logger.info("Length: " + currentTournament.size());
        logger.info("User: " + user.get().getUserName());


        if (currentTournament.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(currentTournament);
        }
    }


    @GetMapping("/getTournamentForUser/{userName}")
    public ResponseEntity<List<Tournament>> getTournamentForUser(@PathVariable("userName") String userName) {

        List<Tournament> foundTournament = (List<Tournament>) tournamentRepository.findAll();

        Optional<User> user = userRepository.findByUserName(userName);

        logger.info("Length: " + foundTournament.size());

        List<Tournament> currentTournament = StreamSupport.stream(foundTournament.spliterator(), false).filter(s -> s.getParticipants().contains(user.get())).collect(Collectors.toList());

        logger.info("Length: " + currentTournament.size());
        logger.info("User: " + user.get().getUserName());


        if (currentTournament.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(currentTournament);
        }
    }

    @GetMapping("/getWinner/{id}")
    public ResponseEntity<User> getWinner(@PathVariable("id") String id) {

        Optional<Tournament> foundTournament = tournamentRepository.findById(Long.valueOf(id));

        List<MatchSet> matchSets = (List<MatchSet>) matchSetRepository.findAll();

        List<Match> match = (List<Match>) matchRepository.findAll();


        List<MatchSet> matchSetList = matchSets.stream()
                .filter(m -> m.getMatch().getTournament().getTournamentId().equals(foundTournament.get().getTournamentId())).collect(Collectors.toList());


        if (foundTournament.get().isTypeOfCountingResult()) {

            Optional<Integer> lastRound = match.stream().map(m -> m.getRound()).max(Integer::compareTo);

            logger.info("Max round: " + lastRound.get());


            List<MatchSet> matchSet = matchSets.stream()
                    .filter(m -> m.getMatch().getTournament().getTournamentId().equals(foundTournament.get().getTournamentId())).collect(Collectors.toList());


            if (matchSet.isEmpty()) {
                logger.info("IS EMPTY");
            }
            Map<User, Integer> winnerToCount =
                    matchSet.stream().collect(
                            Collectors.groupingBy(p -> p.getWinner(),
                                    Collectors.summingInt(a -> 1)));

            if (winnerToCount.isEmpty()) {
                logger.info("winnerToCount IS EMPTY");
            }
            winnerToCount.forEach((key, value) -> logger.info("MAP: " + key.getUserName() + ":" + value));


            List<Match> matches = match.stream().filter(m -> m.getRound() == lastRound.get()).collect(Collectors.toList());

            for (Match m : matches) {
                logger.info("M: " + m.getRound());

                Map<User, Integer> w =
                        m.getMatchSet().stream().collect(
                                Collectors.groupingBy(p -> p.getWinner(),
                                        Collectors.summingInt(a -> 1)));
                if (w.isEmpty()) {
                    return ResponseEntity.notFound().build();
                } else {
                    w.forEach((key, value) -> logger.info("WINNER IN MATCH: " + key.getUserName() + ":" + value));

                    Map.Entry<User, Integer> winner = w.entrySet().stream().max(Comparator.comparingInt(e -> e.getValue())).get();

                    logger.info("Winner:  " + winner.getKey().getUserName());

                    return ResponseEntity.ok(winner.getKey());
                }


            }


        } else {


            Map<User, Integer> winnerToCount =
                    matchSetList.stream().collect(
                            Collectors.groupingBy(p -> p.getWinner(),
                                    Collectors.summingInt(a -> 1)));

            winnerToCount.forEach((key, value) -> logger.info("MAP: " + key.getUserName() + ":" + value));

            if (winnerToCount.isEmpty()) {
                return ResponseEntity.notFound().build();
            } else {
                Map.Entry<User, Integer> winner = winnerToCount.entrySet().stream().max(Comparator.comparingInt(e -> e.getValue())).get();

                logger.info("Winner:  " + winner.getKey().getUserName());

                return ResponseEntity.ok(winner.getKey());
            }
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DeletedResponse> delete(@PathVariable("id") String id) {
        Optional<Tournament> foundTournament = tournamentRepository.findById(Long.valueOf(id));

        List<Match> matches = (List<Match>) matchRepository.findAll();

        List<MatchSet> matchSets = (List<MatchSet>) matchSetRepository.findAll();

        List<Match> filteredMatches = matches.stream().filter(m -> m.getTournament().getTournamentId().equals(foundTournament.get().getTournamentId())).collect(Collectors.toList());

        for (Match match : filteredMatches) {
            logger.info("Match: " + match.getMatchId());
            List<MatchSet> filteredMatchSet = matchSets.stream().filter(s -> s.getMatch().getMatchId().equals(match.getMatchId())).collect(Collectors.toList());
            for (MatchSet matchSet : filteredMatchSet) {
                logger.info("MatchSet: " + matchSet.getId() + " " + matchSet.getMatch().getMatchId());
            }

            matchSetRepository.deleteAll(filteredMatchSet);
        }

        matchRepository.deleteAll(filteredMatches);

        logger.info("Delete: " + foundTournament.get().getTournamentName());

        if (!foundTournament.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            tournamentRepository.delete(foundTournament.get());
            return ResponseEntity.ok(new DeletedResponse("Deleted", 200));
        }
    }


}
