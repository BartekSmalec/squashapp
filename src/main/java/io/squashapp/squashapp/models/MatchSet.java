package io.squashapp.squashapp.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name = "match_set")
public class MatchSet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "first_person")
    private int firstPerson;
    @Column(name = "second_person")
    private int secondPerson;
    @OneToOne
    private User winner;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    public User getWinner() {
        return winner;
    }

    public void setWinner(User winner) {
        this.winner = winner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getFirstPerson() {
        return firstPerson;
    }

    public void setFirstPerson(int firstPerson) {
        this.firstPerson = firstPerson;
    }

    public int getSecondPerson() {
        return secondPerson;
    }

    public void setSecondPerson(int secondPerson) {
        this.secondPerson = secondPerson;
    }

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }
}