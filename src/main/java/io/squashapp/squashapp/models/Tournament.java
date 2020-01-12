package io.squashapp.squashapp.models;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "tournament")
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "tournament_id")
    private int tournamentId;
    @Column(name = "tournament_name")
    private String tournamentName;
    @Temporal(TemporalType.DATE)
    private Date date;
    @Column(name = "city")
    private String city;
    @Column(name = "country")
    private String country;

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

    public int getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(int id) {
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
