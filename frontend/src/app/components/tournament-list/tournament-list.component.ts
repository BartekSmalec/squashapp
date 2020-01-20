import { Component, OnInit, ViewChild } from "@angular/core";

import { MatTableDataSource } from "@angular/material/table";
import { Tournament } from "src/app/models/Tournament";
import { AppServiceService } from "src/app/service/app-service.service";
import { MatPaginator } from "@angular/material/paginator";
import { TokenStorageService } from "src/app/service/token-storage.service";
import { Router } from "@angular/router";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H" },
  { position: 2, name: "Helium", weight: 4.0026, symbol: "He" },
  { position: 3, name: "Lithium", weight: 6.941, symbol: "Li" },
  { position: 4, name: "Beryllium", weight: 9.0122, symbol: "Be" },
  { position: 5, name: "Boron", weight: 10.811, symbol: "B" },
  { position: 6, name: "Carbon", weight: 12.0107, symbol: "C" },
  { position: 7, name: "Nitrogen", weight: 14.0067, symbol: "N" },
  { position: 8, name: "Oxygen", weight: 15.9994, symbol: "O" },
  { position: 9, name: "Fluorine", weight: 18.9984, symbol: "F" },
  { position: 10, name: "Neon", weight: 20.1797, symbol: "Ne" }
];

@Component({
  selector: "app-tournament-list",
  templateUrl: "./tournament-list.component.html",
  styleUrls: ["./tournament-list.component.css"]
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[];
  dataSource: any;
  isAdmin: boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private apiService: AppServiceService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.tokenStorageService.getAuthorities().includes("ROLE_ADMIN")) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    console.log(
      "Is admin? " +
        this.tokenStorageService.getAuthorities() +
        " " +
        this.isAdmin
    );

    this.apiService.getTournaments().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournaments = data;
        console.log("Tournament one: ", this.tournaments[0].tournamentName);
        this.dataSource = new MatTableDataSource(this.tournaments);
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }

  ngOnChanges() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = [
    "tournamentId",
    "tournamentName",
    "addMatch",
    "join",
    "edit",
    "delete"
  ];
  //dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editTournament(id: number) {
    console.log("Numer: " + id);
  }

  goToMatch(id: number) {
    const link = ["/addMatch", id];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }

  join(id: number) {
    this.apiService.addParticipant(id).subscribe(
      data => {
        console.log("Corrent: " + JSON.stringify(data));
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }
}
