import { Component, OnInit } from "@angular/core";
import { Tournament } from "src/app/models/Tournament";
import { AppServiceService } from "src/app/service/app-service.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TokenStorageService } from "src/app/service/token-storage.service";
import { TranslateService } from "@ngx-translate/core";

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
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.routeIfNotLoggedIn();
    this.tournament = new Tournament();
  }

  addTournament() {
    console.log("Tournament: " + JSON.stringify(this.tournament));
    if (this.validateTournamentForm()) {
      this.apiService.addTournament(this.tournament).subscribe(
        data => {
          console.log("Response" + JSON.stringify(data));

          this.openSnackBarForValidation("ADDTOURNAMENT.ADDED", "OK");

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


  validateTournamentForm(): boolean {
    if (
      this.tournament.tournamentName == undefined ||
      this.tournament.tournamentName == ""
    ) {
      this.openSnackBarForValidation("ADDTOURNAMENT.TNCANTBEEMPTY", "OK");

      return false;
    } else if (
      this.tournament.date == undefined ||
      this.tournament.date == ""
    ) {
      this.openSnackBarForValidation("ADDTOURNAMENT.DATECANTBEEMPTY", "OK");

      return false;
    } else if (
      this.tournament.city == undefined ||
      this.tournament.city == ""
    ) {
      this.openSnackBarForValidation("ADDTOURNAMENT.CITYCANTBEEMPTY", "OK");

      return false;
    } else if (
      this.tournament.country == undefined ||
      this.tournament.country == ""
    ) {
      this.openSnackBarForValidation("ADDTOURNAMENT.COUNTRYCANTBEEMPTY", "OK");

      return false;
    } else if (
      this.tournament.sportFacility == undefined ||
      this.tournament.sportFacility == ""
    ) {
      this.openSnackBarForValidation("ADDTOURNAMENT.SFCANTBEEMPTY", "OK");

      return false;
    } else if (
      this.tournament.category == undefined ||
      this.tournament.category == ""
    ) {
      this.openSnackBarForValidation("ADDTOURNAMENT.CATEGORYCANTBEEMPTY", "OK");

      return false;
    } else if (!this.isNumber(this.tournament.prize)) {
      this.openSnackBarForValidation("ADDTOURNAMENT.PRIZENUMERIC", "OK");

      return false;
    }
    else if (this.tournament.prize == undefined) {
      this.openSnackBarForValidation("ADDTOURNAMENT.PRIZECANTBEMPTY", "OK");

      return false;
    } else {
      return true;
    }
  }

  openSnackBarForValidation(annoucment: string, action: string) {
    this.translate.get(annoucment).subscribe((res: string) => {
      console.log("RES: " + res);
      this._snackBar.open(res, action, {
        duration: 2000
      });
    });
  }

  isNumber(value: string | number): boolean {
    return value != null && value !== "" && !isNaN(Number(value.toString()));
  }
}
