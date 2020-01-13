package io.squashapp.squashapp.repository;

import io.squashapp.squashapp.models.Match;
import org.springframework.data.repository.CrudRepository;

public interface MatchRepository extends CrudRepository<Match, Long> {
}
