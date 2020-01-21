import { Component, OnInit } from "@angular/core";
import { AppServiceService } from "src/app/service/app-service.service";
import { Tournament } from "src/app/models/Tournament";
import { MatTableDataSource } from "@angular/material/table";
import { Match } from "src/app/models/Match";
import { Comment } from "src/app/models/Comment";

import { ActivatedRoute, Params, Router } from "@angular/router";

@Component({
  selector: "app-add-match",
  templateUrl: "./add-match.component.html",
  styleUrls: ["./add-match.component.css"]
})
export class AddMatchComponent implements OnInit {
  private tournament: Tournament;
  private matches: Match[];
  private dataSource: any;
  private temporarMatch: Match;
  private tournamentId: number;
  private firstPersonName: string;
  private secondPersonName: string;
  private matchResposne: Match;
  private id;
  private commentContent;
  private comment: Comment;

  constructor(
    private apiService: AppServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
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

  getTournamentMatches() {
    this.apiService.getTournament(this.id).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournament = data;
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
    "matchId",
    "firstPerson",
    "secondPerson",
    "round",
    "addSet"
  ];

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {}
  addMatch(
    match: Match,
    tournamentId: number,
    firstPersonName: string,
    secondPersonName: string
  ) {
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

          console.log(this.matchResposne);

          this.getTournamentMatches();
        },
        e => {
          console.log("Error: " + e.error);
        }
      );
  }

  addCommentButton() {
    console.log("Thid comment: " + this.comment.content);

    this.apiService.addComment(this.comment, this.id).subscribe(
      (comment: Comment) => {
        this.getTournamentMatches();
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
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
}
