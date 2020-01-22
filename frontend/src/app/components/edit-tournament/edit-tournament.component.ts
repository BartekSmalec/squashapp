import { Component, OnInit } from "@angular/core";
import { AppServiceService } from "src/app/service/app-service.service";
import { Params, ActivatedRoute, Router } from "@angular/router";
import { Tournament } from "src/app/models/Tournament";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TokenStorageService } from 'src/app/service/token-storage.service';

@Component({
  selector: "app-edit-tournament",
  templateUrl: "./edit-tournament.component.html",
  styleUrls: ["./edit-tournament.component.css"]
})
export class EditTournamentComponent implements OnInit {
  private id: number;
  private tournament: Tournament;
  private isLogged: boolean;

  constructor(
    private apiService: AppServiceService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
    private tokenStorageService: TokenStorageService,
  ) {}

  ngOnInit() {
    this.routeIfNotLoggedIn();
    this.tournament = new Tournament();

    this.route.params.forEach((params: Params) => {
      if (params["id"] !== undefined) {
        this.id = +params["id"];
        console.log("Edit ID: " + this.id);
      } else {
      }
    });

    this.getTournament();
  }

  editTournament() {
    console.log("Tournament: " + JSON.stringify(this.tournament));

    this.apiService.addTournament(this.tournament).subscribe(
      data => {
        console.log("Response" + JSON.stringify(data));

        this.openSnackBar("Edited tournamet", "OK");

        const link = ["/tournamentList"];
        console.log("Link: " + JSON.stringify(link));

        setTimeout(() => {
          this.router.navigate(link);
        }, 2000);
      },
      e => {
        this.openSnackBar("Can't edit tournament", "OK");

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

  getTournament() {
    this.apiService.getTournament(this.id).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournament = data;
      },
      e => {
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
