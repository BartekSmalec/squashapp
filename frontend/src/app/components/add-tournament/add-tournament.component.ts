import { Component, OnInit } from "@angular/core";
import { Tournament } from "src/app/models/Tournament";
import { AppServiceService } from "src/app/service/app-service.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TokenStorageService } from 'src/app/service/token-storage.service';

@Component({
  selector: "app-add-tournament",
  templateUrl: "./add-tournament.component.html",
  styleUrls: ["./add-tournament.component.css"]
})
export class AddTournamentComponent implements OnInit {
  private tournament: Tournament;
  private isLogged: boolean;

  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private tokenStorageService: TokenStorageService,
  ) {}

  ngOnInit() {
    this.routeIfNotLoggedIn();
    this.tournament = new Tournament();
  }

  addTournament() {
    console.log("Tournament: " + JSON.stringify(this.tournament));

    this.apiService.addTournament(this.tournament).subscribe(
      data => {
        console.log("Response" + JSON.stringify(data));

        this.openSnackBar("Added tournamet", "OK");

        const link = ["/tournamentList"];
        console.log("Link: " + JSON.stringify(link));

        setTimeout(() => {
          this.router.navigate(link);
        }, 2000);
      },
      e => {

        this.openSnackBar("Can't add tournament", "OK");

        console.log("Error: " + e.error);
      }
    );
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000
    });
  }
}
