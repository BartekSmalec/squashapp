import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { AppServiceService } from "src/app/service/app-service.service";
import { UserService } from "src/app/service/user.service";
import { User } from "src/app/models/User";
import { Tournament } from 'src/app/models/Tournament';

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  private userName: string;
  private user: User;
  private tournaments: Tournament[];

  constructor(
    private route: ActivatedRoute,
    private apiService: AppServiceService,
    private userService: UserService
  ) {}

  ngOnInit() {
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
