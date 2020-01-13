package io.squashapp.squashapp.models;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "tournament_match")
public class Match {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private int matchId;
    @OneToOne
    private User firstPerson;
    @OneToOne
    private User secondPerson;
    @OneToMany(mappedBy = "match")
    private Set<MatchSet> matchSet;
    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    public Tournament getTournament() {
        return tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public int getRound() {
        return round;
    }

    public void setRound(int round) {
        this.round = round;
    }

    @Column(name="round")
    private int round;


    public int getMatchId() {
        return matchId;
    }

    public void setMatchId(int id) {
        this.matchId = id;
    }

    public User getFirstPerson() {
        return firstPerson;
    }

    public void setFirstPerson(User firstPerson) {
        this.firstPerson = firstPerson;
    }

    public User getSecondPerson() {
        return secondPerson;
    }

    public void setSecondPerson(User secondPerson) {
        this.secondPerson = secondPerson;
    }

    public Set<MatchSet> getMatchSet() {
        return matchSet;
    }

    public void setMatchSet(Set<MatchSet> matchSet) {
        this.matchSet = matchSet;
    }

}
