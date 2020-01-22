import { Component, OnInit } from "@angular/core";
import { AppServiceService } from "src/app/service/app-service.service";
import { Tournament } from "src/app/models/Tournament";
import { Router } from "@angular/router";

@Component({
  selector: "app-my-tournaments",
  templateUrl: "./my-tournaments.component.html",
  styleUrls: ["./my-tournaments.component.css"]
})
export class MyTournamentsComponent implements OnInit {
  private tournaments: Tournament[];

  constructor(private apiService: AppServiceService, private router: Router) {}

  ngOnInit() {
    this.apiService.getMyTournaments().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournaments = data;
        console.log("Tournament one: ", this.tournaments[0].tournamentName);
        //this.dataSource = new MatTableDataSource(this.tournaments);
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }

  goToTournament(id: number) {
    const link = ["/tournament", id];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }
}
