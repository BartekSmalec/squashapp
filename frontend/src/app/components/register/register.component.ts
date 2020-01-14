import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/User";
import { AppServiceService } from "src/app/service/app-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  user: User;
  userResponse: User;
  correctRegister: boolean;
  incorrectRegister: boolean;

  constructor(private apiService: AppServiceService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.user = new User();
    this.userResponse = new User();
    this.correctRegister = false;
    this.incorrectRegister = false;
  }

  register() {
    console.log(JSON.stringify(this.user));
    this.apiService.registerUser(this.user).subscribe(
      (userResponse: User) => {
        this.userResponse = new User().deserialize(userResponse);

        console.log(this.userResponse);
        this.correctRegister = true;

        this.openSnackBar("Correct Register", "OK");
      },
      e => {
        console.log("Error: " + e.error);

        this.incorrectRegister = true;

        this.openSnackBar("Incorrect Register", "OK");

      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
