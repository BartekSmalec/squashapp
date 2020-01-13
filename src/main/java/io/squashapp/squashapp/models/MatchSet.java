package io.squashapp.squashapp.models;

import javax.persistence.*;

@Entity
@Table(name = "match_set")
public class MatchSet {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "first_person")
    private int firstPerson;
    @Column(name = "second_person")
    private int secondPerson;
    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    public int getId() {
        return id;
    }

    public void setId(int id) {
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