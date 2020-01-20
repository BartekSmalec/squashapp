import { Component, OnInit } from "@angular/core";
import { MatchSet } from "src/app/models/MatchSet";
import { ActivatedRoute, Params } from "@angular/router";
import { AppServiceService } from "src/app/service/app-service.service";
import { MatTableDataSource } from "@angular/material/table";

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
  private active: boolean;

  constructor(
    private route: ActivatedRoute,
    private apiService: AppServiceService
  ) {}

  ngOnInit() {
    this.matchSets = [];
    this.matchSet = new MatchSet();
    this.active = true;

    this.route.params.forEach((params: Params) => {
      if (params["id"] !== undefined) {
        this.id = +params["id"];
        console.log("ID: " + this.id);
      } else {
      }
    });

    this.getSetsWithMatchId();
  }

  addSet() {
    if (this.matchSets.length >= 4) {
      this.active = false;
    }

    if (this.matchSets.length < 5) {
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
}
