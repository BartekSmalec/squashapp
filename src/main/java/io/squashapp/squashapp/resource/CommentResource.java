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

@RestController
@RequestMapping("/comment")
public class CommentResource {

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TournamentRepository tournamentRepository;

    Logger logger = LoggerFactory.getLogger(CommentResource.class);

    @PostMapping("/add")
    public ResponseEntity<Comment> create(@RequestBody Comment comment, Principal principal) {
        Comment createdComment;

        Optional<User> currentUser = userRepository.findByUserName(principal.getName());

        if(currentUser.isPresent())
        {
            comment.setAuthor(currentUser.get());
        }

        createdComment = commentRepository.save(comment);

        if (createdComment == null) {
            return ResponseEntity.notFound().build();
        } else {
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getComment/{id}")
                    .buildAndExpand(createdComment.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdComment);
        }
    }

    @PostMapping("/addComment")
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment, Principal principal, @RequestParam Long id) {
        Comment createdComment;

        Optional<User> currentUser = userRepository.findByUserName(principal.getName());

        Optional<Tournament> currentTournament = tournamentRepository.findById(id);

        if(currentTournament.isPresent())
        {
            comment.setTournament(currentTournament.get());
        }

        if(currentUser.isPresent())
        {
            comment.setAuthor(currentUser.get());
        }

        createdComment = commentRepository.save(comment);

        if (createdComment == null) {
            return ResponseEntity.notFound().build();
        } else {
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getComment/{id}")
                    .buildAndExpand(createdComment.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdComment);
        }
    }


    @GetMapping("/getComment/{id}")
    public ResponseEntity<Comment> read(@PathVariable("id") String id) {
        Optional<Comment> foundComment = commentRepository.findById(Long.valueOf(id));
        if (!foundComment.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundComment.get());
        }
    }

    @GetMapping("/getComment")
    public ResponseEntity<Iterable<Comment>> read() {
        Optional<Iterable<Comment>> foundComment = Optional.of(commentRepository.findAll());

        if (!foundComment.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(foundComment.get());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Comment> update(@RequestBody Comment comment) throws URISyntaxException {

        Optional<Comment> foundComment = commentRepository.findById(Long.valueOf(comment.getId()));

        if (!foundComment.isPresent()) {
            return ResponseEntity.notFound().build();
        } else {

            Comment createdComment = commentRepository.save(comment);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/getTournament/{id}")
                    .buildAndExpand(createdComment.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(createdComment);
        }
    }
}
