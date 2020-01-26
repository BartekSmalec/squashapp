import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges, Input } from "@angular/core";
import { AppServiceService } from "src/app/service/app-service.service";
import { Tournament } from "src/app/models/Tournament";
import { MatTableDataSource } from "@angular/material/table";
import { Match } from "src/app/models/Match";
import { Comment } from "src/app/models/Comment";

import { ActivatedRoute, Params, Router } from "@angular/router";
import { TokenStorageService } from "src/app/service/token-storage.service";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-add-match",
  templateUrl: "./add-match.component.html",
  styleUrls: ["./add-match.component.css"]
})
export class AddMatchComponent implements OnInit {

  private tournament: Tournament;
  private tournamentCopy: Tournament;
  private matches: Match[];
  private dataSource: any;
  private temporarMatch: Match;
  private tournamentId: number;
  private firstPersonName: String;
  private secondPersonName: String;
  private firstPersonNameCopy: String;
  private secondPersonNameCopy: String;
  private matchResposne: Match;
  private id;
  private commentContent;
  private comment: Comment;
  private isLogged: boolean;

  constructor(
    private apiService: AppServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private translate: TranslateService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.routeIfNotLoggedIn();
    this.commentContent = "";
    this.comment = new Comment();
    this.route.params.forEach((params: Params) => {
      if (params["id"] !== undefined) {
        this.id = +params["id"];
        console.log("ID: " + this.id);
      } else {
      }
    });

    this.temporarMatch = new Match();
    this.matchResposne = new Match();

    this.getTournamentMatches();
  }


  removeSecondPerson(x: any) {
    console.log("Changes in: " + this.secondPersonName)
   
    for (var i = this.tournament.participants.length - 1; i >= 0; --i) {
      if (this.tournament.participants[i].userName == this.secondPersonName) {
        this.tournament.participants.splice(i, 1);
      }
    }

    console.log("Changes in: " + JSON.stringify(this.tournament.participants));
    console.log("Copy: " + this.secondPersonNameCopy);


  }
  removeFirstPerson(x: any) {
    console.log("Changes in: " + this.firstPersonName)
  
    for (var i = this.tournamentCopy.participants.length - 1; i >= 0; --i) {
      if (this.tournamentCopy.participants[i].userName == this.firstPersonName) {
        this.tournamentCopy.participants.splice(i, 1);
      }
    }

    console.log("Changes in copy: " + JSON.stringify(this.tournamentCopy.participants));
    console.log("Copy: " + this.firstPersonNameCopy);

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

  getTournamentMatches() {
    this.apiService.getTournament(this.id).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournament = data;
        this.tournamentCopy = JSON.parse(JSON.stringify(this.tournament));
        this.tournament.comments.sort(this.compare);

        console.log("Tournament one: ", this.tournament);
        this.matches = this.tournament.matches;

        this.matches.sort(this.compareMatches);

        this.dataSource = new MatTableDataSource(this.matches);
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }

  displayedColumns: string[] = [
    "round",
    "firstPerson",
    "secondPerson",
    "addSet"
  ];

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() { }
  addMatch(
    match: Match,
    tournamentId: number,
    firstPersonName: string,
    secondPersonName: string
  ) {
    if (this.validateAddMatchForm()) {
      console.log(
        "Date: " +
        this.temporarMatch.date +
        "Round: " +
        this.temporarMatch.round +
        this.firstPersonName +
        this.secondPersonName
      );

      this.apiService
        .addMatch(
          this.temporarMatch,
          this.id,
          this.firstPersonName,
          this.secondPersonName
        )
        .subscribe(
          (match: Match) => {
            this.matchResposne = new Match().deserialize(match);

            //this.openSnackBar("ADDMATCH.DATECANTBENULL", "OK");

            console.log(this.matchResposne);

            this.getTournamentMatches();
          },
          e => {
            console.log("Error: " + e.error);
          }
        );
    }
  }

  addCommentButton() {
    console.log("Thid comment: " + this.comment.content);

    if (this.validateCommentForm()) {
      this.apiService.addComment(this.comment, this.id).subscribe(
        (comment: Comment) => {
          this.getTournamentMatches();
        },
        e => {
          console.log("Error: " + e.error);
        }
      );
    }
  }

  compare(a, b) {
    if (a.id < b.id) {
      return 1;
    }
    if (a.id > b.id) {
      return -1;
    }
    return 0;
  }

  compareMatches(a, b) {
    if (a.matchId < b.matchId) {
      return -1;
    }
    if (a.matchId > b.matchId) {
      return 1;
    }
    return 0;
  }

  goToSets(id: number) {
    const link = ["/addSet", id, this.id];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }

  goToUserProfile(userName: string) {
    const link = ["/user", userName];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }

  validateAddMatchForm(): boolean {
    if (this.firstPersonName == undefined || this.firstPersonName == "") {
      this.openSnackBar("ADDMATCH.FPCANTBENULL", "OK");

      return false;
    } else if (
      this.secondPersonName == undefined ||
      this.secondPersonName == ""
    ) {
      this.openSnackBar("ADDMATCH.SPCANTBENULL", "OK");

      return false;
    } else if (this.temporarMatch.round == undefined) {
      this.openSnackBar("ADDMATCH.ROUNDCANTBEEMPTY", "OK");

      return false;
    } else if (!this.isNumber(this.temporarMatch.round)) {
      this.openSnackBar("ADDMATCH.ROUNDMUSTBENUMERIC", "OK");

      return false;
    } else if (
      this.temporarMatch.date == undefined ||
      this.temporarMatch.date == ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  validateCommentForm(): boolean {
    if (this.comment.content == undefined || this.comment.content == "") {
      this.openSnackBar("ADDMATCH.COMMENTCANTBENULL", "OK");

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
