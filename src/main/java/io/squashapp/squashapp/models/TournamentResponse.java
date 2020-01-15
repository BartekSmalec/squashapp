package io.squashapp.squashapp.models;

import java.util.ArrayList;

public class TournamentResponse {
    private int total;
    private ArrayList<Tournament> tournaments;

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public ArrayList<Tournament> getTournaments() {
        return tournaments;
    }

    public void setTournaments(ArrayList<Tournament> tournaments) {
        this.tournaments = tournaments;
    }
}
