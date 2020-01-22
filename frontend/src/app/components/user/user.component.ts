import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AppServiceService } from "src/app/service/app-service.service";
import { UserService } from "src/app/service/user.service";
import { User } from "src/app/models/User";
import { Tournament } from 'src/app/models/Tournament';
import { TokenStorageService } from 'src/app/service/token-storage.service';

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  private userName: string;
  private user: User;
  private tournaments: Tournament[];
  private isLogged: boolean;

  constructor(
    private route: ActivatedRoute,
    private apiService: AppServiceService,
    private userService: UserService,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit() {
    this.user = new User();
    this.tournaments = new Array();
    this.routeIfNotLoggedIn();

    this.route.params.forEach((params: Params) => {
      if (params["userName"] !== undefined) {
        this.userName = params["userName"];
        console.log("Edit userName: " + this.userName);
      } else {
      }
      this.getUserByUserName();
      this.getTournamentsForUserName();
    });
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
  getUserByUserName() {
    this.userService.getUserByUserName(this.userName).subscribe(
      data => {
        console.log("Corrent: " + JSON.stringify(data));
        this.user = data;
        //this.openSnackBar("Removed", "OK");
      },
      e => {
        console.log("Error: " + e.error);
        //this.openSnackBar("You can't remove", "OK");
      }
    );
  }

  goToTournament(id: number) {
    const link = ["/tournament", id];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }

  getTournamentsForUserName()
  {
    this.apiService.getTournamentsForUserName(this.userName).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.tournaments = data;
        console.log("Tournament one: ", this.tournaments[0].tournamentName);
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }
}
