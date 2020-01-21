import { Component, OnInit } from "@angular/core";
import { Tournament } from "src/app/models/Tournament";
import { AppServiceService } from "src/app/service/app-service.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-add-tournament",
  templateUrl: "./add-tournament.component.html",
  styleUrls: ["./add-tournament.component.css"]
})
export class AddTournamentComponent implements OnInit {
  tournament: Tournament;

  constructor(
    private apiService: AppServiceService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000
    });
  }
}
