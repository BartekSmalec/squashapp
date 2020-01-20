package io.squashapp.squashapp.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "tournament")
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "tournament_id")
    private Long tournamentId;
    @Column(name = "tournament_name")
    private String tournamentName;
    @Temporal(TemporalType.DATE)
    private Date date;
    @Column(name = "city")
    private String city;
    @Column(name = "country")
    private String country;

    @JsonManagedReference
    @OneToMany(mappedBy = "tournament")
    private Set<Match> matches;
    @Column(name = "sport_facility")
    private String sportFacility;
    @Column(name = "category")
    private String category;
    @Column(name = "men")
    private Boolean men;
    @Column(name = "woman")
    private Boolean woman;
    @Column(name = "prize")
    private int prize;

    @JsonManagedReference
    @OneToMany(mappedBy = "tournament", fetch = FetchType.EAGER)
    private Set<Comment> comments;

    @JoinTable(
            name = "course_like",
            joinColumns = @JoinColumn(name = "tournament_id"),
            inverseJoinColumns = @JoinColumn(name = "id"))
    @ManyToMany
    Set<User> participants;

    public Set<User> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<User> participants) {
        this.participants = participants;
    }

    public Set<Match> getMatches() {
        return matches;
    }

    public void setMatches(Set<Match> matches) {
        this.matches = matches;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    public Long getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(Long id) {
        this.tournamentId = id;
    }

    public String getTournamentName() {
        return tournamentName;
    }

    public void setTournamentName(String tournamentName) {
        this.tournamentName = tournamentName;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getSportFacility() {
        return sportFacility;
    }

    public void setSportFacility(String sportFacility) {
        this.sportFacility = sportFacility;
    }

    public int getPrize() {
        return prize;
    }

    public void setPrize(int prize) {
        this.prize = prize;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Boolean getMen() {
        return men;
    }

    public void setMen(Boolean men) {
        this.men = men;
    }

    public Boolean getWoman() {
        return woman;
    }

    public void setWoman(Boolean woman) {
        this.woman = woman;
    }
}
