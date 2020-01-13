package io.squashapp.squashapp.repository;

import io.squashapp.squashapp.models.Tournament;
import io.squashapp.squashapp.models.User;

import java.util.Collection;
import java.util.Optional;

public interface ITournamentResource {
    public abstract void createTournament(User user);
    public abstract void updateTournament(String id, User product);
    public abstract void deleteTournament(String id);
    public abstract Tournament getTournamentById(String id);
    public abstract Optional<Tournament> getTournamentByName(String name);
    public abstract Collection<Tournament> getTournaments();
}
