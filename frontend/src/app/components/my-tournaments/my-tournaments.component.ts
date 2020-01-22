import { Component, OnInit } from "@angular/core";
import { AppServiceService } from "src/app/service/app-service.service";
import { Tournament } from "src/app/models/Tournament";
import { Router } from "@angular/router";
import { TokenStorageService } from "src/app/service/token-storage.service";

@Component({
  selector: "app-my-tournaments",
  templateUrl: "./my-tournaments.component.html",
  styleUrls: ["./my-tournaments.component.css"]
})
export class MyTournamentsComponent implements OnInit {
  private tournaments: Tournament[];
  private isLogged: boolean;

  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit() {
    this.routeIfNotLoggedIn();
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

  routeIfNotLoggedIn() {
    if (!this.tokenStorageService.getToken()) {
      this.isLogged = false;

      const link = ["/login"];
      console.log("Link: " + JSON.stringify(link));
      this.router.navigate(link);
      console.log("Is logger: " + this.isLogged);
      console.log("Username: " + this.tokenStorageService.getUsername());
    }
  }
}
