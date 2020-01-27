import { Component, OnInit, ViewChild } from "@angular/core";

import { MatTableDataSource } from "@angular/material/table";
import { Tournament } from "src/app/models/Tournament";
import { AppServiceService } from "src/app/service/app-service.service";
import { MatPaginator } from "@angular/material/paginator";
import { TokenStorageService } from "src/app/service/token-storage.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { DialogPopupComponent } from '../dialog-popup/dialog-popup.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

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
  isLogged: boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private apiService: AppServiceService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.routeIfNotLoggedIn();

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

    this.getTournaments();
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

  ngOnChanges() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = [
    "tournamentName",
    "date",
    "view",
    "join",
    "unjoin",
    "addMatch",
    "edit",
    "delete"
  ];
  //dataSource = new MatTableDataSource(ELEMENT_DATA);

  getTournaments() {
    this.apiService.getTournaments().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournaments = data;
        console.log("Tournament one: ", this.tournaments[0].tournamentName);
        //this.tournaments.sort(this.compareTournament);
        this.dataSource = new MatTableDataSource(this.tournaments);
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editTournament(id: number) {
    console.log("Numer: " + id);
    const link = ["/editTournament", id];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }

  compareTournament(a, b) {
    if (a.tournamentId < b.tournamentId) {
      return 1;
    }
    if (a.tournamentId > b.tournamentId) {
      return -1;
    }
    return 0;
  }

  deleteTournament(id: number) {
    this.translate.get("LISTOFTOURNAMENTS").subscribe((res: Array<String>) => {
      console.log("RES: " + JSON.stringify(res["DELETE"]));
      this.openDialog(res["DELETE"], res["QUESTION"], id);
    });
  }

  deleteTournamentApi(id: number) {
    this.apiService.deleteService(id).subscribe(
      data => {
        console.log("Corrent: " + JSON.stringify(data));
        this.openSnackBarForDelete("LISTOFTOURNAMENTS.CDELETE", "OK")
        this.getTournaments();


        if (this.tournaments[0] == undefined) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

      },
      e => {
        console.log("Error: " + e.error);
        this.openSnackBarForDelete("LISTOFTOURNAMENTS.UCDELTE", "OK")
      }
    );
  }

  openSnackBarForDelete(annoucment: string, action: string) {
    this.translate.get(annoucment).subscribe((res: string) => {
      console.log("RES: " + res);
      this._snackBar.open(res, action, {
        duration: 2000
      });
    });
  }


  goToMatch(id: number) {
    const link = ["/addMatch", id];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }

  goToTournament(id: number) {
    const link = ["/tournament", id];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }

  join(id: number) {
    this.apiService.addParticipant(id).subscribe(
      data => {
        console.log("Corrent: " + JSON.stringify(data));
        this.openSnackBarForValidation("LISTOFTOURNAMENTS.JOINED", "OK");
      },
      e => {
        console.log("Error: " + e.error);
        this.openSnackBarForValidation("LISTOFTOURNAMENTS.YOUJOINED", "OK");
      }
    );
  }

  unjoin(id: number) {
    this.apiService.removeParticipant(id).subscribe(
      data => {
        console.log("Corrent: " + JSON.stringify(data));
        this.openSnackBarForValidation("LISTOFTOURNAMENTS.UNJOINED", "OK");
      },
      e => {
        console.log("Error: " + e.error);
        this.openSnackBarForValidation("LISTOFTOURNAMENTS.CANTUNJOIN", "OK");
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000
    });
  }


  openSnackBarForValidation(annoucment: string, action: string) {
    this.translate.get(annoucment).subscribe((res: string) => {
      console.log("RES: " + res);
      this._snackBar.open(res, action, {
        duration: 2000
      });
    });
  }

  openDialog(action: String, message: String, id: number): void {
    let dialogRef = this.dialog.open(DialogPopupComponent, {
      width: '60%',
      data: { action: action, message: message }
    }).afterClosed()
      .subscribe(response => {
        console.log("Response: " + JSON.stringify(response));

        if (response == true) {
          this.deleteTournamentApi(id);
        }
        else {
          console.log("Can't delete");
        }


      });
  }
}
