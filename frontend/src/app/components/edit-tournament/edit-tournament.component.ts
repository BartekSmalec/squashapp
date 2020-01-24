import { Component, OnInit } from "@angular/core";
import { AppServiceService } from "src/app/service/app-service.service";
import { Params, ActivatedRoute, Router } from "@angular/router";
import { Tournament } from "src/app/models/Tournament";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,
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

    if(this.validateTournamentForm()){

    this.apiService.addTournament(this.tournament).subscribe(
      data => {
        console.log("Response" + JSON.stringify(data));

        //this.openSnackBar("Edited tournamet", "OK");
        this.openSnackBarForValidation("ADDTOURNAMENT.EDITED", "OK");

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
