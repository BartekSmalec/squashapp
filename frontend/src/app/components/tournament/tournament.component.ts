import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { AppServiceService } from "src/app/service/app-service.service";
import { Tournament } from "src/app/models/Tournament";

@Component({
  selector: "app-tournament",
  templateUrl: "./tournament.component.html",
  styleUrls: ["./tournament.component.css"]
})
export class TournamentComponent implements OnInit {
  private id: number;
  private tournament: Tournament;

  constructor(
    private route: ActivatedRoute,
    private apiService: AppServiceService
  ) {}

  ngOnInit() {
    this.tournament = new Tournament();

    this.route.params.forEach((params: Params) => {
      if (params["id"] !== undefined) {
        this.id = +params["id"];
        console.log("ID: " + this.id);
      } else {
      }
    });

    this.getTournament();
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
}
