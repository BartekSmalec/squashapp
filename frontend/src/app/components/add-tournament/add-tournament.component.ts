import { Component, OnInit } from "@angular/core";
import { Tournament } from "src/app/models/Tournament";
import { AppServiceService } from "src/app/service/app-service.service";

@Component({
  selector: "app-add-tournament",
  templateUrl: "./add-tournament.component.html",
  styleUrls: ["./add-tournament.component.css"]
})
export class AddTournamentComponent implements OnInit {
  tournament: Tournament;

  constructor(private apiService: AppServiceService) {}

  ngOnInit() {
    this.tournament = new Tournament();
  }

  addTournament() {
    console.log("Tournament: " + JSON.stringify(this.tournament));

    this.apiService.addTournament(this.tournament).subscribe(
      data => {
        console.log("Response" + JSON.stringify(data));
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }
}
