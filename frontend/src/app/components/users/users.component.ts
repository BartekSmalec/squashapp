import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AppServiceService } from "src/app/service/app-service.service";
import { Tournament } from "src/app/models/Tournament";
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { User } from 'src/app/models/User';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DialogPopupComponent } from '../dialog-popup/dialog-popup.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';



@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements OnInit {
  private id: number;
  private tournament: Tournament;
  private isLogged: boolean;
  private users: User[];
  private isAdmin: boolean;
  private dataSource: any;
  private dialogPopupRef: MatDialogRef<DialogPopupComponent>;


  constructor(
    private route: ActivatedRoute,
    private apiService: AppServiceService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.routeIfNotLoggedIn();
    this.tournament = new Tournament();
    this.users = new Array();

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

    // this.route.params.forEach((params: Params) => {
    //   if (params["id"] !== undefined) {
    //     this.id = +params["id"];
    //     console.log("ID: " + this.id);
    //   } else {
    //   }
    // });

    this.getUsers();
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

  displayedColumns: string[] = [
    "user",
    "view",
    "edit",
    "delete"
  ];

  getUsers() {
    this.apiService.getUsers().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.users = data;

        this.dataSource = new MatTableDataSource(this.users);

        console.log("Users", this.users);
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(userName: string) {
    this.goToEdtiUser(userName);
  }

  openSnackBarForDelete(annoucment: string, action: string) {
    this.translate.get(annoucment).subscribe((res: string) => {
      console.log("RES: " + res);
      this._snackBar.open(res, action, {
        duration: 2000
      });
    });
  }


  deleteUser(userName: string) {
    this.translate.get("LISTOFTOURNAMENTS").subscribe((res: Array<String>) => {
      console.log("RES: " + JSON.stringify(res["DELETE"]));
      this.openDialog(res["DELETE"], res["QUESTION"], userName);
    });
  }

  deleteUserApi(userName: string) {
    this.apiService.deleteUser(userName).subscribe(
      data => {
        console.log("Corrent: " + JSON.stringify(data));
        this.openSnackBarForDelete("LISTOFTOURNAMENTS.CDELETE", "OK")
        this.getUsers();

        if (this.users[0] == undefined) {
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000
    });
  }


  goToUserProfile(userName: string) {
    const link = ["/user", userName];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }

  goToEdtiUser(userName: string) {
    const link = ["/editUser", userName];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }

  openDialog(action: String, message: String, userName: string): void {
    let dialogRef = this.dialog.open(DialogPopupComponent, {
      width: '60%',
      data: { action: action, message: message }
    }).afterClosed()
      .subscribe(response => {
        console.log("Response: " + JSON.stringify(response));

        if (response == true) {
          this.deleteUserApi(userName);
        }
        else {

        }


      });
  }
}
