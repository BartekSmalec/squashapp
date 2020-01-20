import { Component, OnInit } from "@angular/core";
import { AppServiceService } from "src/app/service/app-service.service";
import { Tournament } from "src/app/models/Tournament";

@Component({
  selector: "app-my-tournaments",
  templateUrl: "./my-tournaments.component.html",
  styleUrls: ["./my-tournaments.component.css"]
})
export class MyTournamentsComponent implements OnInit {
  private tournaments: Tournament[];

  constructor(private apiService: AppServiceService) {}

  ngOnInit() {
    this.apiService.getMyTournaments().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournaments = data;
        console.log("Tournament one: ", this.tournaments[0].tournamentName);
        //this.dataSource = new MatTableDataSource(this.tournaments);
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }
}
