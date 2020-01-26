import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AppServiceService } from "src/app/service/app-service.service";
import { Tournament } from "src/app/models/Tournament";
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { User } from 'src/app/models/User';

@Component({
  selector: "app-tournament",
  templateUrl: "./tournament.component.html",
  styleUrls: ["./tournament.component.css"]
})
export class TournamentComponent implements OnInit {
  private id: number;
  private tournament: Tournament;
  private isLogged: boolean;
  private winner: User;

  constructor(
    private route: ActivatedRoute,
    private apiService: AppServiceService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.routeIfNotLoggedIn();
    this.tournament = new Tournament();

    this.route.params.forEach((params: Params) => {
      if (params["id"] !== undefined) {
        this.id = +params["id"];
        console.log("ID: " + this.id);
      } else {
      }
    });

    this.getTournament();
    this.getWinner();
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

  getTournament() {
    this.apiService.getTournament(this.id).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournament = data;

        console.log("Tournament one: ", this.tournament);
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }
  getWinner()
  {
    this.apiService.getWinner(this.id).subscribe(
      data => {
        this.winner = data;

      },
      e=>
      {
        console.log("Error: " + e.error);

      }
    );
  }
  
  goToUserProfile(userName: string) {
    const link = ["/user", userName];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }
}
