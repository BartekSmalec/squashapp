import { Component, OnInit } from "@angular/core";
import { MatchSet } from "src/app/models/MatchSet";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AppServiceService } from "src/app/service/app-service.service";
import { MatTableDataSource } from "@angular/material/table";
import { Tournament } from "src/app/models/Tournament";
import { TokenStorageService } from "src/app/service/token-storage.service";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-add-set",
  templateUrl: "./add-set.component.html",
  styleUrls: ["./add-set.component.css"]
})
export class AddSetComponent implements OnInit {
  private matchSets: MatchSet[];
  private matchSet: MatchSet;
  private id: number;
  private username: string;
  private dataSource: any;
  private tournament: Tournament;
  private tournamentId: number;
  private active: boolean;
  private isLogged: boolean;

  constructor(
    private route: ActivatedRoute,
    private apiService: AppServiceService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private translate: TranslateService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.routeIfNotLoggedIn();
    this.matchSets = [];
    this.matchSet = new MatchSet();
    this.tournament = new Tournament();
    this.active = true;

    this.route.params.forEach((params: Params) => {
      if (params["id"] !== undefined) {
        this.id = +params["id"];
        this.tournamentId = +params["tournamentId"];
        console.log("ID: " + this.id);
        console.log("TournamentId: " + this.tournamentId);
      } else {
      }
    });

    this.getSetsWithMatchId();
    this.getTournamentMatches();
  }

  addSet() {
    if (this.validateSetForm()) {
      if (this.matchSets.length >= (this.tournament.numOfSets - 1)) {
        this.active = false;
      }

      if (this.matchSets.length < (this.tournament.numOfSets)) {
        this.apiService
          .addMatchSet(this.matchSet, this.id, this.username)
          .subscribe(
            () => {
              this.getSetsWithMatchId();
            },
            e => {
              console.log("Error: " + e.error);
            }
          );
        console.log("Length: " + this.matchSets.length);
        console.log(JSON.stringify(this.matchSet));
      }
    }
  }

  displayedColumns: string[] = ["Id", "firstPerson", "secondPerson", "winner"];

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSetsWithMatchId() {
    this.apiService.getMatchSetsMatchId(this.id).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.matchSets = data;
        console.log("Length: " + this.matchSets.length);
        console.log(
          "UserName: " + JSON.stringify(this.matchSets[0].winner.userName)
        );
        this.dataSource = new MatTableDataSource(this.matchSets);
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }

  getTournamentMatches() {
    this.apiService.getTournament(this.tournamentId).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournament = data;
        console.log(
          "Tournament one: " + JSON.stringify(this.tournament.participants)
        );
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }

  goToUserProfile(userName: string) {
    const link = ["/user", userName];
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

  validateSetForm(): boolean {
    if (this.matchSet.firstPerson == undefined) {
      this.openSnackBar("ADDSET.FPCANTBENULL", "OK");

      return false;
    } else if (this.matchSet.secondPerson == undefined) {
      this.openSnackBar("ADDSET.SPCANTBENULL", "OK");

      return false;
    } else if (!this.isNumber(this.matchSet.firstPerson)) {
      this.openSnackBar("ADDSET.FPCANTBEASTRING", "OK");

      return false;
    } else if (!this.isNumber(this.matchSet.secondPerson)) {
      this.openSnackBar("ADDSET.SPCANTBEASTRING", "OK");

      return false;
    } else if (this.username == undefined || this.username == "") {
      this.openSnackBar("ADDSET.WINNERCANTBENULL", "OK");

      return false;
    } else {
      return true;
    }
  }

  openSnackBar(annoucment: string, action: string) {
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

