package io.squashapp.squashapp.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "tournament_match")
public class Match {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Long matchId;
    @OneToOne
    private User firstPerson;
    @OneToOne
    private User secondPerson;
    @JsonManagedReference
    @OneToMany(mappedBy = "match")
    private Set<MatchSet> matchSet;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;
    @Temporal(TemporalType.DATE)
    private Date date;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

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


    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long id) {
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
