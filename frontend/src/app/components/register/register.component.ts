import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/User";
import { AppServiceService } from "src/app/service/app-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

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
  repeatedPassword: string;

  constructor(
    private apiService: AppServiceService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = new User();
    this.userResponse = new User();
    this.correctRegister = false;
    this.incorrectRegister = false;
    this.repeatedPassword = "";
  }

  register() {
    console.log(JSON.stringify(this.user));
    
    if(this.user.password === this.repeatedPassword)
    {
      
    this.apiService.registerUser(this.user).subscribe(
      (userResponse: User) => {
        this.userResponse = new User().deserialize(userResponse);

        console.log(this.userResponse);
        this.correctRegister = true;

        this.openSnackBar("Correct Register", "OK");

        const link = ["/login"];
        console.log("Link: " + JSON.stringify(link));

        setTimeout(() => {
          this.router.navigate(link);
        }, 2000);
      },
      e => {
        console.log("Error: " + e.status);

        this.incorrectRegister = true;

        if (e.status === 406) {
          this.openSnackBar("User already exist", "OK");
        } else {
          this.openSnackBar("Incorrect Register", "OK");
        }
      }
    );
    }
    else{
      this.openSnackBar("Password not equal", "OK");
    }

  }




  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000
    });
  }

  checkPasswords()
  {
  
  }
}
