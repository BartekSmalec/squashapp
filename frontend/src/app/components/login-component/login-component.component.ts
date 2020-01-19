import { Component, OnInit } from "@angular/core";
import { AppServiceService } from "src/app/service/app-service.service";
import { LoginForm } from "src/app/models/loginForm.model";
import { TokenStorageService } from "src/app/service/token-storage.service";
import { Tournament } from 'src/app/models/Tournament';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: "app-login-component",
  templateUrl: "./login-component.component.html",
  styleUrls: ["./login-component.component.css"]
})
export class LoginComponentComponent implements OnInit {
  username: String;
  password: String;
  resposne: String;
  loginForm: LoginForm;
  isLogged: boolean;

  constructor(
    private appService: AppServiceService,
    private tokenStorage: TokenStorageService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.username = "";
    this.password = "";
    this.loginForm = new LoginForm();
    if (this.tokenStorage.getToken()) {
      this.isLogged = true;
      console.log("Is logger: " + this.isLogged);
      console.log("Username: " + this.tokenStorage.getUsername());
    }
  }

  login() {
    console.log(
      "Username:  " +
      this.loginForm.userName +
      " Password: " +
      this.loginForm.password
    );

    this.appService.login(this.loginForm).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);
        this.isLogged = true;
        this.openSnackBar("Correct login", "OK");

        setTimeout(() => {
          window.location.reload();
        },
          1000);

      },
      e => {
        console.log("Error: " + e.error);
        this.openSnackBar("Invalid username or passowrd", "OK");

      }
    );
  }

  logout() {
    this.tokenStorage.signOut();
    window.location.reload();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
