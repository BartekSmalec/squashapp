package io.squashapp.squashapp.repository;

import io.squashapp.squashapp.models.Tournament;
import org.springframework.data.repository.CrudRepository;

public interface TournamentRepository extends CrudRepository<Tournament, Long> {
}
